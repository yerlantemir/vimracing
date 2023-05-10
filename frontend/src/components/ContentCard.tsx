import { HTMLAttributes } from 'react';

export const ContentCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className="block p-8 rounded-xl"
      style={{
        background: 'var(--white-1)'
      }}
    >
      {children}
    </div>
  );
};
