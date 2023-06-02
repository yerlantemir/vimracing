'use client';

import { useEffect, useRef, useState } from 'react';

type ExecutedCommand = {
  isFailed: boolean;
  command: string;
  count?: number;
};

const Command: React.FC<ExecutedCommand> = ({ command, count }) => {
  return (
    <div className="py-2 px-3 bg-gray-5 text-gray border border-blue-2 relative">
      {command}
      <span className="absolute top-0 right-1 text-xs opacity-80">{count}</span>
    </div>
  );
};

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
      let newExecutedCommand: ExecutedCommand;
      // case with i, a, "{"", "(", etc.
      if (matchType === 'full') {
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
      if (!!newExecutedCommand) {
        if (
          executedCommands[executedCommands.length - 1]?.command ===
          newExecutedCommand?.command
        ) {
          setExecutedCommands([
            ...executedCommands.slice(0, executedCommands.length - 1),
            {
              ...newExecutedCommand,
              count:
                (executedCommands[executedCommands.length - 1].count || 0) + 1
            }
          ]);
        } else {
          setExecutedCommands([...executedCommands, newExecutedCommand]);
        }
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

  return (
    <div className="flex gap-3 flex-wrap">
      {executedCommands.map((command, index) => {
        return <Command key={index} {...command} />;
      })}
      {currentCommand && <Command isFailed={false} command={currentCommand} />}
    </div>
  );
};
