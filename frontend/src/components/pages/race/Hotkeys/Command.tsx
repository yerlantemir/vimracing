import { motion } from 'framer-motion';

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
};

export const Command: React.FC<ExecutedCommand> = ({ command, count }) => {
  const isArrowKey = Object.keys(ArrowKeyIconMapping).includes(command);
  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 1.5
    },
    visible: {
      opacity: 1,
      scale: 1
    }
  };
  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={`py-2 px-3 bg-gray-5 text-gray border relative ${
        isArrowKey ? 'border-red-1' : 'border-blue-2'
      }`}
    >
      {isArrowKey ? (
        <span>
          {ArrowKeyIconMapping[command as keyof typeof ArrowKeyIconMapping]}
        </span>
      ) : (
        <span>{command}</span>
      )}
      <span className="absolute top-0 right-1 text-xs opacity-80">{count}</span>
    </motion.div>
  );
};
