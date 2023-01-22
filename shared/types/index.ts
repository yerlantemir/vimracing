export enum SocketEventType {
  CHANGE = 'Change',
  WIN = 'Win',
  RACE_ENTER = 'RaceEnter',
  NOT_FOUND = 'NotFound'
}

export interface ChangeEvent {
  event: SocketEventType.CHANGE;
  data: {
    doc: string;
    raceId: string;
    id: string;
  };
}

export interface RaceWinEvent {
  event: SocketEventType.WIN;
  data: {
    id: string;
  };
}

export interface RaceEnterEvent {
  event: SocketEventType.RACE_ENTER;
  data: {
    id: string;
    raceDoc: {
      start: string;
      goal: string;
    };
  };
}
export interface RaceNotFoundEvent {
  event: SocketEventType.NOT_FOUND;
  data: object;
}

export type SocketEvent =
  | ChangeEvent
  | RaceWinEvent
  | RaceEnterEvent
  | RaceNotFoundEvent;
