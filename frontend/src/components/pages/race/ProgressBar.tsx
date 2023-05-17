import { HTMLAttributes, useMemo } from 'react';

type TaskStatus = 'done' | 'doing' | 'todo';

const Circle = ({ taskStatus }: { taskStatus: TaskStatus }) => {
  const bgColor = useMemo(() => {
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'doing') return 'bg-orange';
    return 'bg-gray-4';
  }, [taskStatus]);
  return <div className={`h-4 w-4 rounded-full ${bgColor}`} />;
};

const Line = ({
  taskStatus,
  currentTaskCompleteness
}: {
  taskStatus: TaskStatus;
  currentTaskCompleteness: number;
}) => {
  if (taskStatus === 'done')
    return <div className="bg-green-2 flex-grow" style={{ height: 1 }} />;
  if (taskStatus === 'doing')
    return (
      <div className="flex flex-grow">
        <div
          className="bg-orange flex-grow"
          style={{ width: `${currentTaskCompleteness}%`, height: 1 }}
        ></div>
        <div
          className="bg-gray-4 flex-grow"
          style={{ width: `${100 - currentTaskCompleteness}%`, height: 1 }}
        ></div>
      </div>
    );
  return <div style={{ height: 1 }} className="bg-gray-4 flex-grow" />;
};

interface IProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  tasksCount: number;
  currentTaskIndex: number;
  currentTaskCompleteness: number;
}

export const ProgressBar: React.FC<IProgressBarProps> = ({
  tasksCount,
  currentTaskIndex,
  currentTaskCompleteness,
  className
}) => {
  const getTaskStatus = (taskIndex: number): TaskStatus => {
    if (taskIndex === currentTaskIndex) return 'doing';
    if (taskIndex < currentTaskIndex) return 'done';
    return 'todo';
  };
  return (
    <div className={`flex items-center flex-grow ${className}`}>
      {Array(tasksCount)
        .fill(0)
        .map((_, index) => {
          const taskStatus = getTaskStatus(index);
          return (
            <>
              <Circle taskStatus={taskStatus} />
              {index !== tasksCount - 1 && (
                <Line
                  taskStatus={taskStatus}
                  currentTaskCompleteness={currentTaskCompleteness}
                />
              )}
            </>
          );
        })}
    </div>
  );
};
