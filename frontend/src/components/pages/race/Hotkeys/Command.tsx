import { ExecutedCommand } from '@vimracing/shared';
import { useAnimate, usePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ANIMATION_DURATION = 0.3;
const ArrowKeyIconMapping = {
  '<Down>': '↓',
  '<Up>': '↑',
  '<Left>': '←',
  '<Right>': '→'
};

export const Command: React.FC<ExecutedCommand> = ({
  isFailed,
  index,
  command,
  count
}) => {
  const [scope, animate] = useAnimate();
  const countElementRef = useRef<HTMLSpanElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [internalCommand, setInternalCommand] = useState(command);
  const [internalCount, setInternalCount] = useState(count);
  const [isPresent, safeToRemove] = usePresence();
  const isArrowKey = Object.keys(ArrowKeyIconMapping).includes(command);

  useEffect(() => {
    if (!isPresent) {
      animate(
        scope.current,
        {
          x: -48,
          opacity: 0
        },
        { duration: ANIMATION_DURATION }
      ).then(safeToRemove);
    }
    if (internalCommand !== command) {
      animate(
        scope.current,
        {
          scale: [1.5, 1],
          borderWidth: ['2px', '1px']
        },
        {
          duration: ANIMATION_DURATION
        }
      );
    }

    setInternalCommand(command);
  }, [animate, command, internalCommand, isPresent, safeToRemove, scope]);

  useEffect(() => {
    if (!mounted || !countElementRef.current) return;

    if (internalCount !== count) {
      animate(
        countElementRef.current,
        {
          scale: [1, 1.5, 1]
        },
        {
          times: [0.9, 1],
          duration: ANIMATION_DURATION
        }
      );
    }
    setInternalCount(count);
  }, [animate, count, internalCount, mounted, scope]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      animate(
        scope.current,
        {
          scale: [1.5, 1]
        },
        { duration: ANIMATION_DURATION }
      );
    }
  }, [animate, mounted, scope]);

  return (
    <div
      key={index}
      ref={scope}
      className={`py-2 px-3 text-sm text-text border border-text relative ${
        isArrowKey ? 'opacity-60' : ''
      }`}
    >
      <span>
        {isArrowKey
          ? ArrowKeyIconMapping[
              internalCommand as keyof typeof ArrowKeyIconMapping
            ]
          : internalCommand}
      </span>
      <span
        ref={countElementRef}
        key={count}
        className="absolute top-0 right-1 text-xs opacity-80"
      >
        {count}
      </span>
    </div>
  );
};
