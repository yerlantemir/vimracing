import { Tooltip as ReactTooltip } from 'react-tooltip';

type ITooltipProps = {
  text: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<ITooltipProps> = ({ children, text }) => {
  return (
    <>
      <span
        data-tooltip-id={text}
        data-tooltip-content={text}
        className="w-fit h-fit cursor-pointer"
      >
        {children}
      </span>
      <ReactTooltip
        id={text}
        className="tooltip"
        style={{
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-text)'
        }}
      />
    </>
  );
};
