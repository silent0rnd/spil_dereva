/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-forest-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="faq-header" className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full">
            Частые вопросы
          </span>
          <h2 className="text-3xl md:text-4xl font-normal font-display text-gray-900 mt-4 tracking-tight">
            Отвечаем на популярные вопросы
          </h2>
          <p className="text-gray-600 mt-4 text-sm md:text-base font-light">
            Все, что нужно знать о процессе спила деревьев, гарантиях сохранности имущества и ценообразовании.
          </p>
        </div>

        {/* Accordion List */}
        <div id="faq-list" className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-forest-500 shadow-md shadow-forest-900/5'
                    : 'border-gray-200/80 hover:border-forest-200'
                }`}
              >
                {/* Question Trigger */}
                <button
                  id={`faq-trigger-${faq.id}`}
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start space-x-3">
                    <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${isOpen ? 'text-forest-600' : 'text-gray-400'}`} />
                    <span className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <span className={`p-1 rounded-lg shrink-0 transition-all ${isOpen ? 'bg-forest-100 text-forest-700' : 'bg-gray-50 text-gray-400'}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Answer Content Panel */}
                <div
                  id={`faq-answer-panel-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 py-5 text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Callout */}
        <div id="faq-support" className="mt-12 bg-white rounded-2xl p-6 border border-gray-200/80 text-center space-y-4">
          <p className="text-sm text-gray-700">
            Не нашли ответа на свой вопрос? Свяжитесь напрямую с нашим ведущим арбористом.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              id="faq-phone-cta"
              href="tel:+74951234567"
              className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Задать вопрос по телефону
            </a>
            <span className="text-gray-400 text-xs">или</span>
            <span className="text-xs font-bold text-gray-900 font-mono">+7 (495) 123-45-67</span>
          </div>
        </div>

      </div>
    </section>
  );
}
