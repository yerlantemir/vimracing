import axios from 'axios';
import { SupportedLanguages } from '@vimracing/shared';

export const getTrainingRace = async ({
  raceLangs
}: {
  raceLangs: SupportedLanguages[];
}) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/race/training`,
    {
      params: {
        raceLangs
      }
    }
  );
  if (!response) return null;

  const { data } = response;
  return data;
};
