'use client';

import { ContentCard } from '@/components/ContentCard';
import { RaceState } from '@/components/pages/race/RaceState';
import { WaitingState } from '@/components/pages/race/WaintingState';
import { useRace } from '@/hooks/useRace';
import { RaceStatus } from '@vimracing/shared';

export default function RacePage({ params }: { params: { raceId: string } }) {
  const { raceId } = params;
  const {
    players,
    raceStatus,
    raceDocs,
    raceTimer,
    currentPlayer,
    onDocChange,
    isHost,
    onHostRaceStartClick,
    onCurrentPlayerUsernameChange,
    onCurrentPlayerRaceFinish
  } = useRace(raceId);

  const renderRaceByStatus = () => {
    switch (raceStatus) {
      case RaceStatus.WAITING:
        return (
          <WaitingState
            raceTimer={raceTimer}
            players={players}
            currentPlayer={currentPlayer}
            onHostRaceStartClick={onHostRaceStartClick}
            isHost={isHost}
            onCurrentPlayerUsernameChangeCallback={
              onCurrentPlayerUsernameChange
            }
          />
        );
      default:
        return (
          raceDocs && (
            <RaceState
              raceDocs={raceDocs}
              onDocChange={onDocChange}
              onRaceFinish={onCurrentPlayerRaceFinish}
              players={players}
              currentPlayer={currentPlayer}
              raceTimer={raceTimer || 0}
              raceStatus={raceStatus as RaceStatus}
            />
          )
        );
    }
  };
  return (
    <ContentCard>
      <div className="flex flex-col gap-4">{renderRaceByStatus()}</div>
    </ContentCard>
  );
}
