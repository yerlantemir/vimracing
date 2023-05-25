import _ from 'lodash';
import { PlayerCard } from '@/components/PlayerCard';
import { Player, RaceStatus } from '@vimracing/shared';
import { useMemo } from 'react';

interface PlayersProps {
  players: Player[];
  currentPlayer: Player;
  raceStatus: RaceStatus;
  raceDocsCount?: number;
  onCurrentPlayerUsernameChangeCallback?: (newUsername: string) => void;
}
export const Players: React.FC<PlayersProps> = ({
  players,
  currentPlayer,
  raceStatus,
  raceDocsCount, // to show the progress bar in the waiting state component
  onCurrentPlayerUsernameChangeCallback
}) => {
  const allPlayers = useMemo(
    () =>
      _.sortBy(
        [currentPlayer, ...players],
        ['raceData.currentDocIndex', 'raceData.completeness']
      ).reverse(),
    [currentPlayer, players]
  );

  if (!players || !currentPlayer) return null;
  return (
    <div className="flex gap-4">
      <div
        className="flex flex-col gap-3 grow justify-start overflow-y-scroll"
        style={{ maxHeight: '120px' }}
      >
        {allPlayers.map((player) => {
          return (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentUser={player.id === currentPlayer.id}
              raceStatus={raceStatus}
              raceDocsCount={raceDocsCount || 1}
              onUsernameChangeCallback={onCurrentPlayerUsernameChangeCallback}
            />
          );
        })}
      </div>
    </div>
  );
};
