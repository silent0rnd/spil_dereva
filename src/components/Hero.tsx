/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ShieldCheck, CalendarCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { getImage, IMAGES } from '../lib/images';
import { Magnetic, usePointerFine } from './ui/pointer';

interface HeroProps {
  onOpenCallbackModal: (serviceId?: string) => void;
  onScrollToCalculator: () => void;
}

const heroImage = getImage(IMAGES.hero);

const BULLETS = [
  {
    icon: CalendarCheck,
    title: 'Выезд за 2 часа',
    text: 'Бесплатный выезд оценщика в день обращения'
  },
  {
    icon: ShieldCheck,
    title: 'Договор и Гарантия',
    text: 'Официальная материальная ответственность перед вами'
  },
  {
    icon: HelpCircle,
    title: 'Собственная техника',
    text: 'Свои автовышки, измельчители веток и контейнеры'
  }
];

export default function Hero({ onOpenCallbackModal, onScrollToCalculator }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isFinePointer = usePointerFine();
  const isPointerInteractive = isFinePointer && !shouldReduceMotion;

  const backgroundX = useSpring(useMotionValue(0), { stiffness: 34, damping: 22, mass: 0.8 });
  const lightX = useSpring(useMotionValue(0), { stiffness: 28, damping: 22, mass: 0.9 });
  const lightY = useSpring(useMotionValue(0), { stiffness: 28, damping: 22, mass: 0.9 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const item = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } }
      };

  const bulletsContainer = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } };

  const bulletItem = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } }
      };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isPointerInteractive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

    backgroundX.set(pointerX * 10);
    lightX.set(pointerX * 20);
    lightY.set(pointerY * 14);
  };

  const resetPointerDepth = () => {
    backgroundX.set(0);
    lightX.set(0);
    lightY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="on-dark relative pt-28 md:pt-36 pb-20 md:pb-28 lg:pb-36 bg-forest-950 overflow-hidden"
      onPointerMove={isPointerInteractive ? handlePointerMove : undefined}
      onPointerLeave={isPointerInteractive ? resetPointerDepth : undefined}
    >
      {/* Background Image with optimized dark overlay gradient */}
      <motion.div className="absolute inset-0 z-0" style={shouldReduceMotion ? undefined : { y: backgroundY }}>
        <motion.div className="absolute inset-0" style={isPointerInteractive ? { x: backgroundX } : undefined}>
          <img
            id="hero-bg-image"
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes="100vw"
            width={heroImage.width}
            height={heroImage.height}
            alt="Арборист спиливает ветви сосны на высоте"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center opacity-40 animate-ken-burns"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent z-10" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="hero-canopy-light pointer-events-none absolute inset-0 z-[11]"
        style={isPointerInteractive ? { x: lightX, y: lightY } : undefined}
      />

      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          {/* Main Headline */}
          <motion.h1
            id="hero-main-title"
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl font-normal font-display text-white tracking-tight leading-tight mb-6 text-balance"
          >
            Профессиональный <br className="hidden sm:inline" />
            <span className="italic text-forest-300">спил деревьев</span> любой сложности
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            id="hero-subtitle"
            variants={item}
            className="text-lg sm:text-xl text-forest-100/90 font-light leading-relaxed mb-10 max-w-2xl text-pretty"
          >
            Удаляем опасные, аварийные и мешающие деревья в Москве и Московской области.
            Аккуратная работа по частям над заборами, ЛЭП и крышами домов со 100% гарантией безопасности.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            id="hero-actions"
            variants={item}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <Magnetic strength={6}>
              <button
                id="hero-to-calculator-btn"
                onClick={onScrollToCalculator}
                className="w-full px-8 py-4 bg-forest-600 hover:bg-forest-700 text-white text-base font-bold rounded-btn transition-colors shadow-panel active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Рассчитать стоимость</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Magnetic>
            <Magnetic strength={6}>
              <button
                id="hero-callback-btn"
                onClick={() => onOpenCallbackModal()}
                className="w-full px-8 py-4 bg-forest-900/60 md:bg-white/10 md:hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-base font-semibold rounded-btn transition-colors md:backdrop-blur-sm active:scale-95 flex items-center justify-center cursor-pointer"
              >
                Консультация специалиста
              </button>
            </Magnetic>
          </motion.div>

          {/* Bullet Points Grid */}
          <motion.div
            id="hero-trust-bullets"
            variants={bulletsContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10"
          >
            {BULLETS.map((bullet) => {
              const Icon = bullet.icon;
              return (
                <motion.div key={bullet.title} variants={bulletItem} className="flex items-start space-x-3">
                  <div className="p-1 bg-forest-500/20 text-forest-400 rounded-btn mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{bullet.title}</h4>
                    <p className="text-xs text-forest-100/60 mt-1">{bullet.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
