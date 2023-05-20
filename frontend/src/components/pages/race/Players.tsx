import { PlayerCard } from '@/components/PlayerCard';
import { Player, RaceState } from '@vimracing/shared';

interface PlayersProps {
  players: Player[];
  currentPlayer: Player;
  raceStatus: RaceState;
  raceDocsCount: number;
}
export const Players: React.FC<PlayersProps> = ({
  players,
  currentPlayer,
  raceStatus,
  raceDocsCount
}) => {
  if (!players || !currentPlayer) return null;

  const allPlayers = [currentPlayer, ...players];
  const currentPlayerPlace =
    allPlayers
      ?.sort(
        (a, b) =>
          (b.raceData?.completeness ?? 0) - (a.raceData?.completeness ?? 0)
      )
      ?.findIndex((user) => user.id === currentPlayer?.id) + 1;

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
              raceDocsCount={raceDocsCount}
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
