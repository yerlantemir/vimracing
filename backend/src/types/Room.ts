import { WebSocket } from 'ws';

export type Room = {
  id: string;
  clients: Set<{ id: string; connection: WebSocket }>;
  title: string;
};
