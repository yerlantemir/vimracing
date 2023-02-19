import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { uuid } from 'uuidv4';
import * as cors from 'cors';
import mongo from 'mongoose';
import { RacesConnectionManager } from './RacesConnectionManager';

mongo.connect('mongodb://127.0.01:27017/vimracing').then(() => {});

const app = express();

app.use(cors());

app.post('/room/create', (req, res) => {
  const { id } = RacesConnectionManager.createRace();
  res.send({
    id
  });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const raceId = urlParams.get('raceId');
  const definedUserId = urlParams.get('userId');

  const userId = definedUserId ?? uuid();
  if (!raceId || !userId) {
    console.error('invalid params');
    return;
  }
  RacesConnectionManager.onRaceEnter(raceId, userId, ws);
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
