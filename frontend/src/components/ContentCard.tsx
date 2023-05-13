import { HTMLAttributes } from 'react';

export const ContentCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className="block p-8 rounded-xl bg-dark-2"
      style={{
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      {children}
    </div>
  );
};
