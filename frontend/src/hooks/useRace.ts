import { LocalStorageManager } from '@/utils/storage';
import { Player, RaceState } from '@vimracing/shared';
import {
  BackendEventType,
  BackendNewPlayerEvent,
  BackendPlayerDataChangeEvent,
  BackendRaceFinishEvent,
  BackendRaceInitEvent,
  BackendRaceStartEvent,
  BackendRaceTimerUpdateEvent
} from '@vimracing/shared';
import { useCallback, useEffect, useRef, useState } from 'react';

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

  const onRaceInit = (payload: BackendRaceInitEvent['payload']) => {
    const { you, players: otherPlayers } = payload;
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
    const { timerInSeconds } = payload;
    setRaceTimer(timerInSeconds);
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

  useEffect(() => {
    const user = LocalStorageManager.getUser();
    const userIdParam = user?.id ? `&userId=${user.id}` : '';

    const newSocketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${raceId}${userIdParam}`
    );

    newSocketConnection.addEventListener('message', onMessageFromServer);

    socketConnection.current = newSocketConnection;
    return () => {
      socketConnection.current?.close();
    };
  }, [onMessageFromServer, raceId]);

  return {
    raceDoc,
    players,
    currentPlayer,
    raceTimer,
    raceStatus
  };
};
