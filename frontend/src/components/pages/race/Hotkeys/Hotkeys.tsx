'use client';

import { useEffect, useRef, useState } from 'react';
import { Command } from './Command';
import { AnimatePresence, useAnimate } from 'framer-motion';
import { ExecutedCommand } from '@vimracing/shared';
import './Hotkeys.css';
import { CounterIcon } from '@/components/icons';

interface IHotkeysProps {
  setExecutedCommands?: (ExecutedCommands: ExecutedCommand[]) => void;
  executedCommands?: ExecutedCommand[];
  keysCount?: number;
  onKeyPressed?: (key: string) => void;
}
export const Hotkeys: React.FC<IHotkeysProps> = ({
  setExecutedCommands,
  executedCommands = [],
  keysCount,
  onKeyPressed
}) => {
  const commandsContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentCommand, setCurrentCommand] = useState('');
  const [partialCommandExecuted, setPartialCommandExecuted] = useState(false);
  const lastPressedKey = useRef('');

  useEffect(() => {
    const onVimKey = (event: any) => {
      lastPressedKey.current = event.detail;
      onKeyPressed?.(event.detail);
    };
    window.addEventListener('vimracing-key', onVimKey);
    return () => {
      window.removeEventListener('vimracing-key', onVimKey);
    };
  }, [onKeyPressed]);

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
          isFailed: true,
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
            setCurrentCommand('');
          } else {
            if (currentCommand) {
              newExecutedCommand = {
                isFailed: true,
                command: currentCommand,
                count: 1
              };
            }
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
      } else {
        setCurrentCommand('');
      }
      if (newExecutedCommand) {
        setExecutedCommands?.([...executedCommands, newExecutedCommand]);
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
    partialCommandExecuted,
    setExecutedCommands
  ]);

  useEffect(() => {
    const lastCommand = executedCommands[executedCommands.length - 1];
    const lastLastCommand = executedCommands[executedCommands.length - 2];

    if (
      lastCommand &&
      lastLastCommand &&
      lastCommand.command === lastLastCommand.command
    ) {
      setExecutedCommands?.([
        ...executedCommands.slice(0, executedCommands.length - 2),
        {
          ...lastLastCommand,
          count: (lastLastCommand?.count ?? 0) + (lastCommand?.count ?? 0)
        }
      ]);
    }
  }, [executedCommands, setExecutedCommands]);

  const allCommands = currentCommand
    ? [
        ...executedCommands,
        {
          isFailed: false,
          command: currentCommand,
          count: 1
        }
      ]
    : executedCommands;

  useEffect(() => {
    if (commandsContainerRef.current && executedCommands)
      commandsContainerRef.current.scrollLeft =
        commandsContainerRef.current.scrollWidth;
  }, [executedCommands]);

  return (
    <>
      <div
        className="flex gap-3 overflow-x-auto overflow-y-hidden commands py-2"
        ref={commandsContainerRef}
      >
        <AnimatePresence>
          {allCommands.map((command, index) => {
            return <Command key={index} {...command} index={index} />;
          })}
        </AnimatePresence>
      </div>
      {!!keysCount && <KeysCounter count={keysCount} />}
    </>
  );
};

const KeysCounter: React.FC<{ count: number }> = ({ count }) => {
  const [scope, animate] = useAnimate();
  const prevCount = useRef<number>(0);

  useEffect(() => {
    if (count !== prevCount.current) {
      animate(
        scope.current,
        {
          scale: [1, 1.5, 1]
        },
        {
          times: [0.9, 1],
          duration: 0.3
        }
      );
    }
    prevCount.current = count;
  }, [animate, count, scope]);

  if (!count) return null;

  return (
    <div className="text-xl flex justify-center items-center gap-2" ref={scope}>
      <CounterIcon className="h-4 w-4" />
      {count}
    </div>
  );
};
