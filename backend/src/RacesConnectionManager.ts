import { uuid } from 'uuidv4';
import * as WebSocket from 'ws';
import { RaceConnection, UserConnection } from './types/Connection';
import {
  ServerRaceChangeEvent,
  ServerRaceEnterEvent,
  ServerRaceNotFoundEvent,
  SocketEventType,
  FrontendRaceChangeEvent
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
      const payload: ServerRaceNotFoundEvent = {
        event: SocketEventType.NOT_FOUND,
        data: {}
      };

      ws.send(JSON.stringify(payload));
      return;
    }

    if (!RacesConnectionManager._userExistsOnRace(raceId, userId)) {
      RacesConnectionManager._addUserToRace(raceId, {
        id: userId,
        connection: ws,
        currentDoc: race.doc.start
      });
    }

    ws.on('message', this._onUserMessage.bind(this));

    const payload: ServerRaceEnterEvent = {
      event: SocketEventType.RACE_ENTER,
      data: {
        id: userId,
        raceDoc: race.doc
      }
    };

    ws.send(JSON.stringify(payload));
  }

  static _onUserMessage(data: WebSocket.RawData) {
    const request: FrontendRaceChangeEvent = JSON.parse(data.toString());
    const {
      data: { raceId, userId, raceDoc },
      event
    } = request;

    if (!raceId || !userId) return;

    const currentRace = this._getRaceById(raceId);

    if (
      !currentRace ||
      !RacesConnectionManager._userExistsOnRace(raceId, userId)
    )
      return;

    if (event === SocketEventType.CHANGE) {
      this._onDocChange({ race: currentRace, userId, userDoc: raceDoc });
    }
  }

  static _onDocChange({
    race,
    userId,
    userDoc
  }: {
    race: RaceConnection;
    userId: string;
    userDoc: string[];
  }) {
    this.racesConnection = this.racesConnection.map((r) => {
      if (r.id !== race.id) {
        return r;
      }
      return {
        ...r,
        users: r.users.map((user) => {
          if (user.id !== userId) {
            return user;
          }
          return {
            ...user,
            currentDoc: userDoc
          };
        })
      };
    });

    race.users.forEach((user) => {
      const payload: ServerRaceChangeEvent = {
        event: SocketEventType.CHANGE,
        data: {
          usersPayload: race.users.map((user) => ({
            id: user.id,
            completeness: this._getCompletenessPercentage(
              user.currentDoc,
              race.doc.goal
            )
          }))
        }
      };
      user.connection?.send(JSON.stringify(payload));
    });
  }

  static _getCompletenessPercentage(userDoc: string[], goalDoc: string[]) {
    let count = 0;
    userDoc.forEach((line, index) => {
      if (line === goalDoc[index]) count++;
    });

    return Math.floor((count / goalDoc.length) * 100);
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

  // TBD
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
