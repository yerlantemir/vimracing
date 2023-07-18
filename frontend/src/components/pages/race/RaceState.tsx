import { Editor, isTextEqual } from '@/components/Editor';
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
        <h5 className="text-text">
          You finished {getPostfixedPlace(currentPlayer.raceData.place)}
        </h5>
      );
    }
    return (
      <>
        <h5 className="text-text">The race is on!</h5>
        <Timer time={raceTimer} />
      </>
    );
  };
  return (
    <>
      <div className="flex justify-between">{renderHeader()}</div>
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

      {!isFinished && raceDocs && (
        <>
          {raceDocs && raceDocs[documentIndex] && (
            <Editor
              raceDoc={raceDocs[documentIndex]}
              onChange={onCurrentDocumentChange}
            />
          )}
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
