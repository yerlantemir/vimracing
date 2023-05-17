import { PlayerCard } from '@/components/PlayerCard';
import { Player, RaceState } from '@vimracing/shared';

interface PlayersProps {
  players: Player[];
  currentPlayer: Player;
  raceStatus: RaceState;
}
export const Players: React.FC<PlayersProps> = ({
  players,
  currentPlayer,
  raceStatus
}) => {
  if (!players || !currentPlayer) return null;

  const allPlayers = [currentPlayer, ...players];
  const currentPlayerPlace =
    allPlayers
      ?.sort((a, b) => (b.completeness ?? 0) - (a.completeness ?? 0))
      ?.findIndex((user) => user.id === currentPlayer?.id) + 1;

  return (
    <div className="flex gap-4">
      <div
        className="flex flex-col gap-3 grow justify-start overflow-y-scroll"
        style={{ maxHeight: '120px' }}
      >
        {allPlayers.map(({ id, username, completeness }) => {
          return (
            <PlayerCard
              key={id}
              username={username}
              completeness={completeness ?? 0}
              isCurrentUser={id === currentPlayer.id}
              raceStatus={raceStatus}
            />
          );
        })}
      </div>
      {raceStatus !== RaceState.WAITING && (
        <>
          <div
            style={{
              width: '0.3px'
            }}
            className="bg-gray"
          />
          <div
            style={{
              width: '20%',
              fontSize: '64px',
              lineHeight: '100%'
            }}
            className="text-white items-center text-center m-auto"
          >
            {currentPlayerPlace}
          </div>
        </>
      )}
    </div>
  );
};
