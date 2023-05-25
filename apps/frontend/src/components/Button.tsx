import { HTMLAttributes } from 'react';

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`py-2 text-gray bg-blue-1 px-4 rounded cursor-pointer transition duration-200 ease-in hover:bg-blue-3 ${className}`}
    >
      {children}
    </button>
  );
};
