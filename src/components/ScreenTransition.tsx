import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  screenKey: number;
  children: ReactNode;
}

export default function ScreenTransition({ screenKey, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.96 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-0 flex items-center justify-center z-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
