import { WebSocket } from 'ws';

export type UserConnection = {
  userId: string;
  connection: WebSocket;
};
