import { useEffect, useRef, useState } from 'react';
import { Editor } from '@/components/Editor';
import { ExecutedCommand, Player } from '@vimracing/shared';
import React from 'react';
import { Hotkeys } from './Hotkeys/Hotkeys';

interface IRecapProps {
  raceDocs: { start: string[]; target: string[] }[];
  players: Player[];
}

const TasksList = ({
  racesCount,
  currentRecapTaskIndex,
  onTaskClick
}: {
  racesCount: number;
  currentRecapTaskIndex: number;
  onTaskClick: (taskIndex: number) => void;
}) => {
  return (
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
  );
};
export const Recap: React.FC<IRecapProps> = ({ raceDocs, players }) => {
  const [currentRecapTaskIndex, setCurrentRecapTaskIndex] = useState(0);

  const finishedPlayers = players.filter(
    (player) =>
      player.raceData?.executedCommands?.length &&
      player.raceData?.executedCommands?.length > 0
  );

  return (
    <>
      <TasksList
        racesCount={raceDocs.length}
        currentRecapTaskIndex={currentRecapTaskIndex}
        onTaskClick={setCurrentRecapTaskIndex}
      />
      {raceDocs && raceDocs[currentRecapTaskIndex] && (
        <Editor raceDoc={raceDocs[currentRecapTaskIndex]} readOnly />
      )}

      {finishedPlayers.map((player) => {
        return (
          <div key={player.id} className="flex items-center gap-4">
            <span className="text-text text-sm opacity-80">
              {player.username}
            </span>
            <Hotkeys
              executedCommands={
                player.raceData?.executedCommands?.[currentRecapTaskIndex] ?? []
              }
            />
          </div>
        );
      })}
    </>
  );
};

interface ITrainingRecapProps {
  raceDocs: { start: string[]; target: string[] }[];
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
      />
      {raceDocs && raceDocs[currentRecapTaskIndex] && (
        <Editor raceDoc={raceDocs[currentRecapTaskIndex]} readOnly />
      )}

      <Hotkeys executedCommands={executedCommands[currentRecapTaskIndex]} />
    </>
  );
};
