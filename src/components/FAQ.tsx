/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQS, CONTACTS } from '../data';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-forest-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          id="faq-header"
          eyebrow="Частые вопросы"
          title="Отвечаем на популярные вопросы"
          subtitle="Все, что нужно знать о процессе спила деревьев, гарантиях сохранности имущества и ценообразовании."
          align="left"
          className="mb-12"
        />

        {/* Accordion List */}
        <div id="faq-list" className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <Reveal key={faq.id} delay={index * 0.06}>
                <div
                  id={`faq-item-${faq.id}`}
                  className={`bg-white border rounded-card transition-colors duration-300 overflow-hidden ${
                    isOpen ? 'border-forest-500 shadow-card-hover' : 'border-ink-200 hover:border-forest-200'
                  }`}
                >
                  {/* Question Trigger */}
                  <button
                    id={`faq-trigger-${faq.id}`}
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-panel-${faq.id}`}
                    className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start space-x-3">
                      <HelpCircle
                        className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${isOpen ? 'text-forest-600' : 'text-ink-400'}`}
                      />
                      <span className="text-sm sm:text-base font-bold text-ink-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`p-1 rounded-btn shrink-0 transition-colors ${
                        isOpen ? 'bg-forest-100 text-forest-700' : 'bg-ink-50 text-ink-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  {/* Answer Content Panel — real height animation instead of a
                      max-height guess, which used to clip and jerk long answers. */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-panel-${faq.id}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-5 border-t border-ink-100 text-xs sm:text-sm text-ink-600 font-light leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Still Have Questions Callout */}
        <Reveal delay={0.1}>
          <div
            id="faq-support"
            className="mt-12 bg-white rounded-card p-6 border border-ink-200 text-center space-y-4 shadow-card"
          >
            <p className="text-sm text-ink-700">
              Не нашли ответа на свой вопрос? Свяжитесь напрямую с нашим ведущим арбористом.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                id="faq-phone-cta"
                href={CONTACTS.phoneHref}
                className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-btn shadow-card transition-all hover:-translate-y-0.5"
              >
                Задать вопрос по телефону
              </a>
              <span className="text-ink-400 text-xs">или</span>
              <span className="text-xs font-bold text-ink-900 font-mono">{CONTACTS.phone}</span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
