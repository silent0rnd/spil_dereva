/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

/**
 * Cursor-driven micro-interactions. All of them are gated on a real pointer:
 * on touch these effects either never fire or fire once on tap and stick, and
 * they cost frames on exactly the devices that can least afford them.
 */
export function usePointerFine() {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFine(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setIsFine(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isFine;
}

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. Beyond ~5 it stops looking like a card and starts looking like a toy. */
  max?: number;
}

export function Tilt({ children, className, max = 4 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();
  const enabled = isFine && !shouldReduceMotion;

  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Pull in pixels. Small on purpose — this should be felt, not noticed. */
  strength?: number;
}

export function Magnetic({ children, className, strength = 5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();
  const enabled = isFine && !shouldReduceMotion;

  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} onPointerMove={handleMove} onPointerLeave={reset} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

interface SpotlightPanelProps {
  children: ReactNode;
  className?: string;
  /** rgb triplet for the light, e.g. "107 143 113". */
  glowRgb?: string;
}

/**
 * A soft light that follows the cursor across a dark panel. Owns its own
 * pointer handlers rather than reaching for a parent node, and renders no glow
 * at all without a fine pointer — so it never paints on phones.
 */
export function SpotlightPanel({
  children,
  className = '',
  glowRgb = '107 143 113'
}: SpotlightPanelProps) {
  const isFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();
  const enabled = isFine && !shouldReduceMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(useMotionValue(0), { stiffness: 140, damping: 24 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
    opacity.set(1);
  };

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      onPointerMove={enabled ? handleMove : undefined}
      onPointerLeave={enabled ? () => opacity.set(0) : undefined}
    >
      {enabled && (
        <motion.span
          aria-hidden="true"
          // A radial gradient rather than a blurred circle: re-running a 48px
          // blur filter on a moving element cost real frames (p95 50ms -> 33ms).
          className="pointer-events-none absolute -z-10 h-80 w-80 rounded-full"
          style={{
            x,
            y,
            opacity,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform',
            background: `radial-gradient(circle closest-side, rgb(${glowRgb} / 0.30), rgb(${glowRgb} / 0.12) 45%, transparent 100%)`
          }}
        />
      )}
      {children}
    </div>
  );
}
