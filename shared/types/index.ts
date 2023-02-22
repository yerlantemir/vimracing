export enum SocketEventType {
  CHANGE = 'Change',
  RACE_FINISH = 'RaceFinish',
  RACE_ENTER = 'RaceEnter',
  NOT_FOUND = 'NotFound'
}

export interface FrontendRaceChangeEvent {
  event: SocketEventType.CHANGE;
  data: {
    userId: string;
    raceDoc: string[];
    raceId: string;
  };
}

export interface ServerRaceChangeEvent {
  event: SocketEventType.CHANGE;
  data: {
    usersPayload: { id: string; completeness: number; username: string }[];
  };
}

export interface ServerRaceEnterEvent {
  event: SocketEventType.RACE_ENTER;
  data: {
    userId: string;
    raceDoc: {
      start: string[];
      goal: string[];
    };
  };
}
export interface ServerRaceNotFoundEvent {
  event: SocketEventType.NOT_FOUND;
  data: object;
}

export type FrontendEventType = FrontendRaceChangeEvent;
export type ServerEventType =
  | ServerRaceChangeEvent
  | ServerRaceEnterEvent
  | ServerRaceNotFoundEvent;
