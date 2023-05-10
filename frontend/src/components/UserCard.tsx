'use client';

import Image from 'next/image';
import { useState } from 'react';

type UserCardProps = {
  username: string;
  onUsernameChangeCallback?: (newUsername: string) => void;
  place: number;
  completeness: number;
};

export const UserCard: React.FC<UserCardProps> = ({
  username: initialUsername,
  onUsernameChangeCallback,
  place,
  completeness
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [isEditingUsername, setEditingUsername] = useState(false);

  const isCurrentUser = true;

  const onUsernameDblClick = () => {
    if (isCurrentUser) {
      setEditingUsername(true);
    }
  };
  const onUsernameInputBlur = () => {
    onUsernameChangeCallback?.(username.replace('(you)', ''));
    setEditingUsername(false);
  };

  const onUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const renderUsername = () => {
    if (isEditingUsername) {
      return (
        <input
          type="text"
          value={username}
          onChange={onUsernameChange}
          onBlur={onUsernameInputBlur}
        />
      );
    }
    return (
      <span className="username" onDoubleClick={onUsernameDblClick}>
        {username}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: '50px',
        width: '20rem',
        border: '1px solid #f4eaea'
      }}
      className="flex justify-between items-center rounded-xl py-0 px-3 gap-3"
    >
      <div className="flex gap-3 items-center">
        <span className="text-xs font-bold text-white">{place}</span>
      </div>
      {renderUsername()}
      <span className="opacity-50">{completeness}</span>
    </div>
  );
};
