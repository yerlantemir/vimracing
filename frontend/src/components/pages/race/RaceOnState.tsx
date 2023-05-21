import Editor, { isTextEqual } from '@/components/Editor';
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
    return isTextEqual(current, target);
  };

  const onCurrentDocumentChange = useCallback(
    (newDoc: string[]) => {
      const isFinished = isDocFinished(newDoc, raceDocs[documentIndex].target);
      if (!isFinished) {
        onDocChange(newDoc, documentIndex);
        return;
      }

      // TODO: FINISH
      const isLastDocument = documentIndex === raceDocs.length - 1;
      if (isLastDocument) {
        return;
      }

      setDocumentIndex(documentIndex + 1);
      onDocChange(newDoc, documentIndex + 1);
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
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, [documentIndex, onCurrentDocumentChange, onDocChange, raceDocs]);

  const isFinished = documentIndex === raceDocs.length - 1;
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
      {raceDocs && !isFinished && <div ref={editorParentElement} />}
      {isFinished && <div>FINISHED</div>}
    </>
  );
};
