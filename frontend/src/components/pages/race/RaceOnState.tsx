import Editor, { isTextEqual } from '@/components/Editor';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Players } from './Players';
import { Player, RaceStatus } from '@vimracing/shared';
import { Timer } from '@/components/Timer';
import { Hotkeys } from './Hotkeys';

interface RaceOnStateProps {
  raceDocs: { start: string[]; target: string[] }[];
  onDocChange: (newDoc: string[], documentIndex: number) => void;
  players?: Player[];
  currentPlayer?: Player;
  raceTimer: number;
}

export const RaceOnState: React.FC<RaceOnStateProps> = ({
  raceDocs,
  onDocChange,
  players,
  currentPlayer,
  raceTimer
}) => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const [documentIndex, setDocumentIndex] = useState(
    currentPlayer?.raceData?.currentDocIndex ?? 0
  );

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
        onDocChange(newDoc, documentIndex);
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

  const isFinished =
    documentIndex === raceDocs.length - 1 &&
    currentPlayer?.raceData?.completeness === 100;
  return (
    <>
      <div className="flex justify-between">
        <h5 className="text-gray-2">The race on!</h5>
        <Timer time={raceTimer} />
      </div>
      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {players && currentPlayer && (
        <Players
          raceDocsCount={raceDocs.length}
          raceStatus={RaceStatus.ON}
          players={players}
          currentPlayer={{
            ...currentPlayer,
            raceData: {
              ...currentPlayer.raceData,
              currentDocIndex: documentIndex
            }
          }}
        />
      )}

      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {raceDocs && !isFinished && <div ref={editorParentElement} />}
      <Hotkeys />
      {isFinished && <div>FINISHED</div>}
    </>
  );
};
