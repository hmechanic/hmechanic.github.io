import type { ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReveal, type RevealDirection } from '@/hooks/useReveal';

type RevealProps = ComponentProps<typeof motion.div> & {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
};

/** Convenience wrapper: <Reveal>…</Reveal> applies the shared entrance. */
const Reveal = ({ children, delay = 0, direction = 'up', ...rest }: RevealProps) => {
  const reveal = useReveal(delay, direction);
  return (
    <motion.div {...reveal} {...rest}>
      {children}
    </motion.div>
  );
};

export default Reveal;
