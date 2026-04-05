import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  className?: string;
}

export default function CountUp({ value, duration = 0.8, className = '' }: Props) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, v => Math.round(v));
  const [text, setText] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsub = display.on('change', v => setText(String(v)));
    return unsub;
  }, [value, spring, display]);

  return <motion.span className={className}>{text}</motion.span>;
}
