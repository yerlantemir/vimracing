import { HTMLAttributes } from 'react';

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`py-2 text-gray bg-blue-2 px-4 rounded cursor-pointer transition duration-200 ease-in ${className}`}
    >
      {children}
    </button>
  );
};
