'use client';

import { ContentCard } from '@/components/ContentCard';
import { RaceOnState } from '@/components/pages/race/RaceOnState';
import { WaitingState } from '@/components/pages/race/WaintingState';
import { useRace } from '@/hooks/useRace';
import { RaceState } from '@vimracing/shared';

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
    onCurrentPlayerUsernameChange
  } = useRace(raceId);

  const renderRaceByStatus = () => {
    switch (raceStatus) {
      case RaceState.WAITING:
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
      case RaceState.ON:
        return (
          raceDocs && (
            <RaceOnState
              raceDocs={raceDocs}
              onDocChange={onDocChange}
              players={players}
              currentPlayer={currentPlayer}
              raceTimer={raceTimer || 0}
            />
          )
        );
      case RaceState.FINISHED:
        return <div>finished</div>;
    }
  };
  return (
    <ContentCard>
      <div className="flex flex-col gap-4">{renderRaceByStatus()}</div>
    </ContentCard>
  );
}
