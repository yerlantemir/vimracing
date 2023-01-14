import { WebSocket } from 'ws';

export type Room = {
  id: string;
  clients: Set<WebSocket>;
  title: string;
};
