import { Fragment, useEffect, useState } from 'react';
import { Editor } from '@/components/Editor';
import { Player, SharedCompletedDocsPayload } from '@vimracing/shared';
import React from 'react';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { RaceDocs } from '@vimracing/shared';
import {
  CommandIcon,
  CounterIcon,
  PlayerIcon,
  RaceTimerIcon,
  SecondsIcon
} from '@/components/icons';
import { Tooltip } from '@/components/Tooltip';
import { raceDataDefaults } from '@/shared/defaults';

interface IRecapProps {
  raceDocs: RaceDocs;
  players: Player[];
}

const TasksList = ({
  racesCount,
  currentRecapTaskIndex,
  onTaskClick,
  currentTaskSource
}: {
  racesCount: number;
  currentRecapTaskIndex: number;
  onTaskClick: (taskIndex: number) => void;
  currentTaskSource?: string;
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // use "l" and "j" to navigate between tasks
      if (e.key === 'l') {
        const newIndex = currentRecapTaskIndex + 1;
        onTaskClick(newIndex >= racesCount ? 0 : newIndex);
      }
      if (e.key === 'h') {
        const newIndex = currentRecapTaskIndex - 1;
        onTaskClick(newIndex >= 0 ? newIndex : racesCount - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [currentRecapTaskIndex, onTaskClick, racesCount]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {Array(racesCount)
          .fill(0)
          .map((_, index) => {
            return (
              <span
                className={`p-2 text-sm cursor-pointer border rounded-md transition-all duration-300 ${
                  index === currentRecapTaskIndex
                    ? 'text-text border border-primary'
                    : 'opacity-80 text-text border-text'
                }`}
                key={index}
                onClick={() => onTaskClick(index)}
              >
                task {index + 1}
              </span>
            );
          })}
      </div>

      {currentTaskSource && (
        <a
          href={currentTaskSource}
          className="text-xs text-primary border-b border-primary"
          target="_blank"
        >
          source
        </a>
      )}
    </div>
  );
};

const RecapTable = ({
  players,
  currentRecapTaskIndex,
  isTraining = false
}: {
  players: Player[];
  currentRecapTaskIndex: number;
  isTraining?: boolean;
}) => {
  const finishedPlayers = players.filter(
    (player) =>
      player.raceData?.completedDocs?.length &&
      player.raceData?.completedDocs?.length > 0
  );
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${
          isTraining ? '' : 'min-content'
        } 1fr min-content min-content min-content`,
        gap: '8px 1rem',
        alignItems: 'center'
      }}
    >
      {!isTraining && (
        <Tooltip text="Username">
          <PlayerIcon />
        </Tooltip>
      )}

      <Tooltip text="Executed commands">
        <CommandIcon />
      </Tooltip>

      <Tooltip text="Pressed keys count">
        <CounterIcon />
      </Tooltip>

      <Tooltip text="Seconds">
        <SecondsIcon />
      </Tooltip>
      <Tooltip text="Race timer">
        <RaceTimerIcon />
      </Tooltip>
      {finishedPlayers.map((player) => {
        if (
          !player.raceData?.completedDocs?.[currentRecapTaskIndex]
            ?.executedCommands
        )
          return null;

        const currentDocSeconds =
          player.raceData?.completedDocs?.[currentRecapTaskIndex].seconds -
          (player.raceData?.completedDocs?.[currentRecapTaskIndex - 1]
            ?.seconds ?? 0);
        return (
          <Fragment key={player.id}>
            {!isTraining && (
              <span className="text-text text-sm opacity-80">
                {player.username}
              </span>
            )}
            <Hotkeys
              executedCommands={
                player.raceData?.completedDocs?.[currentRecapTaskIndex]
                  .executedCommands
              }
            />
            <span>
              {player.raceData.completedDocs[currentRecapTaskIndex].keysCount}
            </span>
            <span>{currentDocSeconds}</span>
            <span>
              {player.raceData.completedDocs[currentRecapTaskIndex].seconds}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
};
export const Recap: React.FC<IRecapProps> = ({ raceDocs, players }) => {
  const [currentRecapTaskIndex, setCurrentRecapTaskIndex] = useState(0);

  return (
    <>
      <TasksList
        racesCount={raceDocs.length}
        currentRecapTaskIndex={currentRecapTaskIndex}
        onTaskClick={setCurrentRecapTaskIndex}
        currentTaskSource={raceDocs[currentRecapTaskIndex]?.source}
      />
      {raceDocs && raceDocs[currentRecapTaskIndex] && (
        <Editor raceDoc={raceDocs[currentRecapTaskIndex]} readOnly />
      )}
      <RecapTable
        currentRecapTaskIndex={currentRecapTaskIndex}
        players={players}
      />
    </>
  );
};

interface ITrainingRecapProps {
  raceDocs: RaceDocs;
  sharedCompletedDocsPayload: SharedCompletedDocsPayload[];
}

export const TrainingRecap: React.FC<ITrainingRecapProps> = ({
  raceDocs,
  sharedCompletedDocsPayload
}) => {
  const [currentRecapTaskIndex, setCurrentRecapTaskIndex] = useState(0);

  return (
    <>
      <TasksList
        racesCount={raceDocs.length}
        currentRecapTaskIndex={currentRecapTaskIndex}
        onTaskClick={setCurrentRecapTaskIndex}
        currentTaskSource={raceDocs[currentRecapTaskIndex]?.source}
      />

      {raceDocs && raceDocs[currentRecapTaskIndex] && (
        <Editor raceDoc={raceDocs[currentRecapTaskIndex]} readOnly />
      )}

      <RecapTable
        players={[
          {
            id: '1',
            username: 'Player 1',
            raceData: {
              ...raceDataDefaults,
              completedDocs: sharedCompletedDocsPayload
            }
          }
        ]}
        currentRecapTaskIndex={currentRecapTaskIndex}
        isTraining={true}
      />
    </>
  );
};
