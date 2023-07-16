import { getTrainingRace } from '@/api/createRace';
import { useEffect, useState } from 'react';

export const useTraining = ({
  selectedLang
}: {
  selectedLang: 'js' | 'python';
}) => {
  const [raceData, setRaceData] = useState(null);

  useEffect(() => {
    getTrainingRace({ raceLang: selectedLang }).then((data) => {
      setRaceData(data);
    });
  }, [selectedLang]);

  return { raceData };
};
