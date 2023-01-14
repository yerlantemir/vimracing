import axios from 'axios';

export const createRoom = async () => {
  const createResponse = await axios.post('localhost:8999/room/create');
  console.log(createResponse);
};
