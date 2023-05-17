'use client';

import { RaceState } from '@vimracing/shared';

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
    <div style={{ background: isCurrentUser ? '#4a505a' : '' }}>
      <div
        style={{
          width: '60%'
        }}
        className="flex py-0 gap-4 items-center text-gray-2"
      >
        <span className="opacity-80" style={{ width: '25%' }}>
          {username}
        </span>
        {raceStatus !== RaceState.WAITING && (
          <span className="opacity-50">{completeness}%</span>
        )}
      </div>
    </div>
  );
};
