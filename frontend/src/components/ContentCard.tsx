import { HTMLAttributes } from 'react';

export const ContentCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={`bg-dark-2 p-4 rounded-md ${className}`}
      style={{
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      {children}
    </div>
  );
};
