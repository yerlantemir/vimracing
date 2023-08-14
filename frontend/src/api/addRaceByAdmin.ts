import { RaceDocs } from '@vimracing/shared';
import axios from 'axios';

export const addRaceByAdmin = async (raceData: RaceDocs, password: string) => {
  const addResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/race/add/?password=${password}`,
    {
      raceData
    }
  );
  if (!addResponse) return null;

  return true;
};
