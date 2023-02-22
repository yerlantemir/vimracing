import { WebSocket } from 'ws';

export type UserConnection = {
  id: string;
  connection: WebSocket;
  currentDoc: string[];
  username: string;
};

export type RaceConnection = {
  id: string;
  users: Array<UserConnection>;
  title: string;
  doc: { start: string[]; goal: string[] };
};
