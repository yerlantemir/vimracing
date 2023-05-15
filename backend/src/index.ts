import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as cors from 'cors';
import { WebSocketServer } from './race/WebSocketServer';

const app = express();

app.use(cors());

const port = Number(process.env.PORT) || 8999;
const server = http.createServer(app);

new WebSocketServer(server);

server.listen(port, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
