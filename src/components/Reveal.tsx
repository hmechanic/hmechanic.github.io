import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// A soft, refined easing curve (ease-out-quint-ish) shared across section reveals
// so every entrance in the site feels like one coherent motion language.
const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = 'up' | 'left' | 'right' | 'none';

const offsetFor = (direction: Direction) => {
  switch (direction) {
    case 'left':
      return { x: -24, y: 0 };
    case 'right':
      return { x: 24, y: 0 };
    case 'none':
      return { x: 0, y: 0 };
    default:
      return { x: 0, y: 24 };
  }
};

/**
 * Returns framer-motion props for a subtle, artistic-but-restrained reveal:
 * a gentle rise + fade + de-blur as the element scrolls into view. Honors
 * `prefers-reduced-motion` by collapsing to a plain, instant appearance.
 */
export const useReveal = (delay = 0, direction: Direction = 'up') => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: 0.3 },
    } as const;
  }

  const { x, y } = offsetFor(direction);
  return {
    initial: { opacity: 0, x, y, filter: 'blur(6px)' },
    whileInView: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: EASE, delay },
  };
};

type RevealProps = ComponentProps<typeof motion.div> & {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
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
