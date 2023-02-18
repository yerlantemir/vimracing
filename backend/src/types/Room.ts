import { UserConnection } from './User';

export type Room = {
  id: string;
  users: Array<UserConnection>;
  title: string;
  doc: { start: string[]; goal: string[] };
};
