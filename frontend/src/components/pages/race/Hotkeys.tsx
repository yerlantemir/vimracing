'use client';

import { useEffect, useState } from 'react';

type ExecutedCommand = {
  isFailed: boolean;
  command: string;
};
export const Hotkeys = () => {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>(
    []
  );
  const [currentCommand, setCurrentCommand] = useState('');
  const [lastPressedKey, setLastPressedKey] = useState('');

  useEffect(() => {
    const onVimCommand = (event: any) => {
      console.log(event.detail);
      if (event.detail.type === 'operator') {
        // g~, gu, gU, gg, gw...
        if (event.detail.keys.length > 1) {
          setExecutedCommands([
            ...executedCommands,
            { isFailed: false, command: event.detail.keys }
          ]);
          return;
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
        setCurrentCommand('');
      }
      if (event.detail.type === 'operatorMotion') {
        setExecutedCommands([
          ...executedCommands,
          { isFailed: false, command: event.detail.keys }
        ]);
      }
      if (event.detail.type === 'motion') {
        const pressedKeys = event.detail.keys as string;
        // handle diw, viw, ciw, yiw, di", ci", yi", vi", di}, ci}, yi}, vi}
      }
    };
    const onVimKey = (event: any) => {
      setLastPressedKey(event.detail);
      console.log(event.detail);
    };

    window.addEventListener('vimracing-key', onVimKey);
    window.addEventListener('vimracing-command', onVimCommand);
    return () => {
      window.removeEventListener('vimracing-command', onVimCommand);

      window.removeEventListener('vimracing-key', onVimKey);
    };
  }, [currentCommand, executedCommands]);
  return <div>{JSON.stringify(executedCommands)}</div>;
};
