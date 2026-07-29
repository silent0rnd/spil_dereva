/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { getImage } from '../lib/images';
import { useMediaQuery } from '../lib/useMediaQuery';
import Reveal from './ui/Reveal';
import CountUp from './ui/CountUp';

/**
 * Full-bleed break in a page that is otherwise a stack of rounded cards, and
 * the home for the trust numbers — they used to sit at 30px in the footer of
 * the reviews section, which undersold the strongest proof on the page.
 *
 * The line of copy describes the Лужки case from CASE_STUDIES (берёза >80 см,
 * наклон в сторону жилого здания, 7 часов) — no invented claims.
 */

const photo = getImage('spil_luzhki_1784386222900');

const STATS = [
  { value: 5, decimals: 1, suffix: '', label: 'Средняя оценка на Яндекс.Картах' },
  { value: 3275, decimals: 0, suffix: '', label: 'Успешно спиленных дерева' },
  { value: 100, decimals: 0, suffix: '%', label: 'Довольных клиентов по договору' }
];

/**
 * A band on phones, a full-bleed backdrop from md up. Covering the whole section
 * on mobile meant upscaling a 389px-wide photo across 780px of height — blurry,
 * and needlessly expensive to composite.
 */
const PHOTO_CLASS = 'relative h-56 sm:h-72 md:absolute md:inset-0 md:h-full';

function PhotoContent() {
  return (
    <>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="100vw"
        width={photo.width}
        height={photo.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      {/* One darkening layer, not two: a second full-bleed overlay doubled the
          composited area for no visual gain. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgb(18 30 21) 0%, rgb(18 30 21 / 0.55) 55%, rgb(18 30 21 / 0.80) 100%)'
        }}
      />
    </>
  );
}

/**
 * Split out so that `useScroll` — which measures the target's box on every
 * scroll frame — is never even created on phones. Leaving the hook in the
 * parent and merely ignoring its output still cost half the mobile frame rate.
 */
function ParallaxPhoto({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <motion.div
      aria-hidden="true"
      className={`${PHOTO_CLASS} md:h-[116%] md:-top-[8%]`}
      style={{ y, willChange: 'transform' }}
    >
      <PhotoContent />
    </motion.div>
  );
}

function StaticPhoto() {
  return (
    <div aria-hidden="true" className={PHOTO_CLASS}>
      <PhotoContent />
    </div>
  );
}

export default function ProofBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 768px)');
  const parallax = isWide && !shouldReduceMotion;

  return (
    <section
      ref={sectionRef}
      id="proof-band"
      className="on-dark relative overflow-hidden bg-forest-950"
    >
      {parallax ? <ParallaxPhoto target={sectionRef} /> : <StaticPhoto />}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-32 lg:px-8">
        <Reveal>
          <p className="max-w-3xl font-display text-2xl leading-snug text-white text-balance sm:text-3xl lg:text-4xl">
            Берёза восемьдесят сантиметров, наклон на жилой дом.
            <span className="text-forest-300"> Семь часов работы — и ни одной царапины на кровле.</span>
          </p>
        </Reveal>

        <dl className="mt-14 grid grid-cols-1 gap-10 border-t border-white/15 pt-12 sm:grid-cols-3 md:mt-20">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <div>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-5xl text-white tabular-nums md:text-6xl lg:text-7xl">
                    <CountUp value={stat.value} decimals={stat.decimals} />
                    {stat.suffix}
                  </span>
                  <span className="mt-3 block max-w-[16rem] text-sm font-light text-forest-100/70">
                    {stat.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
