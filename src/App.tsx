/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import CalculatorComponent from './components/Calculator';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import FeedbackForm from './components/FeedbackForm';
import Footer from './components/Footer';
import { Phone, CheckCircle, FileText, CalendarRange } from 'lucide-react';

export default function App() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [calculatorDetails, setCalculatorDetails] = useState<string | undefined>(undefined);

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
    <div id="app-root-container" className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* 1. Sticky Navigation Header */}
      <Header onOpenCallbackModal={handleOpenCallback} />

      {/* 2. Premium Hero Banner */}
      <Hero
        onOpenCallbackModal={handleOpenCallback}
        onScrollToCalculator={handleScrollToCalculator}
      />

      {/* 3. Steps / Process Timeline Section */}
      <section id="process-steps" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div id="step-1" className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-forest-100 text-forest-700 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                01
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Заявка и Оценка</h4>
                <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                  Оставляете заявку. Мы бесплатно рассчитываем стоимость по фотографии за 10 минут.
                </p>
              </div>
            </div>

            <div id="step-2" className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-forest-100 text-forest-700 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                02
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Выезд замерщика</h4>
                <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                  Наш эксперт выезжает на участок для оценки сложности и точного согласования сметы.
                </p>
              </div>
            </div>

            <div id="step-3" className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-forest-100 text-forest-700 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                03
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Договор и Гарантия</h4>
                <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                  Подписываем договор, в котором закрепляем окончательную цену и материальную безопасность.
                </p>
              </div>
            </div>

            <div id="step-4" className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-forest-100 text-forest-700 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                04
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Безопасный спил</h4>
                <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                  Выполняем спил, дробим ветки в щепу, пилим ствол на дрова и оставляем идеальный порядок.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Services Grid Catalog */}
      <Services onOpenCallbackModal={handleOpenCallback} />

      {/* 5. Interactive Pricing Calculator */}
      <CalculatorComponent onOpenCallbackModal={handleOpenCallback} />

      {/* 6. Before/After Work Portfolio Slider */}
      <Gallery />

      {/* 7. Client Reviews and Testimonials */}
      <Reviews />

      {/* 8. Frequently Asked Questions Accordion */}
      <FAQ />

      {/* 9. Floating Contact / Quick Consultation Banner */}
      <section id="floating-cta-banner" className="py-16 bg-forest-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 to-forest-800 opacity-90 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-display leading-tight">
            Нужно срочно спилить аварийное дерево?
          </h3>
          <p className="text-sm sm:text-base text-forest-100/80 font-light max-w-2xl mx-auto">
            Работаем без выходных и праздников. Приедем на объект со всем профессиональным снаряжением, оградим территорию и устраним угрозу падения дерева в кратчайшие сроки.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              id="cta-direct-phone"
              href="tel:+74951234567"
              className="px-8 py-4 bg-white text-forest-950 font-black text-sm rounded-2xl shadow-xl hover:bg-forest-50 transition-all font-mono flex items-center"
            >
              <Phone className="w-4 h-4 text-forest-600 mr-2" />
              +7 (495) 123-45-67
            </a>
            <button
              id="cta-modal-trigger"
              onClick={() => handleOpenCallback()}
              className="px-8 py-4 bg-forest-600 hover:bg-forest-500 border border-forest-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer"
            >
              Вызвать бригаду бесплатно
            </button>
          </div>
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
    </div>
  );
}

