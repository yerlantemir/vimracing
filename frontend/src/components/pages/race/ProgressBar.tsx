import { Fragment, HTMLAttributes, useMemo } from 'react';

type TaskStatus = 'done' | 'doing' | 'todo';

const TRANSITION_DURATION = 1000;

const Circle = ({
  taskStatus,
  isFinished,
  isRecapView = false,
  isRecapSelected = false,
  onClick
}: {
  taskStatus: TaskStatus;
  isFinished: boolean;
  isRecapView?: boolean;
  isRecapSelected?: boolean;
  onClick: () => void;
}) => {
  const bgColor = useMemo(() => {
    if (isFinished) return 'bg-green-3';
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'doing') return 'bg-orange';
    return 'bg-gray-4';
  }, [isFinished, taskStatus]);

  const form = useMemo(() => {
    if (isRecapView) return 'h-4 w-4';
    return 'h-3 w-3';
  }, [isRecapView]);

  return (
    <div
      className={`${form} rounded-full transition ease-in-out ${bgColor} ${
        isRecapSelected && 'border-2 border-white-1'
      }`}
      onClick={onClick}
      style={{
        transitionDuration: `${TRANSITION_DURATION}ms`
      }}
    />
  );
};

export const Line = ({
  taskStatus,
  currentTaskCompleteness,
  isFinished
}: {
  taskStatus: TaskStatus;
  currentTaskCompleteness: number;
  isFinished: boolean;
}) => {
  const sharedContainerClasses = 'flex flex-grow transition ease-in-out';
  const containerBgClass = useMemo(() => {
    if (isFinished) return 'bg-green-3';
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'todo') return 'bg-gray-4';
    return '';
  }, [isFinished, taskStatus]);

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
  recapProps?: {
    currentRecapTaskIndex?: number;
    onTaskClick?: (taskIndex: number) => void;
  };
}

export const ProgressBar: React.FC<IProgressBarProps> = ({
  tasksCount,
  currentTaskIndex,
  currentTaskCompleteness,
  className,
  recapProps
}) => {
  const getTaskStatus = (taskIndex: number): TaskStatus => {
    if (currentTaskCompleteness === 100) return 'done';
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

  const isFinished = currentTaskIndex === tasksCount;
  const isRecapView = recapProps !== undefined;
  const currentRecapIndex = recapProps?.currentRecapTaskIndex;

  return (
    <div className={`flex items-center flex-grow ${className} z-10`}>
      {Array(tasksCount)
        .fill(0)
        .map((_, index) => {
          const taskStatus = getTaskStatus(index);
          return (
            <Fragment key={index}>
              <Circle
                taskStatus={taskStatus}
                isFinished={isFinished}
                isRecapView={isRecapView}
                isRecapSelected={currentRecapIndex === index}
                onClick={() => {
                  if (isRecapView) {
                    recapProps?.onTaskClick?.(index);
                  }
                }}
              />
              {index !== tasksCount - 1 && (
                <Line
                  taskStatus={taskStatus}
                  currentTaskCompleteness={getTaskCompleteness(taskStatus)}
                  isFinished={isFinished}
                />
              )}
            </Fragment>
          );
        })}
    </div>
  );
};
