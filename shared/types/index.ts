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

export type ExecutedCommand = {
  isFailed: boolean;
  command: string;
  count?: number;
  isArrowKey?: boolean;
  index?: number;
};

export type Player = {
  id: string;
  username: string;
  raceData?: {
    completeness?: number;
    currentDocIndex?: number;
    docs?: string[][];
    currentPlace?: number;
    executedCommands?: ExecutedCommand[][];
    isFinished?: boolean;
  };
};

export enum RaceStatus {
  WAITING,
  ON,
  FINISHED
}

export enum FrontendEventType {
  HOST_RACE_START_CLICK = 'HostRaceStartClick',
  DOCUMENT_CHANGE = 'DocumentChange',
  USERNAME_CHANGE = 'UsernameChange',
  RACE_FINISH = 'RaceFinish'
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
export interface FrontendRaceFinishEvent {
  event: FrontendEventType.RACE_FINISH;
  payload: {
    executedCommands: ExecutedCommand[][];
  };
}

export interface FrontendDocumentChangeEvent {
  event: FrontendEventType.DOCUMENT_CHANGE;
  payload: {
    docIndex: number;
    newDocument: string[];
  };
}

export interface FrontendUsernameChangeEvent {
  event: FrontendEventType.USERNAME_CHANGE;
  payload: {
    newUsername: string;
  };
}

export interface BackendRaceInitEvent {
  event: BackendEventType.RACE_INIT;
  payload: {
    you: Player;
    players: Player[];
    raceStatus: RaceStatus;
    raceDocs: {
      start: string[];
      target: string[];
    }[];
    timerInSeconds: number;
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
    raceStatus: RaceStatus;
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
  payload: Pick<Player, 'id' | 'username' | 'raceData'>;
}
export interface BackendRaceFinishEvent {
  event: BackendEventType.RACE_FINISH;
  payload: {
    players: Player[];
  };
}
