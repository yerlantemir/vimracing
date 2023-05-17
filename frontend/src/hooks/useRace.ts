import { LocalStorageManager } from '@/utils/storage';
import {
  FrontendDocumentChangeEvent,
  FrontendEventType,
  FrontendRaceHostStartEvent,
  Player,
  RaceState
} from '@vimracing/shared';
import {
  BackendEventType,
  BackendNewPlayerEvent,
  BackendPlayerDataChangeEvent,
  BackendRaceFinishEvent,
  BackendRaceInitEvent,
  BackendRaceStartEvent,
  BackendRaceTimerUpdateEvent
} from '@vimracing/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type BackendRaceEvent =
  | BackendRaceInitEvent
  | BackendNewPlayerEvent
  | BackendRaceTimerUpdateEvent
  | BackendRaceStartEvent
  | BackendPlayerDataChangeEvent
  | BackendRaceFinishEvent;

export const useRace = (raceId: string) => {
  const socketConnection = useRef<WebSocket | undefined>();

  const [raceDoc, setRaceDoc] = useState<
    | {
        start: string[];
        target: string[];
      }
    | undefined
  >(undefined);

  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [players, setPlayers] = useState<Player[]>();
  const [raceTimer, setRaceTimer] = useState<number>();
  const [raceStatus, setRaceStatus] = useState<RaceState>();
  const isHost = useMemo(() => {
    const hostTokenString = LocalStorageManager.getHostToken();
    if (!hostTokenString) return false;
    const { raceId: hostTokenRaceId, hostToken } = hostTokenString;
    return hostTokenRaceId === raceId && !!hostToken;
  }, [raceId]);

  const onRaceInit = (payload: BackendRaceInitEvent['payload']) => {
    const { you, players: otherPlayers } = payload;
    LocalStorageManager.setUser({
      id: you.id,
      username: you.username
    });
    setCurrentPlayer(you);
    setPlayers(otherPlayers);
    setRaceStatus(RaceState.WAITING);
  };
  const onNewPlayerJoin = useCallback(
    (payload: BackendNewPlayerEvent['payload']) => {
      const { newPlayer } = payload;
      setPlayers((prev) => [...(prev ?? []), newPlayer]);
    },
    []
  );
  const onRaceTimerUpdate = (
    payload: BackendRaceTimerUpdateEvent['payload']
  ) => {
    const { timerInSeconds, raceState } = payload;
    setRaceTimer(timerInSeconds);
    setRaceStatus(raceState);
  };
  const onRaceStart = (payload: BackendRaceStartEvent['payload']) => {
    const { raceDoc: newRaceDoc } = payload;
    setRaceDoc(newRaceDoc);
  };
  const onOtherPlayerDataChange = (
    payload: BackendPlayerDataChangeEvent['payload']
  ) => {
    const { id, completeness } = payload;
    setPlayers((prev) =>
      prev?.map((player) => {
        if (player.id === id) {
          return { ...player, completeness };
        }
        return player;
      })
    );
  };
  const onMessageFromServer = useCallback(
    (event: WebSocketEventMap['message']) => {
      const { event: socketEvent, payload } = JSON.parse(
        event.data
      ) as BackendRaceEvent;

      switch (socketEvent) {
        case BackendEventType.RACE_INIT:
          onRaceInit(payload);
          break;
        case BackendEventType.NEW_PLAYER:
          onNewPlayerJoin(payload);
          break;
        case BackendEventType.RACE_TIMER_UPDATE:
          onRaceTimerUpdate(payload);
          break;
        case BackendEventType.RACE_START:
          onRaceStart(payload);
          break;
        case BackendEventType.PLAYER_DATA_CHANGE:
          onOtherPlayerDataChange(payload);
          break;
        case BackendEventType.RACE_FINISH:
          break;
      }
    },
    [onNewPlayerJoin]
  );

  const onCurrentPlayerDocumentChange = (newDocument: string[]) => {
    const payload: FrontendDocumentChangeEvent = {
      event: FrontendEventType.DOCUMENT_CHANGE,
      payload: {
        newDocument
      }
    };
    socketConnection.current?.send(JSON.stringify(payload));
  };

  const onHostRaceStartClick = () => {
    if (!isHost) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { hostToken } = LocalStorageManager.getHostToken()!;

    const payload: FrontendRaceHostStartEvent = {
      event: FrontendEventType.HOST_RACE_START_CLICK,
      payload: { hostToken }
    };
    socketConnection.current?.send(JSON.stringify(payload));
  };
  useEffect(() => {
    const user = LocalStorageManager.getUser();
    const userIdParam = user?.id ? `&userId=${user.id}` : '';

    const newSocketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${raceId}${userIdParam}`
    );

    newSocketConnection.addEventListener('message', onMessageFromServer);

    socketConnection.current = newSocketConnection;
    return () => {
      newSocketConnection.removeEventListener('message', onMessageFromServer);
      socketConnection.current?.close();
    };
  }, [onMessageFromServer, raceId]);

  return {
    raceDoc,
    players,
    currentPlayer,
    raceTimer,
    raceStatus,
    onDocChange: onCurrentPlayerDocumentChange,
    isHost,
    onHostRaceStartClick
  };
};
