interface ILoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean;
}

export const Loading = ({ loading, children, ...rest }: ILoadingProps) => {
  if (!children) return null;
  if (!loading) return <>{children}</>;

  return (
    <div className="opacity-70 pointer-events-none" {...rest}>
      {children}
    </div>
  );
};
