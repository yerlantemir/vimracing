import * as http from 'http';
import * as WebSocket from 'ws';
import { Race } from './Race';
import { uuid } from 'uuidv4';
import {
  BackendEventType,
  BackendNewPlayerEvent,
  BackendPlayerDataChangeEvent,
  BackendRaceFinishEvent,
  BackendRaceStartEvent,
  BackendRaceTimerUpdateEvent,
  FrontendDocumentChangeEvent,
  FrontendEventType,
  FrontendRaceHostStartEvent,
  RaceState,
  BackendRaceInitEvent
} from '@vimracing/shared';
import { Player } from './Player';

export class WebSocketServer {
  private server: WebSocket.Server;
  private races: Record<string, Race> = {};
  private userIdWebsocketMapping: Record<string, WebSocket> = {};

  constructor(server: http.Server) {
    this.server = new WebSocket.Server({ server });

    this.server.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      const urlParams = new URLSearchParams(req.url?.split('?')[1]);
      const userId = urlParams.get('userId') ?? uuid();
      const raceIdParam = urlParams.get('raceId');
      const race = this.races[raceIdParam || ''];

      if (!race) return;

      this.userIdWebsocketMapping[userId] = ws;

      const currentPlayer =
        race.getPlayer(userId) ?? new Player(userId, race.getRaceDoc().start);

      race.addPlayer(currentPlayer);
      const initRacePayload: BackendRaceInitEvent = {
        event: BackendEventType.RACE_INIT,
        payload: {
          you: currentPlayer,
          players: race.getPlayers().filter((p) => p.id !== currentPlayer.id)
        }
      };
      ws.send(JSON.stringify(initRacePayload));

      ws.on('message', (message: string) => {
        const payload = JSON.parse(message);
        this.handleMessage(ws, payload, race, userId);
      });
    });
  }
  handleMessage(
    ws: WebSocket,
    data: FrontendRaceHostStartEvent | FrontendDocumentChangeEvent,
    race: Race,
    playerId: string
  ) {
    const { event, payload } = data;
    switch (event) {
      case FrontendEventType.HOST_RACE_START_CLICK:
        if (payload.hostToken !== race.hostToken) return;
        race.start();
        break;
      case FrontendEventType.DOCUMENT_CHANGE:
        race.changeDoc(playerId, payload.newDocument);
        break;
    }
  }

  createRace() {
    const newRaceId = uuid();
    const hostToken = uuid();
    const newRace = new Race(newRaceId, hostToken);

    // listen for all events
    newRace.on('raceStarted', this.onRaceStart.bind(this));
    newRace.on('playerAdded', this.onPlayerAdded.bind(this));
    newRace.on('timerUpdated', this.onTimerUpdated.bind(this));
    newRace.on('playerDataChanged', this.onPlayerDataChanged.bind(this));
    newRace.on('raceFinished', this.onRaceFinished.bind(this));

    this.races[newRaceId] = newRace;
    return { raceId: newRaceId, hostToken };
  }
  onRaceStart(race: Race) {
    race.getPlayers().forEach((player) => {
      const connection = this.userIdWebsocketMapping[player.id];
      const payload: BackendRaceStartEvent = {
        event: BackendEventType.RACE_START,
        payload: { raceDoc: race.getRaceDoc() }
      };
      connection.send(JSON.stringify(payload));
    });
  }
  onPlayerAdded(race: Race, newPlayer: Player) {
    race
      .getPlayers()
      .filter((p) => p.id !== newPlayer.id)
      .forEach((player) => {
        const connection = this.userIdWebsocketMapping[player.id];
        const payload: BackendNewPlayerEvent = {
          event: BackendEventType.NEW_PLAYER,
          payload: {
            newPlayer
          }
        };
        connection.send(JSON.stringify(payload));
      });
  }
  onTimerUpdated(
    race: Race,
    { timer, raceStatus }: { timer: number; raceStatus: RaceState }
  ) {
    race.getPlayers().forEach((player) => {
      const connection = this.userIdWebsocketMapping[player.id];
      const payload: BackendRaceTimerUpdateEvent = {
        event: BackendEventType.RACE_TIMER_UPDATE,
        payload: {
          timerInSeconds: timer,
          raceState: raceStatus
        }
      };
      connection.send(JSON.stringify(payload));
    });
  }
  onPlayerDataChanged(race: Race, newPlayer: Player) {
    race
      .getPlayers()
      .filter((p) => p.id !== newPlayer.id)
      .forEach((player) => {
        const connection = this.userIdWebsocketMapping[player.id];
        const payload: BackendPlayerDataChangeEvent = {
          event: BackendEventType.PLAYER_DATA_CHANGE,
          payload: {
            id: newPlayer.id,
            completeness: 20 // TBD
          }
        };
        connection.send(JSON.stringify(payload));
      });
  }
  onRaceFinished(race: Race) {
    race.getPlayers().forEach((player) => {
      const connection = this.userIdWebsocketMapping[player.id];
      const payload: BackendRaceFinishEvent = {
        event: BackendEventType.RACE_FINISH,
        payload: {
          players: race.getPlayers()
        }
      };
      connection.send(JSON.stringify(payload));
    });
  }
}
