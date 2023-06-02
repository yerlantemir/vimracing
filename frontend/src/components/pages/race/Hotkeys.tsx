'use client';

import { useEffect, useRef, useState } from 'react';

type ExecutedCommand = {
  isFailed: boolean;
  command: string;
};
export const Hotkeys = () => {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>(
    []
  );
  const [currentCommand, setCurrentCommand] = useState('');
  const lastPressedKey = useRef('');

  useEffect(() => {
    const onVimKey = (event: any) => {
      lastPressedKey.current = event.detail;
    };
    window.addEventListener('vimracing-key', onVimKey);
    return () => {
      window.removeEventListener('vimracing-key', onVimKey);
    };
  }, []);

  useEffect(() => {
    const onVimCommand = (event: any) => {
      if (event.detail.type === 'action') {
        setExecutedCommands([
          ...executedCommands,
          {
            isFailed: false,
            command: event.detail.keys.replace('<character>', '')
          }
        ]);
        return;
      }
      if (event.detail.type === 'operator') {
        // g~, gu, gU, gg, gw...
        if (event.detail.keys.length > 1) {
          setExecutedCommands([
            ...executedCommands,
            { isFailed: false, command: event.detail.keys }
          ]);
        }
        const pressedKey = event.detail.keys;
        if (currentCommand === '') {
          setCurrentCommand(pressedKey);
          return;
        }
        setExecutedCommands([
          ...executedCommands,
          {
            isFailed: pressedKey !== currentCommand,
            command: pressedKey + currentCommand
          }
        ]);
      }
      if (event.detail.type === 'operatorMotion') {
        // x, X, d, D, Y, C, c, s, S, ~
        setExecutedCommands([
          ...executedCommands,
          { isFailed: false, command: event.detail.keys }
        ]);
      }
      if (event.detail.type === 'motion') {
        const pressedKeys = event.detail.keys as string;

        let command = '';
        // handle diw, viw, ciw, daw, vaw, yaw, yiw, di", ci", yi", vi", di}, ci}, yi}, vi}, etc.
        // currentCommand is the operator(d,y,c,etc.)
        // last pressedKey is the character(w, ", }, etc.)
        if (currentCommand && pressedKeys.includes('<character>')) {
          command =
            currentCommand +
            pressedKeys.replace('<character>', lastPressedKey.current);
        }
        // dw, yw, cw, d$, y$, c$, etc.
        if (currentCommand && pressedKeys.length === 1) {
          command = currentCommand + pressedKeys;
        }
        // H, L, ge, gg, etc.
        if (!currentCommand) {
          command = pressedKeys;
        }
        setExecutedCommands([
          ...executedCommands,
          { isFailed: false, command }
        ]);
      }

      setCurrentCommand('');
    };

    window.addEventListener('vimracing-command', onVimCommand);
    return () => {
      window.removeEventListener('vimracing-command', onVimCommand);
    };
  }, [currentCommand, executedCommands, lastPressedKey]);
  return <div>{JSON.stringify(executedCommands)}</div>;
};
