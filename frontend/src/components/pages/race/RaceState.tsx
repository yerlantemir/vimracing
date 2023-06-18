import Editor, { isTextEqual } from '@/components/Editor';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Players } from './Players';
import { ExecutedCommand, Player, RaceStatus } from '@vimracing/shared';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { Recap } from './Recap';
import { Timer } from '@/components/Timer';
import { getPostfixedPlace } from '@/utils/postfix';

interface RaceStateProps {
  raceDocs: { start: string[]; target: string[] }[];
  onDocChange: (newDoc: string[], documentIndex: number) => void;
  onRaceFinish: (executedCommands: ExecutedCommand[][]) => void;
  players?: Player[];
  currentPlayer?: Player;
  raceTimer: number;
  raceStatus: RaceStatus;
}

export const RaceState: React.FC<RaceStateProps> = ({
  raceDocs,
  onDocChange,
  players,
  currentPlayer,
  onRaceFinish,
  raceTimer,
  raceStatus
}) => {
  const [raceExecutedCommands, setRaceExecutedCommands] = useState<
    ExecutedCommand[][]
  >(currentPlayer?.raceData?.executedCommands ?? []);
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

      const isLastDocument = documentIndex === raceDocs.length - 1;
      setDocumentIndex(documentIndex + 1);
      if (isLastDocument) {
        onDocChange(newDoc, documentIndex);
        setTimeout(() => {
          setRaceExecutedCommands((prev) => {
            onRaceFinish(prev);
            return [];
          });
        }, 300);
        return;
      }

      onDocChange(newDoc, documentIndex + 1);
    },
    [documentIndex, onDocChange, onRaceFinish, raceDocs]
  );

  useEffect(() => {
    if (
      !editorParentElement.current ||
      !raceDocs ||
      editorParentElement.current.childNodes.length !== 0 ||
      !raceDocs[documentIndex]
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

  const onExecutedCommandsChangeCallback = useCallback(
    (executedCommands: ExecutedCommand[]) => {
      setRaceExecutedCommands((prev) => {
        if (documentIndex === prev.length - 1) {
          return prev.map((commands, index) => {
            if (index === documentIndex) {
              return executedCommands;
            }
            return commands;
          });
        }
        return [...prev, executedCommands];
      });
    },
    [documentIndex]
  );

  const isFinished =
    documentIndex === raceDocs.length &&
    currentPlayer?.raceData?.completeness === 100;

  const renderHeader = () => {
    if (
      (raceStatus === RaceStatus.FINISHED || isFinished) &&
      currentPlayer?.raceData?.place
    ) {
      return (
        <h5 className="text-gray-2">
          You finished {getPostfixedPlace(currentPlayer.raceData.place)}
        </h5>
      );
    }
    return (
      <>
        <h5 className="text-gray-2">The race is on!</h5>
        <Timer time={raceTimer} />
      </>
    );
  };
  return (
    <>
      <div className="flex justify-between">{renderHeader()}</div>
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

      {!isFinished && raceDocs && (
        <>
          <div ref={editorParentElement} />
          <Hotkeys
            onExecutedCommandsChangeCallback={onExecutedCommandsChangeCallback}
            key={documentIndex}
          />
        </>
      )}
      {isFinished && players && (
        <Recap players={[...players, currentPlayer]} raceDocs={raceDocs} />
      )}
    </>
  );
};
