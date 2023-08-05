import { Editor, isTextEqual } from '@/components/Editor';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Players } from './Players';
import {
  RaceDocs,
  ExecutedCommand,
  Player,
  RaceStatus
} from '@vimracing/shared';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { Recap } from './Recap';
import { Timer } from '@/components/Timer';
import { getPostfixedPlace } from '@/utils/postfix';

interface RaceStateProps {
  raceDocs: RaceDocs;
  onDocChange: (
    newDoc: string[],
    documentIndex: number,
    executedCommands?: ExecutedCommand[],
    secondsSinceStart?: number,
    keysCount?: number
  ) => void;
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
  raceTimer,
  raceStatus
}) => {
  const [docExecutedCommands, setDocExecutedCommands] = useState<
    ExecutedCommand[]
  >([]);
  const [keysCount, setKeysCount] = useState(0);
  const [documentIndex, setDocumentIndex] = useState(
    currentPlayer?.raceData?.currentDocIndex ?? 0
  );
  const [currentDocumentDoc, setCurrentDocumentDoc] = useState(
    raceDocs[documentIndex].start
  );
  const [hasDocumentChange, setHasDocumentChange] = useState(false);

  const isDocFinished = (current: string[], target: string[]) => {
    return isTextEqual(current, target);
  };

  const onCurrentDocumentChange = useCallback((newDoc: string[]) => {
    setCurrentDocumentDoc(newDoc);
    setHasDocumentChange(true);
  }, []);

  useEffect(() => {
    if (!hasDocumentChange) return;
    setHasDocumentChange(false);
    const isEditingCurrentDoc = !isDocFinished(
      currentDocumentDoc,
      raceDocs[documentIndex].target
    );

    if (isEditingCurrentDoc) {
      onDocChange(currentDocumentDoc, documentIndex);
      return;
    }

    // current doc finished, move to next doc
    const isLastDocument = documentIndex === raceDocs.length - 1;
    setDocumentIndex(documentIndex + 1);
    setDocExecutedCommands([]);
    setKeysCount(0);

    onDocChange(
      currentDocumentDoc,
      isLastDocument ? documentIndex : documentIndex + 1,
      docExecutedCommands,
      raceTimer,
      keysCount
    );
  }, [
    currentDocumentDoc,
    docExecutedCommands,
    documentIndex,
    hasDocumentChange,
    keysCount,
    onDocChange,
    raceDocs,
    raceTimer
  ]);

  const isCurrentPlayerFinished = useMemo(
    () =>
      (documentIndex === raceDocs.length &&
        currentPlayer?.raceData?.completeness === 100) ||
      currentPlayer?.raceData?.isFinished,
    [
      currentPlayer?.raceData?.completeness,
      currentPlayer?.raceData?.isFinished,
      documentIndex,
      raceDocs.length
    ]
  );

  const isRaceFinished = useMemo(
    () => raceStatus === RaceStatus.FINISHED || isCurrentPlayerFinished,
    [isCurrentPlayerFinished, raceStatus]
  );

  const renderHeader = () => {
    if (isRaceFinished && currentPlayer?.raceData?.place) {
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

      {!isRaceFinished && raceDocs && (
        <>
          {raceDocs && raceDocs[documentIndex] && (
            <Editor
              raceDoc={raceDocs[documentIndex]}
              onChange={onCurrentDocumentChange}
            />
          )}
          <Hotkeys
            setExecutedCommands={setDocExecutedCommands}
            executedCommands={docExecutedCommands}
            key={documentIndex}
            keysCount={keysCount}
            onKeyPressed={() => setKeysCount(keysCount + 1)}
          />
        </>
      )}
      {isRaceFinished && currentPlayer && players && (
        <Recap players={[...players, currentPlayer]} raceDocs={raceDocs} />
      )}
    </>
  );
};
