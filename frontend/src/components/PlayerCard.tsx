'use client';

import { Player, RaceState } from '@vimracing/shared';
import { ProgressBar } from './pages/race/ProgressBar';
import { useCallback, useEffect, useRef, useState } from 'react';

type PlayerCardProps = {
  isCurrentUser: boolean;
  raceStatus?: RaceState;
  raceDocsCount: number;
  onUsernameChangeCallback?: (newUsername: string) => void;
  player: Player;
};

const USERNAME_MAX_LENGTH = 15;
export const PlayerCard: React.FC<PlayerCardProps> = ({
  isCurrentUser,
  player,
  raceDocsCount,
  raceStatus,
  onUsernameChangeCallback
}) => {
  const { username: initialUsername, raceData } = player;

  const [username, setUsername] = useState(initialUsername);
  const [isEditingUsername, setEditingUsername] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const onUsernameDblClick = () => {
    if (isCurrentUser && raceStatus === RaceState.WAITING) {
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

  useEffect(() => {
    const onOutsideClick = (e: any) => {
      if (
        usernameInputRef.current &&
        !usernameInputRef.current.contains(e.target)
      ) {
        onUsernameInputBlur();
      }
    };
    const onEnterPress = (e: any) => {
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
      />
    </div>
  );
};
