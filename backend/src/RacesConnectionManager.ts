import { uuid } from 'uuidv4';
import * as WebSocket from 'ws';
import { RaceConnection, UserConnection } from './types/Connection';
import {
  RaceEnterEvent,
  RaceNotFoundEvent,
  RaceFinishEvent,
  SocketEventType,
  RACE_FINISH_RESULT
} from '@vimracing/shared';

export class RacesConnectionManager {
  static racesConnection: RaceConnection[] = [];

  static createRace() {
    const newRacePayload = {
      id: uuid(),
      title: 'random',
      users: [],
      doc: this._selectDoc()
    };

    this.racesConnection.push(newRacePayload);
    return newRacePayload;
  }

  static onRaceEnter(raceId: string, userId: string, ws: WebSocket) {
    const race = this._getRaceById(raceId);
    if (!race || !RacesConnectionManager._raceExists(raceId)) {
      const payload: RaceNotFoundEvent = {
        event: SocketEventType.NOT_FOUND,
        data: {}
      };

      ws.send(JSON.stringify(payload));
      return;
    }

    if (!RacesConnectionManager._userExistsOnRace(raceId, userId)) {
      RacesConnectionManager._addUserToRace(raceId, {
        id: userId,
        connection: ws
      });
    }

    ws.on('message', this._onUserMessage.bind(this));

    const payload: RaceEnterEvent = {
      event: SocketEventType.RACE_ENTER,
      data: {
        id: userId,
        raceDoc: race.doc
      }
    };

    ws.send(JSON.stringify(payload));
  }

  static _onUserMessage(data: WebSocket.RawData) {
    const request = JSON.parse(data.toString());

    if (request['event'] === SocketEventType.CHANGE) {
      const requestData = request['data'];
      const raceId = requestData['raceId'];
      const userId = requestData['id'];
      const userDoc = requestData['doc'];

      if (!raceId || !userId) return;

      const currentRace = this._getRaceById(raceId);

      if (
        !currentRace ||
        !RacesConnectionManager._userExistsOnRace(raceId, userId)
      )
        return;

      if (this._isDocsEqual(userDoc, currentRace.doc.goal)) {
        this._onUserWin(currentRace, userId);
      }
    }
  }

  static _onUserWin(race: RaceConnection, currentUserId: string) {
    race.users.forEach((user) => {
      const payload: RaceFinishEvent = {
        event: SocketEventType.RACE_FINISH,
        data: {
          id: currentUserId,
          result:
            user.id === currentUserId
              ? RACE_FINISH_RESULT.WIN
              : RACE_FINISH_RESULT.LOSE
        }
      };
      user.connection?.send(JSON.stringify(payload));
      user.connection.close();
    });
  }

  static _isDocsEqual(a: string[], b: string[]) {
    return a.join('') === b.join('');
  }

  static _userExistsOnRace(raceId: string, userId: string) {
    return this.racesConnection.some((race) => {
      return (
        race.id === raceId && race.users.some((user) => user.id === userId)
      );
    });
  }

  static _raceExists(raceId: string) {
    return this.racesConnection.some((race) => race.id === raceId);
  }

  static _selectDoc() {
    return {
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
  }

  static _addUserToRace(raceId: string, userConnection: UserConnection) {
    this.racesConnection
      .find((race) => race.id === raceId)
      ?.users.push(userConnection);
  }

  static _getRaceById(id: string) {
    return this.racesConnection.find((r) => r.id === id);
  }

  /*
  * createRace + 
  * onRaceEnter
  * onChange // 
  * _raceExists + 
  * _userExistsOnRace +
  

  */
}
