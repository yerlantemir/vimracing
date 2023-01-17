import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { uuid } from 'uuidv4';
import { Room } from './types/Room';
import cors from 'cors';

const app = express();

app.use(cors());

const rooms: Record<string, Room> = {};

const doc = {
  start: `
    if (true) {
      console.log(hello);
    }
    else {
      console.log(fuck you!)
    }
  `,
  goal: `
    if (false) {
      console.log(hello);
    }
    else {
      console.log('fuck you!')
    }
  `
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
  if (request['event'] === 'CHANGE') {
    const requestData = request['data'];
    const raceId = requestData['raceId'];
    const userId = requestData['id'];
    const currentDoc = requestData['doc'];

    console.log('HERE', {
      requestData,
      raceId,
      userId,
      currentDoc,
      gaol: doc['goal'].trim()
    });
    if (raceId && userExistsOnRace(rooms[raceId], userId)) {
      console.log('CASDkl');
      const wsConnection = rooms[raceId].users.find(
        (user) => userId === user.userId
      )?.connection;
      if (currentDoc.trim() === doc['goal'].trim()) {
        wsConnection?.send(
          JSON.stringify({
            event: 'WIN',
            data: {
              userId
            }
          })
        );
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
    ws.send(
      JSON.stringify({
        status: '404'
      })
    );
    return;
  }

  if (raceId && !userExistsOnRace(rooms[raceId], userId)) {
    rooms[raceId].users.push({
      userId,
      connection: ws
    });
  }

  ws.on('message', onUserMessage);

  ws.send(
    JSON.stringify({
      event: 'RACE_ENTER',
      status: '200',
      id: userId,
      doc
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
