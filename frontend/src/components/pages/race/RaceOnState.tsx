import Editor from '@/components/Editor';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Players } from './Players';
import { Player, RaceState } from '@vimracing/shared';

interface RaceOnStateProps {
  raceDocs: { start: string[]; target: string[] }[];
  onDocChange: (newDoc: string[], documentIndex: number) => void;
  players?: Player[];
  currentPlayer?: Player;
}

export const RaceOnState: React.FC<RaceOnStateProps> = ({
  raceDocs,
  onDocChange,
  players,
  currentPlayer
}) => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const [documentIndex, setDocumentIndex] = useState(0);

  const isDocFinished = (current: string[], target: string[]) => {
    return current.join('') === target.join();
  };

  const onCurrentDocumentChange = useCallback(
    (newDoc: string[]) => {
      const isLastDocument = documentIndex === raceDocs.length - 1;

      if (isDocFinished(newDoc, raceDocs[documentIndex].target)) {
        if (isLastDocument) {
          // TODO: FINISH...
        } else {
          setDocumentIndex(documentIndex + 1);
        }
      } else {
        onDocChange(newDoc, documentIndex);
      }
    },
    [documentIndex, onDocChange, raceDocs]
  );

  useEffect(() => {
    if (
      !editorParentElement.current ||
      !raceDocs ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    const editor = new Editor({
      raceDoc: raceDocs[documentIndex],
      parent: editorParentElement.current,
      onChange: onCurrentDocumentChange
    });
    return () => {
      editor?.destroy();
    };
  }, [documentIndex, onCurrentDocumentChange, onDocChange, raceDocs]);

  return (
    <>
      <h5 className="text-gray-2">The race is on! Refactor the code below:</h5>
      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {players && currentPlayer && (
        <Players
          raceDocsCount={raceDocs.length}
          raceStatus={RaceState.ON}
          players={players}
          currentPlayer={currentPlayer}
        />
      )}

      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {raceDocs && <div ref={editorParentElement} />}
    </>
  );
};
