import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './progressBar.css';

type TaskStatus = 'done' | 'doing' | 'todo';

const Circle = ({ taskStatus }: { taskStatus: TaskStatus }) => {
  const bgColor = useMemo(() => {
    if (taskStatus === 'done') return 'bg-green-2';
    if (taskStatus === 'doing') return 'bg-orange';
    return 'bg-gray-4';
  }, [taskStatus]);
  return <div className={`h-3 w-3 rounded-full ${bgColor}`} />;
};

export const Line = ({
  taskStatus,
  currentTaskCompleteness
}: {
  taskStatus: TaskStatus;
  currentTaskCompleteness: number;
}) => {
  const ANIMATION_TIMEOUT = 300;
  const [hasRendered, setHasRendered] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  return (
    <TransitionGroup className="flex flex-grow">
      {taskStatus === 'doing' && (
        <CSSTransition
          key="doing"
          timeout={ANIMATION_TIMEOUT}
          classNames={hasRendered ? 'line' : ''}
          nodeRef={nodeRef}
        >
          <div className="flex flex-grow" ref={nodeRef}>
            <div
              className="bg-orange flex-grow "
              style={{
                width: `${currentTaskCompleteness}%`,
                height: 4
              }}
            ></div>
            <div
              className="bg-gray-4 flex-grow "
              style={{
                width: `${100 - currentTaskCompleteness}%`,
                height: 4
              }}
            ></div>
          </div>
        </CSSTransition>
      )}
      {taskStatus === 'done' && (
        <CSSTransition
          key="done"
          timeout={ANIMATION_TIMEOUT}
          classNames={hasRendered ? 'line' : ''}
          nodeRef={nodeRef}
        >
          <div
            className="bg-green-2 flex-grow"
            style={{ height: 4 }}
            ref={nodeRef}
          />
        </CSSTransition>
      )}
      {taskStatus === 'todo' && (
        <CSSTransition
          key="todo"
          timeout={ANIMATION_TIMEOUT}
          classNames={hasRendered ? 'line' : ''}
          nodeRef={nodeRef}
        >
          <div
            style={{ height: 4 }}
            className="bg-gray-4 flex-grow"
            ref={nodeRef}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

interface IProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  tasksCount: number;
  currentTaskIndex: number;
  currentTaskCompleteness: number;
}

export const ProgressBar: React.FC<IProgressBarProps> = ({ className }) => {
  const [currentTaskCompleteness, setCurrentTaskCompleteness] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const tasksCount = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaskCompleteness((prev) => {
        console.log(prev);

        if (prev >= 100) {
          setCurrentTaskIndex((p) => p + 1);
          return 0;
        }
        return prev + 60;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTaskCompleteness]);

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
