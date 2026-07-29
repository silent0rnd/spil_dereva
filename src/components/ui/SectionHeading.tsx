/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Reveal from './Reveal';

interface SectionHeadingProps {
  /** Small pill above the title, e.g. "Наши услуги". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
  /** Dark sections need the inverted palette. */
  tone?: 'light' | 'dark';
  /**
   * Six centred headings in a row was the biggest remaining source of the
   * templated feel, so sections alternate between centred and left.
   */
  align?: 'center' | 'left';
  /** Optional block pinned to the right of a left-aligned heading (md and up). */
  aside?: ReactNode;
}

/**
 * The eyebrow + H2 + lead block was copy-pasted verbatim into Services,
 * Calculator, Gallery and Reviews. One component keeps the sections in step and
 * gives them a staggered, word-by-word entrance for free.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  className = '',
  tone = 'light',
  align = 'center',
  aside
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = tone === 'dark';
  const isLeft = align === 'left';

  const titleClass = `text-3xl md:text-4xl lg:text-5xl font-normal font-display tracking-tight text-balance ${
    isDark ? 'text-white' : 'text-ink-900'
  }`;

  // Words rise individually — the same heading arriving as one block reads
  // noticeably cheaper.
  const words = title.split(' ');

  const heading = shouldReduceMotion ? (
    <h2 className={`${titleClass} mt-4`}>{title}</h2>
  ) : (
    <h2 className={`${titleClass} mt-4`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.06 + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && ' '}
        </span>
      ))}
    </h2>
  );

  const block = (
    <div className={isLeft ? 'max-w-2xl' : 'text-center max-w-3xl mx-auto'}>
      <Reveal direction="none">
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            isDark ? 'text-forest-300 bg-forest-800/60' : 'text-forest-600 bg-forest-100'
          }`}
        >
          {eyebrow}
        </span>
      </Reveal>

      {heading}

      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`mt-4 text-base md:text-lg font-light leading-relaxed text-pretty ${
              isDark ? 'text-forest-100/80' : 'text-ink-600'
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );

  if (!isLeft) {
    return (
      <div id={id} className={className}>
        {block}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end ${className}`}
    >
      <div className="md:col-span-7">{block}</div>
      {aside && <div className="md:col-span-4 md:col-start-9">{aside}</div>}
    </div>
  );
}
