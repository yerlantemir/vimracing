import axios from 'axios';

export const createRoom = async () => {
  const createResponse = await axios.post('http://localhost:8999/room/create');

  return createResponse.data.id;
};
