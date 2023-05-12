'use client';

type UserCardProps = {
  username: string;
  onUsernameChangeCallback?: (newUsername: string) => void;
  place: number;
  completeness: number;
  isCurrentUser: boolean;
};

export const UserCard: React.FC<UserCardProps> = ({
  isCurrentUser,
  username,
  place,
  completeness
}) => {
  return (
    <div style={{ background: isCurrentUser ? '#4a505a' : '' }}>
      <div
        style={{
          width: '40%',
          color: 'var(--primary-text-2)'
        }}
        className="flex py-0 gap-4 items-center"
      >
        <span className="text-xs font-bold text-white">{place}</span>
        <span className="opacity-80" style={{ width: '25%' }}>
          {username}
        </span>
        <span className="opacity-50">{completeness}</span>
      </div>
    </div>
  );
};
