'use client';

import { Player, RaceState } from '@vimracing/shared';
import { ProgressBar } from './pages/race/ProgressBar';

type PlayerCardProps = {
  isCurrentUser: boolean;
  raceStatus?: RaceState;
  raceDocsCount: number;
  player: Player;
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  isCurrentUser,
  player,
  raceDocsCount,
  raceStatus
}) => {
  const { username, raceData } = player;

  const completeness = raceData?.completeness ?? 0;
  const currentDocIndex = raceData?.currentDocIndex ?? 0;
  return (
    <div
      className="flex"
      style={{ background: isCurrentUser ? '#4a505a' : '' }}
    >
      <div
        className="flex py-0 gap-4 items-center text-gray-2"
        style={{ width: '10%' }}
      >
        <span className="opacity-80">{username}</span>
      </div>

      <ProgressBar
        tasksCount={raceDocsCount}
        currentTaskIndex={currentDocIndex}
        currentTaskCompleteness={completeness}
        className="pr-4"
      />
    </div>
  );
};
