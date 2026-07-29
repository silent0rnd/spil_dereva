/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 }
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay. For lists pass index * 0.07. */
  delay?: number;
  direction?: Direction;
  /** Fire every time the element enters the viewport instead of only once. */
  repeat?: boolean;
}

/**
 * Scroll-triggered entrance. Collapses to a plain div when the visitor asks for
 * reduced motion, so nothing ever hides behind an animation that will not run.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  repeat = false
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = OFFSETS[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
