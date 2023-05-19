import { HTMLAttributes, useMemo } from 'react';

type TaskStatus = 'done' | 'doing' | 'todo';

const TRANSITION_DURATION = 1000;

const Circle = ({ taskStatus }: { taskStatus: TaskStatus }) => {
  const bgColor = useMemo(() => {
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'doing') return 'bg-orange';
    return 'bg-gray-4';
  }, [taskStatus]);
  return (
    <div
      className={`h-3 w-3 rounded-full transition ease-in-out ${bgColor}`}
      style={{
        transitionDuration: `${TRANSITION_DURATION}ms`
      }}
    />
  );
};

export const Line = ({
  taskStatus,
  currentTaskCompleteness
}: {
  taskStatus: TaskStatus;
  currentTaskCompleteness: number;
}) => {
  const sharedContainerClasses = 'flex flex-grow transition ease-in-out';
  const containerBgClass = useMemo(() => {
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'todo') return 'bg-gray-4';
    return '';
  }, [taskStatus]);

  return (
    <div
      className={`${sharedContainerClasses} ${containerBgClass}`}
      style={{ height: 1, transitionDuration: `${TRANSITION_DURATION}ms` }}
    >
      <div
        className={sharedContainerClasses}
        style={{
          opacity: 1,
          ...(taskStatus !== 'doing' && { opacity: 0 }),
          transition: `opacity ${TRANSITION_DURATION}ms`
        }}
      >
        <div
          className="bg-orange flex-grow"
          style={{
            width: `${currentTaskCompleteness}%`,
            height: 1,
            transition: 'width 0.2s'
          }}
        />
        <div
          className="bg-gray-4 flex-grow "
          style={{
            width: `${100 - currentTaskCompleteness}%`,
            height: 1,
            transition: 'width 0.2s'
          }}
        />
      </div>
    </div>
  );
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
    if (currentTaskIndex === tasksCount - 1) return 'done';

    if (taskIndex === currentTaskIndex) return 'doing';
    if (taskIndex < currentTaskIndex) return 'done';
    return 'todo';
  };

  const getTaskCompleteness = (taskStatus: TaskStatus) => {
    if (taskStatus === 'done') return 100;
    if (taskStatus === 'doing') return currentTaskCompleteness;
    return 0;
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
                  currentTaskCompleteness={getTaskCompleteness(taskStatus)}
                />
              )}
            </>
          );
        })}
    </div>
  );
};
