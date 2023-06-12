import http from 'http';
import WebSocket from 'ws';
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
  RaceStatus,
  BackendRaceInitEvent,
  FrontendUsernameChangeEvent
} from '@vimracing/shared';
import { Player } from './Player';
import { validateUsername } from '../utils/validateUsername';

export class WebSocketServer {
  private server: WebSocket.Server;
  private races: Record<string, Race> = {};
  private raceIdWebsocketConnectionsMapping: Record<
    string,
    { playerId: string; connection: WebSocket }[]
  > = {};

  constructor(server: http.Server) {
    this.server = new WebSocket.Server({ server });

    this.server.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      const urlParams = new URLSearchParams(req.url?.split('?')[1]);
      const userId = urlParams.get('userId') ?? uuid();
      const raceIdParam = urlParams.get('raceId');
      const race = this.races[raceIdParam || ''];
      const usernameParam = urlParams.get('username');

      const username =
        (validateUsername(usernameParam) && usernameParam) ||
        `Guest${race.getPlayers().length + 1}`;

      if (!race) return;

      this.raceIdWebsocketConnectionsMapping[race.id].push({
        playerId: userId,
        connection: ws
      });

      const currentPlayer =
        race.getPlayer(userId) ?? new Player(userId, username);

      race.addPlayer(currentPlayer);
      const initRacePayload: BackendRaceInitEvent = {
        event: BackendEventType.RACE_INIT,
        payload: {
          you: currentPlayer,
          players: race.getPlayers().filter((p) => p.id !== currentPlayer.id),
          raceStatus: race.getRaceStatus()
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
    data:
      | FrontendRaceHostStartEvent
      | FrontendDocumentChangeEvent
      | FrontendUsernameChangeEvent,
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
        race.changeDoc(playerId, payload.docIndex, payload.newDocument);
        break;
      case FrontendEventType.USERNAME_CHANGE:
        race.changeUsername(playerId, payload.newUsername);
        break;
      case FrontendEventType.RACE_FINISH:
        race.finishPlayerRace(playerId, payload.executedCommands);
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
    this.raceIdWebsocketConnectionsMapping[newRaceId] = [];
    return { raceId: newRaceId, hostToken };
  }
  onRaceStart(race: Race) {
    this.raceIdWebsocketConnectionsMapping[race.id].forEach(
      ({ connection }) => {
        const payload: BackendRaceStartEvent = {
          event: BackendEventType.RACE_START,
          payload: { raceDocs: race.getRaceDocs() }
        };
        connection.send(JSON.stringify(payload));
      }
    );
  }
  onPlayerAdded(race: Race, newPlayer: Player) {
    this.raceIdWebsocketConnectionsMapping[race.id].forEach(
      ({ playerId, connection }) => {
        if (playerId === newPlayer.id) return;
        const payload: BackendNewPlayerEvent = {
          event: BackendEventType.NEW_PLAYER,
          payload: {
            newPlayer
          }
        };
        connection.send(JSON.stringify(payload));
      }
    );
  }
  onTimerUpdated(
    race: Race,
    { timer, raceStatus }: { timer: number; raceStatus: RaceStatus }
  ) {
    this.raceIdWebsocketConnectionsMapping[race.id].forEach(
      ({ connection }) => {
        const payload: BackendRaceTimerUpdateEvent = {
          event: BackendEventType.RACE_TIMER_UPDATE,
          payload: {
            timerInSeconds: timer,
            raceStatus: raceStatus
          }
        };
        connection.send(JSON.stringify(payload));
      }
    );
  }
  onPlayerDataChanged(race: Race, newPlayer: Player) {
    this.raceIdWebsocketConnectionsMapping[race.id].forEach(
      ({ connection }) => {
        const payload: BackendPlayerDataChangeEvent = {
          event: BackendEventType.PLAYER_DATA_CHANGE,
          payload: {
            id: newPlayer.id,
            username: newPlayer.username,
            raceData: {
              completeness: newPlayer.raceData?.completeness,
              currentDocIndex: newPlayer.raceData?.currentDocIndex,
              executedCommands: newPlayer.raceData?.executedCommands
            }
          }
        };
        connection.send(JSON.stringify(payload));
      }
    );
  }
  onRaceFinished(race: Race) {
    this.raceIdWebsocketConnectionsMapping[race.id].forEach(
      ({ connection }) => {
        const payload: BackendRaceFinishEvent = {
          event: BackendEventType.RACE_FINISH,
          payload: {
            players: race.getPlayers()
          }
        };
        connection.send(JSON.stringify(payload));
      }
    );
  }
}
