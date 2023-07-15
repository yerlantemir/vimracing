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
      <div className="flex items-center gap-2">
        {Array(raceDocs.length)
          .fill(0)
          .map((_, index) => {
            return (
              <span
                className={`p-2 text-sm cursor-pointer border rounded-md transition-all duration-300 ${
                  index === currentRecapTaskIndex
                    ? 'text-text border border-primary'
                    : 'opacity-80 text-text'
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
