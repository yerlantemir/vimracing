import { motion } from 'framer-motion';

const ANIMATION_DURATION = 0.3;
const ArrowKeyIconMapping = {
  '<Down>': '↓',
  '<Up>': '↑',
  '<Left>': '←',
  '<Right>': '→'
};

export type ExecutedCommand = {
  isFailed: boolean;
  command: string;
  count?: number;
  isArrowKey?: boolean;
  index: number;
};

export const Command: React.FC<ExecutedCommand> = ({
  index,
  command,
  count
}) => {
  const isArrowKey = Object.keys(ArrowKeyIconMapping).includes(command);

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 1.5
    },
    visible: {
      opacity: 1,
      scale: 1
    },
    exit: {
      x: -48,
      opacity: 0
    }
  };

  return (
    <motion.div
      key={index}
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: ANIMATION_DURATION }}
      className={`py-2 px-3 bg-gray-5 text-gray border relative ${
        isArrowKey ? 'border-red-1' : 'border-blue-2'
      }`}
    >
      <span>
        {isArrowKey
          ? ArrowKeyIconMapping[command as keyof typeof ArrowKeyIconMapping]
          : command}
      </span>
      <motion.span
        key={count}
        className="absolute top-0 right-1 text-xs opacity-80"
        animate={
          count !== 1 && {
            scale: [1, 1.5, 1],
            color: ['#E67E22', '#abb2bf']
          }
        }
        transition={{
          times: [0.9, 1],
          duration: ANIMATION_DURATION
        }}
      >
        {count}
      </motion.span>
    </motion.div>
  );
};
