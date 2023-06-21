import { useEffect, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Player } from '@vimracing/shared';
import React from 'react';
import { Hotkeys } from './Hotkeys/Hotkeys';

interface IRecapProps {
  raceDocs: { start: string[]; target: string[] }[];
  players: Player[];
}
export const Recap: React.FC<IRecapProps> = ({ raceDocs, players }) => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const [currentRecapTaskIndex, setCurrentRecapTaskIndex] = useState(0);

  useEffect(() => {
    if (
      !editorParentElement.current ||
      !raceDocs ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    const editor = new Editor({
      raceDoc: raceDocs[currentRecapTaskIndex],
      parent: editorParentElement.current,
      readOnly: true
    });
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, [currentRecapTaskIndex, raceDocs]);

  const finishedPlayers = players.filter(
    (player) =>
      player.raceData?.executedCommands?.length &&
      player.raceData?.executedCommands?.length > 0
  );

  return (
    <>
      <h5 className="text-gray-2">Race recap:</h5>
      <div className="flex items-center gap-2">
        {Array(raceDocs.length)
          .fill(0)
          .map((_, index) => {
            return (
              <span
                className={`p-1 cursor-pointer border-2 transition-all duration-300 ${
                  index === currentRecapTaskIndex
                    ? 'border-blue-3 text-blue-3'
                    : 'border-gray-2 opacity-80 text-gray'
                }`}
                key={index}
                onClick={() => setCurrentRecapTaskIndex(index)}
              >
                task {index + 1}
              </span>
            );
          })}
      </div>
      {raceDocs && <div ref={editorParentElement} />}

      {finishedPlayers.map((player) => {
        return (
          <div key={player.id} className="flex items-center gap-4">
            <span className="text-gray-2 opacity-80">{player.username}</span>
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
