/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { REVIEWS } from '../data';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import CountUp from './ui/CountUp';

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          id="reviews-header"
          eyebrow="Отзывы клиентов"
          title="Что говорят о нашей работе"
          subtitle="Благодарности частных домовладельцев, дачников и председателей садовых товариществ Московской области."
          className="mb-16 md:mb-24"
        />

        {/* Reviews Grid */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.08} className="h-full">
              <div
                id={`review-card-${review.id}`}
                className="flex h-full flex-col bg-forest-50 border border-forest-100 rounded-panel p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Stars & Verification */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center text-[10px] font-bold text-forest-700 bg-forest-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Заказ выполнен
                    </span>
                  )}
                </div>

                {/* Text Quote */}
                <p className="text-xs sm:text-sm text-ink-700 font-light leading-relaxed mb-6 flex-grow italic">
                  «{review.text}»
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pt-5 border-t border-forest-200 mt-auto">
                  <div className="w-10 h-10 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink-900">{review.author}</h4>
                    <p className="text-[10px] text-ink-500 font-light mt-0.5">{review.role}</p>
                  </div>
                </div>

                {/* Date & Thumbs Up */}
                <div className="flex items-center justify-between text-[10px] text-ink-400 mt-4">
                  <span>{review.date}</span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-3 h-3 text-forest-500 mr-1" />
                    Полезный отзыв
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Aggregate trust badges */}
        <Reveal>
          <div
            id="reviews-badges"
            className="mt-16 pt-10 border-t border-ink-100 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            <div className="text-center">
              <span className="block text-3xl font-bold font-display text-ink-900 tabular-nums">
                <CountUp value={5} decimals={1} />
              </span>
              <div className="flex items-center justify-center space-x-0.5 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="block text-xs text-ink-500 font-light">Средняя оценка на Яндекс.Картах</span>
            </div>

            <div className="text-center">
              <span className="block text-3xl font-bold font-display text-ink-900 tabular-nums">
                <CountUp value={3275} />
              </span>
              <span className="block text-xs text-ink-500 font-light mt-1.5">Успешно спиленных дерева</span>
            </div>

            <div className="text-center">
              <span className="block text-3xl font-bold font-display text-ink-900 tabular-nums">
                <CountUp value={100} />%
              </span>
              <span className="block text-xs text-ink-500 font-light mt-1.5">Довольных клиентов по договору</span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
