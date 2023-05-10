import { parseData } from '@/utils/raw';
import { CacheStorage } from '@/utils/storage';
import {
  FrontendRaceChangeEvent,
  ServerRaceChangeEvent,
  ServerRaceEnterEvent,
  SocketEventType
} from '@vimracing/shared';
import { useCallback, useEffect, useRef, useState } from 'react';

type User = {
  id: string;
  username: string;
  doc: string[];
};

export const useRace = (raceId: string) => {
  const [usersPayload, setUsersPayload] = useState<
    ServerRaceChangeEvent['data']['usersPayload'] | undefined
  >();
  const socketConnection = useRef<WebSocket | undefined>();

  const [raceDoc, setRaceDoc] = useState<
    | {
        start: string[];
        goal: string[];
      }
    | undefined
  >(undefined);

  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const sendCurrentUserPayloadChangeEvent = useCallback(
    (newUserPayload: User) => {
      if (!raceId || !newUserPayload) {
        console.error('No userId or raceId');
        return;
      }

      const eventDataString: FrontendRaceChangeEvent = {
        event: SocketEventType.CHANGE,
        data: {
          userId: newUserPayload.id,
          raceId,
          raceDoc: newUserPayload.doc,
          username: newUserPayload.username
        }
      };
      socketConnection.current?.send(JSON.stringify(eventDataString));
    },
    [raceId]
  );

  const onRaceEnter = ({
    userId,
    username,
    raceDoc
  }: ServerRaceEnterEvent['data']) => {
    setCurrentUser({ id: userId, username, doc: raceDoc.start });

    setRaceDoc(raceDoc);
  };

  const onDocChange = useCallback(
    (doc: string[]) => {
      setCurrentUser((prev) => {
        if (!prev) return undefined;
        const newData = { ...(prev ?? {}), doc };
        sendCurrentUserPayloadChangeEvent(newData);
        return newData;
      });
    },
    [sendCurrentUserPayloadChangeEvent]
  );

  const onRacePayloadChange = ({
    usersPayload
  }: ServerRaceChangeEvent['data']) => {
    setUsersPayload(usersPayload);
  };

  const onMessageFromServer = useCallback(
    (event: WebSocketEventMap['message']) => {
      const { event: socketEvent, data } = parseData(event.data);

      if (socketEvent === SocketEventType.RACE_ENTER) {
        onRaceEnter(data);
      } else if (socketEvent === SocketEventType.CHANGE) {
        onRacePayloadChange(data);
      }
    },
    []
  );

  useEffect(() => {
    const user = CacheStorage.getUser();
    console.log('AAAAAAAA?');

    const newSocketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${raceId}${
        user?.username ? `&username=${user.username}` : ''
      }${user?.id ? `&userId=${user.id}` : ''}`
    );

    newSocketConnection.addEventListener('message', onMessageFromServer);

    socketConnection.current = newSocketConnection;
    return () => {
      socketConnection.current?.close();
    };
  }, [onMessageFromServer, raceId]);

  return {
    currentUser,
    raceDoc,
    usersPayload,
    onDocChange
  };
};
