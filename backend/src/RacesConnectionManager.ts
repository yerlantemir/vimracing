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

  static onRaceEnter(
    raceId: string,
    userId: string,
    existingUsername: string | null,
    ws: WebSocket
  ) {
    const race = this._getRaceById(raceId);
    if (!race || !RacesConnectionManager._raceExists(raceId)) {
      const payload: ServerRaceNotFoundEvent = {
        event: SocketEventType.NOT_FOUND,
        data: {}
      };

      ws.send(JSON.stringify(payload));
      return;
    }

    const user = race.users.find((u) => u.id === userId);
    const username = existingUsername ?? `Guest`;

    if (!user) {
      RacesConnectionManager._addUserToRace(raceId, {
        id: userId,
        connection: ws,
        currentDoc: race.doc.start,
        username
      });
    } else {
      user.connection = ws;
    }

    ws.on('message', this._onUserMessage.bind(this));

    const payload: ServerRaceEnterEvent = {
      event: SocketEventType.RACE_ENTER,
      data: {
        userId,
        username,
        raceDoc: {
          start: user?.currentDoc ?? race.doc.start,
          goal: race.doc.goal
        }
      }
    };

    ws.send(JSON.stringify(payload));

    this._broadcastRaceChange(raceId);
  }

  static _onUserMessage(data: WebSocket.RawData) {
    const request: FrontendRaceChangeEvent = JSON.parse(data.toString());
    const {
      data: { raceId, username, userId, raceDoc },
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
      this._onUserPayloadChange({
        race: currentRace,
        user: {
          id: userId,
          doc: raceDoc,
          username: username
        }
      });
    }
  }

  static _onUserPayloadChange({
    race,
    user: { id, doc, username }
  }: {
    race: RaceConnection;
    user: {
      id: string;
      doc: string[];
      username: string;
    };
  }) {
    race.users = race.users.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          currentDoc: doc,
          username
        };
      }
      return u;
    });
    this._broadcastRaceChange(race.id);
  }

  static _broadcastRaceChange(raceId: string) {
    const race = this._getRaceById(raceId);
    if (!race) return;

    race.users.forEach((user) => {
      const payload: ServerRaceChangeEvent = {
        event: SocketEventType.CHANGE,
        data: {
          usersPayload: race.users.map((user) => ({
            id: user.id,
            username: user.username,
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
