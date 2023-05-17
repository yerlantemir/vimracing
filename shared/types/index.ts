/* 
Frontend Event types:
1. HostRaceStartClick
2. DocumentChange

/* 
Backend Event Types:
1. RaceInit
2. NewUser
3. RaceTimerUpdate
4. RaceStart
5. UserDocumentChange()
6. RaceFinish 
*/

export type Player = {
  id: string;
  username: string;
  completeness?: number;
  raceDocs?: string[][];
  currentPlace?: number;
};

export enum RaceState {
  WAITING,
  ON,
  FINISHED
}

export enum FrontendEventType {
  HOST_RACE_START_CLICK = 'HostRaceStartClick',
  DOCUMENT_CHANGE = 'DocumentChange'
}

export enum BackendEventType {
  RACE_INIT = 'RaceInit',
  NEW_PLAYER = 'NewPlayer',
  RACE_TIMER_UPDATE = 'RaceTimerUpdate',
  RACE_START = 'RaceStart',
  PLAYER_DATA_CHANGE = 'PlayerDataChange',
  RACE_FINISH = 'RaceFinish'
}

export interface FrontendRaceHostStartEvent {
  event: FrontendEventType.HOST_RACE_START_CLICK;
  payload: { hostToken: string };
}
export interface FrontendDocumentChangeEvent {
  event: FrontendEventType.DOCUMENT_CHANGE;
  payload: {
    docIndex: number;
    newDocument: string[];
  };
}

export interface BackendRaceInitEvent {
  event: BackendEventType.RACE_INIT;
  payload: {
    you: Player;
    players: Player[];
  };
}
export interface BackendNewPlayerEvent {
  event: BackendEventType.NEW_PLAYER;
  payload: {
    newPlayer: Player;
  };
}
export interface BackendRaceTimerUpdateEvent {
  event: BackendEventType.RACE_TIMER_UPDATE;
  payload: {
    raceState: RaceState;
    timerInSeconds: number;
  };
}
export interface BackendRaceStartEvent {
  event: BackendEventType.RACE_START;
  payload: {
    raceDocs: {
      start: string[];
      target: string[];
    }[];
  };
}
export interface BackendPlayerDataChangeEvent {
  event: BackendEventType.PLAYER_DATA_CHANGE;
  payload: Pick<Player, 'id' | 'completeness'>;
}
export interface BackendRaceFinishEvent {
  event: BackendEventType.RACE_FINISH;
  payload: {
    players: Player[];
  };
}
