import axios from 'axios';

export const createRace = async () => {
  const createResponse = await axios.post('http://localhost:8999/race/create');
  if (!createResponse) return null;

  const { raceId, hostToken } = createResponse.data;
  return { raceId, hostToken };
};
