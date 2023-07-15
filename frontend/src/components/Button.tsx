import { HTMLAttributes } from 'react';

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`p-1 text-xs text-text rounded-lg cursor-pointer transition duration-200 ease-in border border-text hover:border-primary ${className}`}
    >
      {children}
    </button>
  );
};
