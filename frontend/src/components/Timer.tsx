import { RaceTimerIcon } from './icons';

export const Timer = ({ time }: { time: number }) => {
  return (
    <div className="flex items-center gap-2">
      <RaceTimerIcon />
      <span className="text-sm">{time}</span>
    </div>
  );
};
