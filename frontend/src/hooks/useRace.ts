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

  const [raceDocs, setRaceDocs] = useState<
    | {
        start: string[];
        target: string[];
      }[]
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
    const { raceDocs: newRaceDoc } = payload;
    setRaceDocs(newRaceDoc);
  };

  const onRacePlayerDataChange = useCallback(
    (payload: BackendPlayerDataChangeEvent['payload']) => {
      const { id, raceData } = payload;

      if (id === currentPlayer.id) {
        setCurrentPlayer((prev: Player) => ({
          ...prev,
          raceData: {
            ...prev?.raceData,
            ...raceData
          }
        }));
        return;
      }
      setPlayers((prev) =>
        prev?.map((player) => {
          if (player.id === id) {
            return {
              ...player,
              raceData: {
                ...player.raceData,
                ...raceData
              }
            };
          }
          return player;
        })
      );
    },
    [currentPlayer?.id]
  );
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
          onRacePlayerDataChange(payload);
          break;
        case BackendEventType.RACE_FINISH:
          break;
      }
    },
    [onNewPlayerJoin, onRacePlayerDataChange]
  );

  const onCurrentPlayerDocumentChange = useCallback(
    (newDocument: string[], documentIndex: number) => {
      const payload: FrontendDocumentChangeEvent = {
        event: FrontendEventType.DOCUMENT_CHANGE,
        payload: {
          docIndex: documentIndex,
          newDocument
        }
      };
      socketConnection.current?.send(JSON.stringify(payload));
    },
    []
  );

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
    raceDocs,
    players,
    currentPlayer,
    raceTimer,
    raceStatus,
    onDocChange: onCurrentPlayerDocumentChange,
    isHost,
    onHostRaceStartClick
  };
};
