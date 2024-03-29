'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { useTraining } from '@/hooks/useTraining';
import {
  RaceDocs,
  ExecutedCommand,
  SupportedLanguages
} from '@vimracing/shared';
import { TrainingRecap } from '@/components/pages/race/Recap';
import { RefreshIcon } from '@/components/icons';
import { LoadingIcon } from '@/components/Loading';
import { Timer } from '@/components/Timer';
import { DEFAULT_TRAINING_RACE_TIME } from '@/shared/defaults';

export default function Home() {
  const router = useRouter();
  const [recapRaceData, setRecapRaceData] = useState<RaceDocs | null>(null);
  const [createRaceLoading, setCreateRaceLoading] = useState(false);
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[][]>(
    []
  );
  const [raceSeconds, setRaceSeconds] = useState<number[]>([]);
  const [touched, setTouched] = useState(false);
  const [raceTime, setRaceTime] = useState(DEFAULT_TRAINING_RACE_TIME);

  const [keysCount, setKeysCount] = useState<number[]>([]);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguages>(
    SupportedLanguages.js
  );
  const [documentIndex, setDocumentIndex] = useState<number>(0);
  const docIndexRef = useRef(0);

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
    let interval: NodeJS.Timer | undefined = undefined;
    if (touched) {
      interval = setInterval(() => {
        setRaceTime((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [touched]);

  // document changed
  useEffect(() => {
    if (docIndexRef.current !== documentIndex) {
      docIndexRef.current = documentIndex;
      setRaceSeconds((prev) => [...prev, raceTime]);
    }
  }, [documentIndex, raceTime]);

  // finish training race
  useEffect(() => {
    if (!raceData?.[documentIndex] || raceTime === 0) {
      setRecapRaceData(raceData);
      setDocumentIndex(0);
      return;
    }
  }, [documentIndex, raceData, raceTime]);

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

  const onKeyPressedCallback = useCallback(() => {
    if (!touched) {
      setTouched(true);
    }
    setKeysCount((prev) => {
      if (documentIndex === prev.length - 1) {
        return prev.map((count, index) => {
          if (index === documentIndex) {
            return count + 1;
          }
          return count;
        });
      }
      return [...prev, 1];
    });
  }, [documentIndex, touched]);

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
        seconds: raceSeconds[index],
        executedCommands: executedCommands[index],
        keysCount: count
      };
    });
  }, [keysCount, raceSeconds, executedCommands]);

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
              <div className="flex justify-between">
                {raceData && (
                  <span className="text-xs">
                    <span className="text-primary">{documentIndex + 1}</span>/
                    {raceData.length}
                  </span>
                )}
                <Timer time={raceTime} />
              </div>
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
                keysCount={keysCount[documentIndex] ?? 0}
                onKeyPressed={onKeyPressedCallback}
              />
            </>
          )}
        </div>
      </ContentCard>
    </>
  );
}
