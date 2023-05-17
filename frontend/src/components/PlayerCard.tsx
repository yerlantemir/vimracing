'use client';

import { RaceState } from '@vimracing/shared';
import { ProgressBar } from './pages/race/ProgressBar';

type PlayerCardProps = {
  username: string;
  completeness: number;
  isCurrentUser: boolean;
  raceStatus?: RaceState;
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  isCurrentUser,
  username,
  completeness,
  raceStatus
}) => {
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
        tasksCount={5}
        currentTaskIndex={2}
        currentTaskCompleteness={15}
        className="pr-4"
      />
    </div>
  );
};
