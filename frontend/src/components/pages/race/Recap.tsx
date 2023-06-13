import { useEffect, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Player } from '@vimracing/shared';
import React from 'react';
import { ContentCard } from '@/components/ContentCard';
import { PlayerCard } from '@/components/PlayerCard';
import { Hotkeys } from './Hotkeys/Hotkeys';

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
      parent: editorParentElement.current
    });
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, [currentRecapTaskIndex, raceDocs]);

  const { executedCommands } = raceData ?? {};

  return (
    <ContentCard>
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
    </ContentCard>
  );
};
