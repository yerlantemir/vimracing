import { HTMLAttributes } from 'react';

export const ContentCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div {...rest} className={`bg-transparent rounded-md ${className}`}>
      {children}
    </div>
  );
};
