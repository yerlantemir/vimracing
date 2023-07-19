import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import { WebSocketServer } from './race/WebSocketServer';
import trainingRouter from './training/getTrainingRace';
import { SupportedLanguages } from '@vimracing/shared';

const app = express();

app.use(cors());

const port = Number(process.env.PORT) || 8999;
const server = http.createServer(app);

const raceSocketServer = new WebSocketServer(server);

app.use('/race/training', trainingRouter);

app.post('/race/create', async (req, res) => {
  const { lang = SupportedLanguages.js } = req.query;

  const { raceId, hostToken } = await raceSocketServer.createRace(
    lang as SupportedLanguages
  );
  res.send({
    raceId,
    hostToken
  });
});

server.listen(port, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo)?.port
    } :)`
  );
});
