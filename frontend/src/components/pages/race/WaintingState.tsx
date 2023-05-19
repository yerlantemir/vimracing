import { Button } from '@/components/Button';
import { CopyInput } from '@/components/CopyInput';
import { Player, RaceState } from '@vimracing/shared';
import { Players } from './Players';

interface WaitingStateProps {
  raceTimer?: number;
  players?: Player[];
  currentPlayer?: Player;
  onHostRaceStartClick: () => void;
  isHost: boolean;
}
export const WaitingState: React.FC<WaitingStateProps> = ({
  raceTimer,
  players,
  currentPlayer,
  onHostRaceStartClick,
  isHost
}) => {
  return (
    <>
      {raceTimer ? (
        <div>{raceTimer}</div>
      ) : (
        <>
          <h5 className="text-gray-2">Share the link below</h5>
          <CopyInput link="https://vimracing.com/race/${this.raceId}" />
        </>
      )}
      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {currentPlayer && players && (
        <Players
          currentPlayer={currentPlayer}
          raceStatus={RaceState.WAITING}
          players={players}
        />
      )}
      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {isHost && !raceTimer && (
        <>
          {players && players.length > 0 ? (
            <Button
              onClick={onHostRaceStartClick}
              className="text-gray-3"
              style={{ maxWidth: '200px' }}
            >
              Start the race!
            </Button>
          ) : (
            <>
              <p className="text-gray-2">Waiting for other players to join</p>
            </>
          )}
        </>
      )}
      {!isHost && !raceTimer && (
        <p className="text-gray-2">Waiting for host to start</p>
      )}
    </>
  );
};
