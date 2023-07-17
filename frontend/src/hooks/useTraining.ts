import { useEffect, useState, useCallback } from 'react';
import { SupportedLanguages } from '@vimracing/shared';
import { getTrainingRace } from '@/api/getTrainingRace';

type RaceData = { start: []; target: [] }[];

export const useTraining = ({
  selectedLang
}: {
  selectedLang: SupportedLanguages;
}): { raceData: RaceData | null; fillRaceData: () => void } => {
  const [internalSelectedLang, setInternalSelectedLang] =
    useState<SupportedLanguages>(selectedLang);
  const [cache, setCache] = useState<
    Record<SupportedLanguages, RaceData | null>
  >(
    Object.keys(SupportedLanguages).reduce((acc, lang) => {
      acc[lang as SupportedLanguages] = null;
      return acc;
    }, {} as Record<SupportedLanguages, RaceData | null>)
  );

  const [currentRaceData, setCurrentRaceData] = useState<RaceData | null>(null);

  useEffect(() => {
    const emptyLangs = Object.keys(cache).filter((lang) => {
      return !cache[lang as SupportedLanguages];
    });

    if (emptyLangs.length === 0) return;

    getTrainingRace({ raceLangs: emptyLangs as SupportedLanguages[] }).then(
      (data) => {
        setCache((prev) => {
          return { ...prev, ...data };
        });
      }
    );
  }, [cache]);

  const fillRaceData = useCallback(() => {
    setCache((prev) => {
      if (!prev) return prev;

      const newRaceData = prev[selectedLang];

      if (!newRaceData) return prev;
      setCurrentRaceData(newRaceData);

      return {
        ...prev,
        [selectedLang]: null
      };
    });
  }, [selectedLang]);
  console.log(selectedLang);

  useEffect(() => {
    if (!currentRaceData && cache) fillRaceData();
    if (internalSelectedLang !== selectedLang) {
      setInternalSelectedLang(selectedLang);
      fillRaceData();
    }
  }, [
    cache,
    currentRaceData,
    fillRaceData,
    internalSelectedLang,
    selectedLang
  ]);

  return { raceData: currentRaceData, fillRaceData };
};
