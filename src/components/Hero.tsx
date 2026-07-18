/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, CalendarCheck, HelpCircle, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenCallbackModal: (serviceId?: string) => void;
  onScrollToCalculator: () => void;
}

export default function Hero({ onOpenCallbackModal, onScrollToCalculator }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative pt-24 md:pt-32 pb-20 md:pb-28 lg:pb-36 bg-gray-900 overflow-hidden"
    >
      {/* Background Image with optimized dark overlay gradient */}
      <div className="absolute inset-0 z-0">
        <img
          id="hero-bg-image"
          src="/src/assets/images/arborist_hero_bg_1784384176446.jpg"
          alt="Арбористы за работой"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Top Trust Badge */}
          <div
            id="hero-trust-badge"
            className="inline-flex items-center space-x-2 bg-forest-500/10 border border-forest-500/30 text-forest-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-forest-400" />
            <span>Полная материальная ответственность по договору</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-main-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-normal font-display text-white tracking-tight leading-tight mb-6"
          >
            Профессиональный <br className="hidden sm:inline" />
            <span className="italic text-forest-300">спил деревьев</span> любой сложности
          </h1>

          {/* Subtitle */}
          <p
            id="hero-subtitle"
            className="text-lg sm:text-xl text-forest-100/90 font-light leading-relaxed mb-10 max-w-2xl"
          >
            Удаляем опасные, аварийные и мешающие деревья в Москве и Московской области. 
            Аккуратная работа по частям над заборами, ЛЭП и крышами домов со 100% гарантией безопасности.
          </p>

          {/* CTA Buttons */}
          <div id="hero-actions" className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button
              id="hero-to-calculator-btn"
              onClick={onScrollToCalculator}
              className="px-8 py-4 bg-forest-600 hover:bg-forest-700 text-white text-base font-bold rounded-2xl transition-all shadow-lg hover:shadow-forest-700/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Рассчитать стоимость</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-callback-btn"
              onClick={() => onOpenCallbackModal()}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-base font-semibold rounded-2xl transition-all backdrop-blur-sm active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Консультация специалиста
            </button>
          </div>

          {/* Bullet Points Grid */}
          <div id="hero-trust-bullets" className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-forest-500/20 text-forest-400 rounded-lg mt-0.5">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Выезд за 2 часа</h4>
                <p className="text-xs text-gray-400 mt-1">Бесплатный выезд оценщика в день обращения</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 bg-forest-500/20 text-forest-400 rounded-lg mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Договор и Гарантия</h4>
                <p className="text-xs text-gray-400 mt-1">Официальная материальная ответственность перед вами</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 bg-forest-500/20 text-forest-400 rounded-lg mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Собственная техника</h4>
                <p className="text-xs text-gray-400 mt-1">Свои автовышки, измельчители веток и контейнеры</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
