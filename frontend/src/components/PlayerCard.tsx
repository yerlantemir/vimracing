'use client';

import { Player, RaceStatus } from '@vimracing/shared';
import { ProgressBar } from './pages/race/ProgressBar';
import { useCallback, useEffect, useRef, useState } from 'react';

type PlayerCardProps = {
  isCurrentUser: boolean;
  raceStatus?: RaceStatus;
  raceDocsCount: number;
  onUsernameChangeCallback?: (newUsername: string) => void;
  player: Player;
  onRecapClick?: (player: Player) => void;
  recapProps?: {
    currentRecapTaskIndex?: number;
    onTaskClick?: (taskIndex: number) => void;
  };
};

const USERNAME_MAX_LENGTH = 15;
export const PlayerCard: React.FC<PlayerCardProps> = ({
  isCurrentUser,
  player,
  raceDocsCount,
  raceStatus,
  onUsernameChangeCallback,
  onRecapClick,
  recapProps
}) => {
  const { username: initialUsername, raceData } = player;

  const [username, setUsername] = useState(initialUsername);
  const [isEditingUsername, setEditingUsername] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const onUsernameDblClick = () => {
    if (isCurrentUser && raceStatus === RaceStatus.WAITING) {
      setEditingUsername(true);
    }
  };
  const onUsernameInputBlur = useCallback(() => {
    setEditingUsername(false);
    if (username.length === 0) {
      setUsername(initialUsername);
      return;
    }
    if (username === initialUsername) {
      return;
    }
    onUsernameChangeCallback?.(username);
  }, [initialUsername, onUsernameChangeCallback, username]);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.trim();
    if (newUsername.length > USERNAME_MAX_LENGTH) return;
    setUsername(newUsername);
  };

  const renderUsername = () => {
    if (!isCurrentUser) {
      return <span className="opacity-80">{initialUsername}</span>;
    }
    if (isEditingUsername) {
      return (
        <input
          type="text"
          className="border-none outline-none bg-transparent text-gray-2 italic"
          style={{
            width: '80%'
          }}
          ref={usernameInputRef}
          value={username}
          onChange={onUsernameChange}
          onBlur={onUsernameInputBlur}
        />
      );
    }
    return (
      <span
        className="opacity-80 cursor-pointer"
        onDoubleClick={onUsernameDblClick}
      >
        {username}
      </span>
    );
  };

  const completeness = raceData?.completeness ?? 0;
  const currentDocIndex = raceData?.currentDocIndex ?? 0;
  const executedCommands = raceData?.executedCommands ?? [];

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (
        usernameInputRef.current &&
        !usernameInputRef.current.contains(e.target as Node)
      ) {
        onUsernameInputBlur();
      }
    };
    const onEnterPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onUsernameInputBlur();
      }
    };
    if (usernameInputRef.current && isEditingUsername) {
      window.addEventListener('click', onOutsideClick);
      window.addEventListener('keydown', onEnterPress);
    }
    return () => {
      window.removeEventListener('click', onOutsideClick);
      window.removeEventListener('keydown', onEnterPress);
    };
  }, [isEditingUsername, onUsernameChangeCallback, onUsernameInputBlur]);

  useEffect(() => {
    if (usernameInputRef.current && isEditingUsername) {
      usernameInputRef.current.focus();
    }
  }, [isEditingUsername]);

  return (
    <div
      className="flex"
      style={{ background: isCurrentUser ? '#4a505a' : '' }}
    >
      {onRecapClick && executedCommands.length > 0 && (
        <span onClick={() => onRecapClick(player)}>he</span>
      )}
      <div
        className="flex py-0 gap-4 items-center text-gray-2"
        style={{ width: '10%' }}
      >
        {renderUsername()}
      </div>

      <ProgressBar
        tasksCount={raceDocsCount + 1}
        currentTaskIndex={currentDocIndex}
        currentTaskCompleteness={completeness}
        className="pr-4"
        recapProps={recapProps}
      />
    </div>
  );
};
