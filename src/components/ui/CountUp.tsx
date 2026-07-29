/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface CountUpProps {
  value: number;
  /** Digits after the decimal separator. */
  decimals?: number;
  /** Group thousands with a space, ru-RU style. */
  group?: boolean;
  className?: string;
  /**
   * true  — count up from zero once the element scrolls into view (trust badges).
   * false — track `value` continuously, so the number rolls on every change
   *         instead of jumping (calculator price).
   */
  startOnView?: boolean;
}

export default function CountUp({
  value,
  decimals = 0,
  group = true,
  className,
  startOnView = true
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const format = (raw: number) =>
    raw.toLocaleString('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: group
    });

  const motionValue = useMotionValue(startOnView ? 0 : value);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (startOnView && !isInView) return;
    motionValue.set(value);
  }, [value, isInView, startOnView, motionValue]);

  useEffect(() => {
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    return spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spring, shouldReduceMotion, value, decimals, group]);

  return <span ref={ref} className={className}>{format(startOnView ? 0 : value)}</span>;
}
