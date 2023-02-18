import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { uuid } from 'uuidv4';
import { Room } from './types/Room';
import * as cors from 'cors';
import {
  RaceEnterEvent,
  RaceNotFoundEvent,
  RaceWinEvent,
  SocketEventType
} from '@vimracing/shared';

const app = express();

app.use(cors());

const rooms: Record<string, Room> = {};

const doc = {
  start: [
    'if (true) {',
    '  console.log(hello);',
    '}',
    'else {',
    '   console.log(fuck you!)',
    '}'
  ],
  goal: [
    'if (false) {',
    '  console.log(hello);',
    '}',
    'else {',
    "  console.log('fuck you!')",
    '}'
  ]
};

app.post('/room/create', (req, res) => {
  const id = uuid();
  rooms[id] = {
    id,
    title: 'random',
    users: [],
    doc
  };
  res.send({
    id
  });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const userExistsOnRace = (raceMap: Room, id: string) => {
  for (const { userId } of raceMap.users) {
    if (id === userId) return true;
  }
  return false;
};

const onUserMessage = (data: WebSocket.RawData) => {
  const request = JSON.parse(data.toString());
  if (request['event'] === SocketEventType.CHANGE) {
    const requestData = request['data'];
    const raceId = requestData['raceId'];
    const userId = requestData['id'];
    const currentDoc = requestData['doc'];

    if (raceId && userExistsOnRace(rooms[raceId], userId)) {
      const wsConnectionS = rooms[raceId].users.map((user) => user.connection);
      if (currentDoc.join('') === doc.goal.join('')) {
        wsConnectionS.forEach((con) => {
          const payload: RaceWinEvent = {
            event: SocketEventType.WIN,
            data: {
              id: userId
            }
          };
          con?.send(JSON.stringify(payload));
        });
      }
    }
  }
};

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const raceId = urlParams.get('raceId');
  const definedUserId = urlParams.get('userId');

  const userId = definedUserId ?? uuid();

  if (!raceId || !rooms[raceId]) {
    const payload: RaceNotFoundEvent = {
      event: SocketEventType.NOT_FOUND,
      data: {}
    };

    ws.send(JSON.stringify(payload));
    return;
  }

  if (raceId && !userExistsOnRace(rooms[raceId], userId)) {
    rooms[raceId].users.push({
      userId,
      connection: ws
    });
  }

  ws.on('message', onUserMessage);

  const payload: RaceEnterEvent = {
    event: SocketEventType.RACE_ENTER,
    data: {
      id: userId,
      raceDoc: doc
    }
  };

  ws.send(JSON.stringify(payload));
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
