import axios from 'axios';

export const createRace = async () => {
  const createResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/race/create`
  );
  if (!createResponse) return null;

  const { raceId, hostToken } = createResponse.data;
  return { raceId, hostToken };
};
