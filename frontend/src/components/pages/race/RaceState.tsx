import { Editor, isTextEqual } from '@/components/Editor';
import { useState, useCallback, useMemo } from 'react';
import { Players } from './Players';
import { ExecutedCommand, Player, RaceStatus } from '@vimracing/shared';
import { Hotkeys } from './Hotkeys/Hotkeys';
import { Recap } from './Recap';
import { Timer } from '@/components/Timer';
import { getPostfixedPlace } from '@/utils/postfix';
import { RaceDocs } from '@vimracing/shared';

interface RaceStateProps {
  raceDocs: RaceDocs;
  onDocChange: (
    newDoc: string[],
    documentIndex: number,
    executedCommands?: ExecutedCommand[]
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
  const [documentIndex, setDocumentIndex] = useState(
    currentPlayer?.raceData?.currentDocIndex ?? 0
  );

  const isDocFinished = (current: string[], target: string[]) => {
    return isTextEqual(current, target);
  };

  const onCurrentDocumentChange = useCallback(
    (newDoc: string[]) => {
      const isEditingCurrentDoc = !isDocFinished(
        newDoc,
        raceDocs[documentIndex].target
      );
      if (isEditingCurrentDoc) {
        onDocChange(newDoc, documentIndex);
        return;
      }

      // current doc finished, move to next doc
      const isLastDocument = documentIndex === raceDocs.length - 1;
      setDocumentIndex(documentIndex + 1);
      setDocExecutedCommands((prev) => {
        console.log({ prev, documentIndex });

        onDocChange(
          newDoc,
          isLastDocument ? documentIndex : documentIndex + 1,
          prev
        );
        return [];
      });
    },
    [documentIndex, onDocChange, raceDocs]
  );

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
          />
        </>
      )}
      {isRaceFinished && currentPlayer && players && (
        <Recap players={[...players, currentPlayer]} raceDocs={raceDocs} />
      )}
    </>
  );
};
