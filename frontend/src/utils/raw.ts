import { SocketEvent } from '@vimracing/shared';

export const parseData = (data: string): SocketEvent => {
  return JSON.parse(data);
};

export const stringifyData = (event: SocketEvent) => {
  return JSON.stringify(event);
};
