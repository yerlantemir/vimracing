import { WebSocket } from 'ws';

export type UserConnection = {
  id: string;
  connection: WebSocket;
};

export type RaceConnection = {
  id: string;
  users: Array<UserConnection>;
  title: string;
  doc: { start: string[]; goal: string[] };
};
