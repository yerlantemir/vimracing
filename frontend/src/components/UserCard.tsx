'use client';

type UserCardProps = {
  username: string;
  onUsernameChangeCallback?: (newUsername: string) => void;
  completeness: number;
  isCurrentUser: boolean;
};

export const UserCard: React.FC<UserCardProps> = ({
  isCurrentUser,
  username,
  completeness
}) => {
  return (
    <div style={{ background: isCurrentUser ? '#4a505a' : '' }}>
      <div
        style={{
          width: '60%'
        }}
        className="flex py-0 gap-4 items-center text-gray-2"
      >
        <span className="opacity-80" style={{ width: '25%' }}>
          {username}
        </span>
        <span className="opacity-50">{completeness}%</span>
      </div>
    </div>
  );
};
