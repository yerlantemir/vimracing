'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor } from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { useTraining } from '@/hooks/useTraining';
import { ExecutedCommand, SupportedLanguages } from '@vimracing/shared';
import { TrainingRecap } from '@/components/pages/race/Recap';
import { RefreshIcon } from '@/components/icons';
import { LoadingIcon } from '@/components/Loading';
import { RaceDocs } from '@vimracing/shared';

export default function Home() {
  const router = useRouter();
  const [recapRaceData, setRecapRaceData] = useState<RaceDocs | null>(null);
  const [createRaceLoading, setCreateRaceLoading] = useState(false);
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[][]>(
    []
  );

  const [keysCount, setKeysCount] = useState<number[]>([]);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguages>(
    SupportedLanguages.js
  );
  const [documentIndex, setDocumentIndex] = useState<number>(0);
  const { raceData } = useTraining({
    selectedLang,
    isShowingRecap: !!recapRaceData
  });

  const onCreateRaceClick = async () => {
    try {
      setCreateRaceLoading(true);
      const response = await createRace(selectedLang);
      if (!response) return;

      const { hostToken, raceId } = response;
      LocalStorageManager.setHostToken({
        raceId,
        hostToken
      });
      router.push(raceId);
    } catch {
      setCreateRaceLoading(false);
    }
  };

  const onDocChange = useCallback(
    (newDoc: string[]) => {
      if (
        raceData &&
        newDoc.join('') === raceData[documentIndex].target.join('')
      ) {
        setDocumentIndex((prev) => prev + 1);
      }
    },
    [documentIndex, raceData]
  );

  useEffect(() => {
    if (!raceData?.[documentIndex]) {
      setRecapRaceData(raceData);
      setDocumentIndex(0);
      return;
    }
  }, [documentIndex, raceData]);

  const onExecutedCommandsChangeCallback = useCallback(
    (executedCommands: ExecutedCommand[]) => {
      setExecutedCommands((prev) => {
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

  const onRefreshClick = () => {
    setRecapRaceData(null);
    setExecutedCommands([]);
  };

  const languageSelect = (lang: SupportedLanguages) => {
    if (lang === selectedLang || createRaceLoading) return;
    setSelectedLang(lang as SupportedLanguages);
    setDocumentIndex(0);
  };

  const recapStatistics = useMemo(() => {
    return keysCount.map((count, index) => {
      return {
        seconds: 0,
        executedCommands: executedCommands[index],
        keysCount: count
      };
    });
  }, [keysCount, executedCommands]);

  return (
    <>
      <div
        className="bg-secondary py-1 px-3 gap-6 flex rounded-xl items-center text-xs m-auto"
        style={{ width: 'fit-content', height: '36px' }}
      >
        {Object.keys(SupportedLanguages).map((a) => (
          <p
            key={a}
            className={`${
              a === selectedLang ? 'text-primary' : ''
            } cursor-pointer transition duration-300 hover:text-primary hover:opacity-80`}
            onClick={() => languageSelect(a as SupportedLanguages)}
          >
            {a}
          </p>
        ))}
        |
        {!!recapRaceData && (
          <>
            <span
              className="cursor-pointer hover:text-primary transition duration-300"
              onClick={onRefreshClick}
            >
              <RefreshIcon />
            </span>{' '}
            |
          </>
        )}
        {createRaceLoading ? (
          <LoadingIcon />
        ) : (
          <Button onClick={onCreateRaceClick}>compete</Button>
        )}
      </div>
      <ContentCard style={{ paddingTop: '6rem' }}>
        <div className="flex flex-col gap-4">
          {recapRaceData ? (
            <TrainingRecap
              raceDocs={recapRaceData}
              sharedCompletedDocsPayload={recapStatistics}
            />
          ) : (
            <>
              {raceData && (
                <span className="text-xs">
                  <span className="text-primary">{documentIndex + 1}</span>/
                  {raceData.length}
                </span>
              )}
              {raceData && raceData[documentIndex] && (
                <Editor
                  raceDoc={raceData[documentIndex]}
                  onChange={onDocChange}
                />
              )}
              <Hotkeys
                key={documentIndex}
                setExecutedCommands={onExecutedCommandsChangeCallback}
                executedCommands={executedCommands[documentIndex] ?? []}
              />
            </>
          )}
        </div>
      </ContentCard>
    </>
  );
}
