/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import CalculatorComponent from './components/Calculator';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import FeedbackForm from './components/FeedbackForm';
import Footer from './components/Footer';
import ScrollTree from './components/ScrollTree';
import ProofBand from './components/ProofBand';
import MobileCallBar from './components/MobileCallBar';
import Reveal from './components/ui/Reveal';
import { CONTACTS } from './data';
import { Phone } from 'lucide-react';

const STEPS = [
  {
    id: 'step-1',
    number: '01',
    title: 'Заявка и Оценка',
    text: 'Оставляете заявку. Мы бесплатно рассчитываем стоимость по фотографии за 10 минут.'
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Выезд замерщика',
    text: 'Наш эксперт выезжает на участок для оценки сложности и точного согласования сметы.'
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Договор и Гарантия',
    text: 'Подписываем договор, в котором закрепляем окончательную цену и материальную безопасность.'
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Безопасный спил',
    text: 'Выполняем спил, дробим ветки в щепу, пилим ствол на дрова и оставляем идеальный порядок.'
  }
];

export default function App() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [calculatorDetails, setCalculatorDetails] = useState<string | undefined>(undefined);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenCallback = (serviceId?: string, calcDetails?: string) => {
    setSelectedServiceId(serviceId);
    setCalculatorDetails(calcDetails);
    setIsCallbackOpen(true);
  };

  const handleScrollToCalculator = () => {
    const calcElement = document.getElementById('calculator');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-white text-ink-900 font-sans antialiased">
      {/* 1. Sticky Navigation Header */}
      <Header onOpenCallbackModal={handleOpenCallback} />

      {/* Scroll-linked felling animation in the right-hand margin (xl and up) */}
      <ScrollTree />

      {/* 2. Premium Hero Banner */}
      <Hero
        onOpenCallbackModal={handleOpenCallback}
        onScrollToCalculator={handleScrollToCalculator}
      />

      {/* 3. Steps / Process Timeline Section */}
      <section id="process-steps" className="py-20 md:py-28 bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal key={step.id} delay={index * 0.1}>
                <div id={step.id}>
                  {/* Oversized numeral instead of the old beige circle: this is
                      the first block after the hero and it used to read as filler. */}
                  <span className="block font-display text-6xl leading-none text-forest-200 tabular-nums">
                    {step.number}
                  </span>

                  <motion.span
                    aria-hidden="true"
                    className="mt-5 mb-5 block h-px origin-left bg-forest-300"
                    initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                    whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <h4 className="text-base font-bold font-display text-ink-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-ink-500 font-light leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services Grid Catalog */}
      <Services onOpenCallbackModal={handleOpenCallback} />

      {/* 5. Interactive Pricing Calculator */}
      <CalculatorComponent onOpenCallbackModal={handleOpenCallback} />

      {/* 6. Work Portfolio */}
      <Gallery onOpenCallbackModal={handleOpenCallback} />

      {/* 7. Client Reviews and Testimonials */}
      <Reviews />

      {/* 8. Full-bleed proof band — breaks the stack of cards and carries the
             aggregate numbers at a scale that actually registers. */}
      <ProofBand />

      {/* 9. Frequently Asked Questions Accordion */}
      <FAQ />

      {/* 9. Floating Contact / Quick Consultation Banner */}
      <section
        id="floating-cta-banner"
        className="on-dark py-20 md:py-24 bg-forest-950 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 to-forest-800 opacity-90 z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-forest-600/10 rounded-full blur-3xl z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Reveal>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-display leading-tight text-balance">
              Нужно срочно спилить аварийное дерево?
            </h3>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm sm:text-base text-forest-100/80 font-light max-w-2xl mx-auto text-pretty">
              Работаем без выходных и праздников. Приедем на объект со всем профессиональным снаряжением, оградим территорию и устраним угрозу падения дерева в кратчайшие сроки.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                id="cta-direct-phone"
                href={CONTACTS.phoneHref}
                className="px-8 py-4 bg-white text-forest-950 font-bold text-sm rounded-btn shadow-panel hover:bg-forest-50 transition-all hover:-translate-y-0.5 font-mono flex items-center"
              >
                <Phone className="w-4 h-4 text-forest-600 mr-2" />
                {CONTACTS.phone}
              </a>
              <button
                id="cta-modal-trigger"
                onClick={() => handleOpenCallback()}
                className="px-8 py-4 bg-forest-600 hover:bg-forest-500 border border-forest-500 text-white font-bold text-sm rounded-btn transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Вызвать бригаду бесплатно
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. Footer */}
      <Footer />

      {/* 11. Persistent Dialog Modal Form */}
      <FeedbackForm
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        preselectedServiceId={selectedServiceId}
        calculatorDetails={calculatorDetails}
      />

      {/* 12. Sticky mobile call bar */}
      <MobileCallBar onOpenCallbackModal={handleOpenCallback} />
    </div>
  );
}
