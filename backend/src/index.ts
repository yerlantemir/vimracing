import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { uuid } from 'uuidv4';
import { Room } from './types/Room';

const app = express();

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

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
