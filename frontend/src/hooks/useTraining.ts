import { useEffect, useState, useCallback } from 'react';
import { RaceDocs, SupportedLanguages } from '@vimracing/shared';
import { getTrainingRace } from '@/api/getTrainingRace';

export const useTraining = ({
  selectedLang,
  isShowingRecap
}: {
  selectedLang: SupportedLanguages;
  isShowingRecap: boolean;
}): { raceData: RaceDocs | null } => {
  const [internalSelectedLang, setInternalSelectedLang] =
    useState<SupportedLanguages>(selectedLang);
  const [cache, setCache] = useState<
    Record<SupportedLanguages, RaceDocs | null>
  >(
    Object.keys(SupportedLanguages).reduce((acc, lang) => {
      acc[lang as SupportedLanguages] = null;
      return acc;
    }, {} as Record<SupportedLanguages, RaceDocs | null>)
  );

  const [currentRaceData, setCurrentRaceData] = useState<RaceDocs | null>(null);

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

  const fillRaceData = useCallback((lang: SupportedLanguages) => {
    setCache((prev) => {
      if (!prev) return prev;

      const newRaceData = prev[lang];

      if (!newRaceData) return prev;

      setCurrentRaceData(newRaceData);

      return {
        ...prev,
        [lang]: null
      };
    });
  }, []);

  useEffect(() => {
    // fill for the first time
    if (!currentRaceData && cache) {
      fillRaceData(internalSelectedLang);
      return;
    }
    // fill when language changes
    if (internalSelectedLang !== selectedLang) {
      setInternalSelectedLang(selectedLang);
      fillRaceData(selectedLang);
      return;
    }
  }, [
    cache,
    currentRaceData,
    fillRaceData,
    internalSelectedLang,
    selectedLang
  ]);

  useEffect(() => {
    if (isShowingRecap) {
      fillRaceData(internalSelectedLang);
    }
  }, [fillRaceData, internalSelectedLang, isShowingRecap]);

  return {
    raceData: currentRaceData
  };
};
