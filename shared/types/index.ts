export enum SocketEventType {
  CHANGE = 'Change',
  RACE_FINISH = 'RaceFinish',
  RACE_ENTER = 'RaceEnter',
  NOT_FOUND = 'NotFound'
}

export interface ChangeEvent {
  event: SocketEventType.CHANGE;
  data: {
    doc: string[];
    raceId: string;
    id: string;
  };
}

export enum RACE_FINISH_RESULT {
  WIN = 'win',
  LOSE = 'lose'
}
export interface RaceFinishEvent {
  event: SocketEventType.RACE_FINISH;
  data: {
    id: string;
    result: RACE_FINISH_RESULT;
  };
}

export interface RaceEnterEvent {
  event: SocketEventType.RACE_ENTER;
  data: {
    id: string;
    raceDoc: {
      start: string[];
      goal: string[];
    };
  };
}
export interface RaceNotFoundEvent {
  event: SocketEventType.NOT_FOUND;
  data: object;
}

export type SocketEvent =
  | ChangeEvent
  | RaceFinishEvent
  | RaceEnterEvent
  | RaceNotFoundEvent;
