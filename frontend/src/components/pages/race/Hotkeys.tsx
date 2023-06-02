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
    const onVimCommandDone = (event: any) => {
      const { matchType }: { matchType: 'partial' | 'full' } = event.detail;
      // case with i, a, {, (, etc.
      if (matchType === 'full') {
        const { type, keys } = event.detail.command;
        if (type === 'operator') {
          // double d, c, y, etc.
          if (currentCommand === keys) {
            setExecutedCommands((prev) => [
              ...prev,
              {
                isFailed: false,
                command: currentCommand + currentCommand
              }
            ]);
          } else {
            setCurrentCommand(keys);
          }
        } else {
          setExecutedCommands((prev) => [
            ...prev,
            {
              isFailed: false,
              command:
                currentCommand +
                keys.replace('<character>', lastPressedKey.current)
            }
          ]);
          setCurrentCommand('');
        }
      }
    };
    window.addEventListener('vimracing-command-done', onVimCommandDone);
    return () => {
      window.removeEventListener('vimracing-command-done', onVimCommandDone);
    };
  }, [currentCommand, executedCommands, lastPressedKey]);
  return <div>{JSON.stringify(executedCommands)}</div>;
};
