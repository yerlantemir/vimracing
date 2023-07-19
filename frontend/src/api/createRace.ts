import { SupportedLanguages } from '@vimracing/shared';
import axios from 'axios';

export const createRace = async (lang: SupportedLanguages.js) => {
  const createResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/race/create/?lang=${lang}`
  );
  if (!createResponse) return null;

  const { raceId, hostToken } = createResponse.data;
  return { raceId, hostToken };
};
