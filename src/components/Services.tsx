/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SERVICES } from '../data';
import { ArrowDownCircle, Layers, Scissors, Shrink, Trees, Check, ArrowRight } from 'lucide-react';

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
    <section id="services" className="py-20 md:py-28 bg-forest-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="services-header" className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full">
            Наши услуги
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal font-display text-gray-900 mt-4 tracking-tight">
            Решаем любые задачи с деревьями и участками
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg font-light">
            Профессиональные сертифицированные арбористы со снаряжением 1-го класса и европейским инструментом. 
            Работаем строго по регламентам безопасности.
          </p>
        </div>

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.iconName] || Trees;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:shadow-forest-900/5 hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Icon & Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-forest-100 text-forest-700 rounded-2xl group-hover:bg-forest-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Стоимость
                    </span>
                    <span className="text-lg font-bold font-mono text-forest-700">
                      от {service.priceFrom.toLocaleString('ru-RU')} ₽ <span className="text-xs font-light text-gray-500 font-sans">/ {service.unit}</span>
                    </span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold font-display text-gray-900 group-hover:text-forest-800 transition-colors mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Checklist */}
                <ul className="space-y-2.5 mb-8 border-t border-gray-50 pt-5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-700">
                      <Check className="w-4 h-4 text-forest-600 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action */}
                <button
                  id={`service-order-btn-${service.id}`}
                  onClick={() => onOpenCallbackModal(service.id)}
                  className="w-full py-3 px-4 bg-gray-50 group-hover:bg-forest-600 text-gray-700 group-hover:text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>Заказать спил</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div
          id="services-bottom-banner"
          className="mt-16 bg-gradient-to-r from-forest-800 to-forest-950 rounded-3xl p-8 lg:p-12 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-300 bg-forest-700/50 px-3 py-1 rounded-full">
                Бесплатный расчет по фото
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-display mt-3 leading-tight">
                Хотите узнать точную цену прямо сейчас?
              </h3>
              <p className="text-sm text-forest-100/80 font-light mt-2">
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
                className="px-6 py-3.5 bg-white text-forest-900 hover:bg-forest-50 font-bold text-sm rounded-xl text-center transition-all cursor-pointer"
              >
                Рассчитать в калькуляторе
              </button>
              <button
                id="banner-contact-btn"
                onClick={() => onOpenCallbackModal()}
                className="px-6 py-3.5 bg-forest-600 hover:bg-forest-500 border border-forest-500 text-white font-bold text-sm rounded-xl text-center transition-all cursor-pointer"
              >
                Оценить по фото
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
