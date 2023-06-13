import { useEffect, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Player } from '@vimracing/shared';
import React from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { ArrowBackIcon } from '@/components/icons';

interface IRecapProps {
  raceDocs: { start: string[]; target: string[] }[];
  recapPlayer: Player;
  onExit: () => void;
}
export const Recap: React.FC<IRecapProps> = ({
  raceDocs,
  recapPlayer,
  onExit
}) => {
  const { raceData } = recapPlayer;

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

  const { executedCommands } = raceData ?? {};

  return (
    <>
      <span onClick={onExit}>
        <ArrowBackIcon className="h-6 w-6 text-gray-2 cursor-pointer" />
      </span>
      <PlayerCard
        player={recapPlayer}
        isCurrentUser={false}
        raceDocsCount={raceDocs.length - 1}
        recapProps={{
          currentRecapTaskIndex: currentRecapTaskIndex,
          onTaskClick: (index) => setCurrentRecapTaskIndex(index)
        }}
      />
      {raceDocs && <div ref={editorParentElement} />}
      <Hotkeys executedCommands={executedCommands?.[currentRecapTaskIndex]} />
    </>
  );
};
