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
    raceDoc,
    raceTimer,
    currentPlayer,
    onDocChange,
    isHost,
    onHostRaceStartClick
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
          />
        );
      case RaceState.ON:
        return (
          <RaceOnState
            raceDoc={raceDoc}
            onDocChange={onDocChange}
            players={players}
            currentPlayer={currentPlayer}
          />
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
