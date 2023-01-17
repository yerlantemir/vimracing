import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { uuid } from 'uuidv4';
import { Room } from './types/Room';
import cors from 'cors';

const app = express();

app.use(cors());

const rooms: Record<string, Room> = {};

app.post('/room/create', (req, res) => {
  const id = uuid();
  rooms[id] = {
    id,
    title: 'random',
    clients: new Set()
  };
  res.send({
    id
  });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const userExistsOnRace = (raceMap: Room, id: string) => {
  for (const { id: userId } of raceMap.clients) {
    if (id === userId) return true;
  }
  return false;
};

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const raceId = urlParams.get('raceId');
  const definedUserId = urlParams.get('userId');

  const userId = definedUserId ?? uuid();

  if (!raceId || !rooms[raceId]) {
    ws.send('404');
    return;
  }

  if (raceId && !userExistsOnRace(rooms[raceId], userId)) {
    rooms[raceId].clients.add({
      id: userId,
      connection: ws
    });
    console.log('new Race enter', rooms);
  }

  ws.send(
    JSON.stringify({
      id: userId
    })
  );
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
