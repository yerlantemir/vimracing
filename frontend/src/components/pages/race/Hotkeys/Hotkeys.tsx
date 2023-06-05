'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Command, ExecutedCommand } from './Command';
import { AnimatePresence } from 'framer-motion';

export const Hotkeys = () => {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>(
    []
  );
  const [currentCommand, setCurrentCommand] = useState('');
  const [partialCommandExecuted, setPartialCommandExecuted] = useState(false);
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
      const { matchType }: { matchType: 'partial' | 'full' | 'none' } =
        event.detail;
      let newExecutedCommand: ExecutedCommand | null = null;
      // case with i, a, "{"", "(", etc.

      if (
        ['<Down>', '<Up>', '<Left>', '<Right>'].includes(lastPressedKey.current)
      ) {
        newExecutedCommand = {
          isFailed: false,
          command: lastPressedKey.current,
          count: 1
        };
      } else if (matchType === 'full') {
        const { type, keys } = event.detail.command;
        if (type === 'operator') {
          // double d, c, y, etc.
          if (currentCommand === keys) {
            newExecutedCommand = {
              isFailed: false,
              command: currentCommand + currentCommand,
              count: 1
            };
          } else {
            setCurrentCommand(keys);
          }
        } else {
          // to handle case:
          /*
           currentCommand: di(we should delete "i" here)
           keys: i<character>
           */
          const newCommandString = partialCommandExecuted
            ? currentCommand.slice(0, currentCommand.length - 1)
            : currentCommand;

          newExecutedCommand = {
            isFailed: false,
            command:
              newCommandString +
              keys.replace('<character>', lastPressedKey.current),
            count: 1
          };

          setCurrentCommand('');
        }
      } else if (matchType === 'partial') {
        setCurrentCommand((prev) => prev + lastPressedKey.current);
        setPartialCommandExecuted(true);
      } else if (matchType === 'none') {
        setCurrentCommand('');
      }
      if (newExecutedCommand) {
        setExecutedCommands([...executedCommands, newExecutedCommand]);
      }
    };
    window.addEventListener('vimracing-command-done', onVimCommandDone);
    return () => {
      window.removeEventListener('vimracing-command-done', onVimCommandDone);
    };
  }, [
    currentCommand,
    executedCommands,
    lastPressedKey,
    partialCommandExecuted
  ]);
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      const lastCommand = executedCommands[executedCommands.length - 1];
      const lastLastCommand = executedCommands[executedCommands.length - 2];
      console.log({ executedCommands });

      if (
        lastCommand &&
        lastLastCommand &&
        lastCommand.command === lastLastCommand.command
      ) {
        setExecutedCommands([
          ...executedCommands.slice(0, executedCommands.length - 2),
          {
            ...lastLastCommand,
            count: (lastLastCommand?.count ?? 0) + (lastCommand?.count ?? 0)
          }
        ]);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [executedCommands]);

  return (
    <div className="flex gap-3">
      <AnimatePresence>
        {executedCommands.map((command, index) => {
          return <Command key={index} {...command} index={index} />;
        })}
      </AnimatePresence>
      {currentCommand && (
        <Command
          isFailed={false}
          command={currentCommand}
          index={executedCommands.length}
        />
      )}
    </div>
  );
};
