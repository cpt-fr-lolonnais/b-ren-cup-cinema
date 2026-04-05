import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  index?: number;
  className?: string;
}

export function StaggerItem({ children, delay = 0, index = 0, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay + index * 0.1, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideDown({ children, delay = 0, className = '' }: Omit<Props, 'index'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
