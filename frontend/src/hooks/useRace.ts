import { LocalStorageManager } from '@/utils/storage';
import { RaceDocs } from '@vimracing/shared';
import {
  FrontendUsernameChangeEvent,
  FrontendDocumentChangeEvent,
  FrontendEventType,
  FrontendRaceHostStartEvent,
  Player,
  RaceStatus,
  BackendEventType,
  BackendNewPlayerEvent,
  BackendPlayerDataChangeEvent,
  BackendRaceFinishEvent,
  BackendRaceInitEvent,
  BackendRaceStartEvent,
  BackendRaceTimerUpdateEvent,
  ExecutedCommand
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

  const [raceDocs, setRaceDocs] = useState<RaceDocs | undefined>(undefined);

  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [players, setPlayers] = useState<Player[]>();
  const [raceTimer, setRaceTimer] = useState<number>();
  const [raceStatus, setRaceStatus] = useState<RaceStatus>();
  const isHost = useMemo(() => {
    const hostTokenString = LocalStorageManager.getHostToken();
    if (!hostTokenString) return false;
    const { raceId: hostTokenRaceId, hostToken } = hostTokenString;
    return hostTokenRaceId === raceId && !!hostToken;
  }, [raceId]);

  const onRaceInit = (payload: BackendRaceInitEvent['payload']) => {
    const {
      you,
      players: otherPlayers,
      raceStatus,
      raceDocs: initialRaceDocs,
      timerInSeconds
    } = payload;
    LocalStorageManager.setUser({
      id: you.id,
      username: you.username
    });

    setCurrentPlayer(you);
    setPlayers(otherPlayers);
    setRaceStatus(raceStatus);
    setRaceDocs(initialRaceDocs);
    setRaceTimer(timerInSeconds);
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
    const { timerInSeconds, raceStatus } = payload;
    setRaceTimer(timerInSeconds);
    setRaceStatus(raceStatus);
  };
  const onRaceStart = (payload: BackendRaceStartEvent['payload']) => {
    const { raceDocs: newRaceDoc } = payload;
    setRaceDocs(newRaceDoc);
  };

  const onCurrentPlayerUsernameChange = useCallback(
    (newUsername: string) => {
      if (!currentPlayer) return;

      const payload: FrontendUsernameChangeEvent = {
        event: FrontendEventType.USERNAME_CHANGE,
        payload: {
          newUsername
        }
      };

      socketConnection.current?.send(JSON.stringify(payload));
      LocalStorageManager.setUser({
        id: currentPlayer.id,
        username: newUsername
      });
    },
    [currentPlayer]
  );

  const onRacePlayerDataChange = useCallback(
    (payload: BackendPlayerDataChangeEvent['payload']) => {
      const { id, username, raceData } = payload;

      if (id === currentPlayer?.id) {
        setCurrentPlayer((prev: Player | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            username,
            raceData: {
              ...prev.raceData,
              ...raceData
            }
          };
        });
      }

      setPlayers((prev) =>
        prev?.map((player) => {
          if (player.id === id) {
            return {
              ...player,
              username,
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

  const onRaceFinish = ({
    players,
    you
  }: BackendRaceFinishEvent['payload']) => {
    setPlayers(players);
    setCurrentPlayer(you);
    setRaceStatus(RaceStatus.FINISHED);
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
          onRacePlayerDataChange(payload);
          break;
        case BackendEventType.RACE_FINISH:
          onRaceFinish(payload);
          break;
      }
    },
    [onNewPlayerJoin, onRacePlayerDataChange]
  );

  const onCurrentPlayerDocumentChange = useCallback(
    (
      newDocument: string[],
      documentIndex: number,
      executedCommands?: ExecutedCommand[]
    ) => {
      const payload: FrontendDocumentChangeEvent = {
        event: FrontendEventType.DOCUMENT_CHANGE,
        payload: {
          docIndex: documentIndex,
          newDocument,
          executedCommands
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
    const usernameParam = user?.username ? `&username=${user.username}` : '';

    const newSocketConnection = new WebSocket(
      `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/?raceId=${raceId}${userIdParam}${usernameParam}`
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
    onHostRaceStartClick,
    onCurrentPlayerUsernameChange
  };
};
