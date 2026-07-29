/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
}

/**
 * The eyebrow + H2 + lead block was copy-pasted verbatim into Services,
 * Calculator, Gallery and Reviews. One component keeps the four sections in
 * step and gives them a staggered entrance for free.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  className = '',
  tone = 'light'
}: SectionHeadingProps) {
  const isDark = tone === 'dark';

  return (
    <div id={id} className={`text-center max-w-3xl mx-auto ${className}`}>
      <Reveal direction="none">
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            isDark ? 'text-forest-300 bg-forest-800/60' : 'text-forest-600 bg-forest-100'
          }`}
        >
          {eyebrow}
        </span>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-normal font-display mt-4 tracking-tight text-balance ${
            isDark ? 'text-white' : 'text-ink-900'
          }`}
        >
          {title}
        </h2>
      </Reveal>

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
}
