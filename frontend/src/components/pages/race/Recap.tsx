import { useEffect, useState } from 'react';
import { Editor } from '@/components/Editor';
import { ExecutedCommand, Player } from '@vimracing/shared';
import React from 'react';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { RaceDocs } from '@vimracing/shared';

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
export const Recap: React.FC<IRecapProps> = ({ raceDocs, players }) => {
  const [currentRecapTaskIndex, setCurrentRecapTaskIndex] = useState(0);

  const finishedPlayers = players.filter(
    (player) =>
      player.raceData?.completedDocs?.length &&
      player.raceData?.completedDocs?.length > 0
  );

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

      {finishedPlayers.map((player) => {
        if (
          !player.raceData?.completedDocs?.[currentRecapTaskIndex]
            ?.executedCommands
        )
          return null;
        return (
          <div key={player.id} className="flex items-center gap-4">
            <span className="text-text text-sm opacity-80">
              {player.username}
            </span>
            <Hotkeys
              executedCommands={
                player.raceData?.completedDocs?.[currentRecapTaskIndex]
                  .executedCommands
              }
            />
          </div>
        );
      })}
    </>
  );
};

interface ITrainingRecapProps {
  raceDocs: RaceDocs;
  executedCommands: ExecutedCommand[][];
}

export const TrainingRecap: React.FC<ITrainingRecapProps> = ({
  raceDocs,
  executedCommands
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

      <Hotkeys executedCommands={executedCommands[currentRecapTaskIndex]} />
    </>
  );
};
