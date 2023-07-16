import { getTrainingRace } from '@/api/createRace';
import { useEffect, useState } from 'react';

type RaceData = { start: []; target: [] }[];
export const useTraining = ({
  selectedLang
}: {
  selectedLang: 'js' | 'python';
}): { raceData: RaceData | null } => {
  const [raceData, setRaceData] = useState<RaceData | null>(null);

  useEffect(() => {
    getTrainingRace({ raceLang: selectedLang }).then((data) => {
      setRaceData(data);
    });
  }, [selectedLang]);

  return { raceData };
};
