/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SERVICES } from '../data';
import { ArrowDownCircle, Layers, Scissors, Shrink, Trees, Check, ArrowRight } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';

interface ServicesProps {
  onOpenCallbackModal: (serviceId?: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  ArrowDownCircle,
  Layers,
  Scissors,
  Shrink,
  Trees
};

export default function Services({ onOpenCallbackModal }: ServicesProps) {
  return (
    <section id="services" className="py-20 md:py-28 bg-forest-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          id="services-header"
          eyebrow="Наши услуги"
          title="Решаем любые задачи с деревьями и участками"
          subtitle="Профессиональные сертифицированные арбористы со снаряжением 1-го класса и европейским инструментом. Работаем строго по регламентам безопасности."
          className="mb-16 md:mb-24"
        />

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Trees;
            return (
              <Reveal key={service.id} delay={(index % 3) * 0.08} className="h-full">
                <div
                  id={`service-card-${service.id}`}
                  className="group relative flex h-full flex-col bg-white border border-ink-100 rounded-panel p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Icon & Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-forest-100 text-forest-700 rounded-card transition-all duration-300 group-hover:bg-forest-600 group-hover:text-white group-hover:-rotate-6">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-semibold text-ink-400 uppercase tracking-wider">
                        Стоимость
                      </span>
                      <span className="text-lg font-bold font-mono text-forest-700">
                        от {service.priceFrom.toLocaleString('ru-RU')} ₽{' '}
                        <span className="text-xs font-light text-ink-500 font-sans">/ {service.unit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold font-display text-ink-900 group-hover:text-forest-800 transition-colors mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-ink-600 font-light leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Checklist */}
                  <ul className="space-y-2.5 mb-8 border-t border-ink-100 pt-5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-ink-700">
                        <Check className="w-4 h-4 text-forest-600 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action */}
                  <button
                    id={`service-order-btn-${service.id}`}
                    onClick={() => onOpenCallbackModal(service.id)}
                    className="mt-auto w-full py-3 px-4 bg-ink-50 group-hover:bg-forest-600 text-ink-700 group-hover:text-white font-bold text-xs rounded-btn tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    <span>Заказать спил</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <Reveal>
          <div
            id="services-bottom-banner"
            className="on-dark mt-16 bg-gradient-to-r from-forest-800 to-forest-950 rounded-panel p-8 lg:p-12 text-white shadow-panel relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest-300 bg-forest-700/50 px-3 py-1 rounded-full">
                  Бесплатный расчет по фото
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-display mt-3 leading-tight text-balance">
                  Хотите узнать точную цену прямо сейчас?
                </h3>
                <p className="text-sm text-forest-100/80 font-light mt-2 text-pretty">
                  Просто пришлите фото дерева или участка в Telegram или WhatsApp, либо прикрепите к нашей форме — наш технолог ответит вам в течение 10 минут с детальным расчетом сметы.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0 w-full md:w-auto">
                <button
                  id="banner-calculate-btn"
                  onClick={() => {
                    const element = document.getElementById('calculator');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white text-forest-900 hover:bg-forest-50 font-bold text-sm rounded-btn text-center transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Рассчитать в калькуляторе
                </button>
                <button
                  id="banner-contact-btn"
                  onClick={() => onOpenCallbackModal()}
                  className="px-6 py-3.5 bg-forest-600 hover:bg-forest-500 border border-forest-500 text-white font-bold text-sm rounded-btn text-center transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Оценить по фото
                </button>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
