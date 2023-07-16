import axios from 'axios';

export const createRace = async () => {
  const createResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/race/create`
  );
  if (!createResponse) return null;

  const { raceId, hostToken } = createResponse.data;
  return { raceId, hostToken };
};

export const getTrainingRace = async ({
  raceLang
}: {
  raceLang: 'js' | 'python';
}) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/race/training`
  );
  if (!response) return null;

  const { data } = response;
  return data;
};
