import { FrontendEventType, ServerEventType } from '@vimracing/shared';

export const parseData = (data: string): ServerEventType => {
  return JSON.parse(data);
};

export const stringifyData = (event: FrontendEventType) => {
  return JSON.stringify(event);
};
