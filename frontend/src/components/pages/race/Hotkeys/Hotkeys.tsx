'use client';

import { useEffect, useRef, useState } from 'react';
import { Command } from './Command';
import { AnimatePresence, useAnimate } from 'framer-motion';
import { ExecutedCommand } from '@vimracing/shared';

interface IHotkeysProps {
  setExecutedCommands?: (ExecutedCommands: ExecutedCommand[]) => void;
  executedCommands?: ExecutedCommand[];
}
export const Hotkeys: React.FC<IHotkeysProps> = ({
  setExecutedCommands,
  executedCommands = []
}) => {
  const [currentCommand, setCurrentCommand] = useState('');
  const [partialCommandExecuted, setPartialCommandExecuted] = useState(false);
  const [keysCount, setKeysCount] = useState(0);
  const lastPressedKey = useRef('');

  useEffect(() => {
    const onVimKey = (event: any) => {
      lastPressedKey.current = event.detail;
      setKeysCount((prev) => prev + 1);
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

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        <AnimatePresence>
          {allCommands.map((command, index) => {
            return <Command key={index} {...command} index={index} />;
          })}
        </AnimatePresence>
      </div>
      <KeysCounter count={keysCount} />
    </>
  );
};

const KeysCounter: React.FC<{ count: number }> = ({ count }) => {
  const [scope, animate] = useAnimate();
  const prevCount = useRef<number>(0);

  useEffect(() => {
    if (count !== prevCount.current) {
      animate(scope.current, {
        scale: [1.5, 1],
        color: ['var(--color-text)', 'var(--color-primary)']
      });
    }
    prevCount.current = count;
  }, [animate, count, scope]);

  if (!count) return null;
  return (
    <div className="flex justify-center">
      <span className="text-xl" ref={scope}>
        {count}
      </span>
    </div>
  );
};
