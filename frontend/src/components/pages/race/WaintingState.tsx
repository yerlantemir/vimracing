import { Button } from '@/components/Button';
import { CopyInput } from '@/components/CopyInput';
import { Player, RaceStatus } from '@vimracing/shared';
import { Players } from './Players';
import { Timer } from '@/components/Timer';
import { useState } from 'react';

const RACE_WAITINIG_TIME_IN_S = 3;

interface WaitingStateProps {
  raceTimer?: number;
  players?: Player[];
  currentPlayer?: Player;
  onHostRaceStartClick: () => void;
  isHost: boolean;
  onCurrentPlayerUsernameChangeCallback: (newUsername: string) => void;
}
export const WaitingState: React.FC<WaitingStateProps> = ({
  raceTimer,
  players,
  currentPlayer,
  onHostRaceStartClick,
  isHost,
  onCurrentPlayerUsernameChangeCallback
}) => {
  const [startClicked, setStartClicked] = useState(false);
  return (
    <>
      {raceTimer ? (
        <div className="flex gap-4">
          <h5 className="text-text text-sm">The race is about to start!</h5>
          <Timer time={raceTimer} />
        </div>
      ) : (
        <>
          <h5 className="text-text">Share the link below with your friends</h5>
          <CopyInput link={window.location.href} />
        </>
      )}
      {currentPlayer && players && (
        <Players
          currentPlayer={currentPlayer}
          raceStatus={RaceStatus.WAITING}
          players={players}
          onCurrentPlayerUsernameChangeCallback={
            onCurrentPlayerUsernameChangeCallback
          }
        />
      )}
      {isHost && !startClicked && (
        <>
          {players && players.length > 0 ? (
            <Button
              onClick={() => {
                if (!startClicked) {
                  onHostRaceStartClick();
                  setStartClicked(true);
                }
              }}
              className="text-text"
              style={{ maxWidth: '80px' }}
            >
              Start!
            </Button>
          ) : (
            <>
              <p className="text-text text-xs">
                Waiting for other players to join
              </p>
            </>
          )}
        </>
      )}
      {!isHost && raceTimer === RACE_WAITINIG_TIME_IN_S && (
        <p className="text-text">Waiting for host to start</p>
      )}
    </>
  );
};
