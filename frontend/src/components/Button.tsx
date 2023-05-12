import { HTMLAttributes } from 'react';

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  style = {},
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`py-2 px-4 rounded cursor-pointer transition duration-200 ease-in ${className}`}
      style={{
        background: 'var(--blue-2)',
        color: 'var(--primary-text)',
        ...style
      }}
    >
      {children}
    </button>
  );
};
