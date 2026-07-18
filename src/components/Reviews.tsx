/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { REVIEWS } from '../data';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="reviews-header" className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full">
            Отзывы клиентов
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal font-display text-gray-900 mt-4 tracking-tight">
            Что говорят о нашей работе
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg font-light">
            Благодарности частных домовладельцев, дачников и председателей садовых товариществ Московской области.
          </p>
        </div>

        {/* Reviews Grid */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              id={`review-card-${review.id}`}
              className="flex flex-col bg-forest-50/20 border border-forest-100/50 rounded-3xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative"
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
              <p className="text-xs sm:text-sm text-gray-700 font-light leading-relaxed mb-6 flex-grow italic">
                "{review.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-3 pt-5 border-t border-forest-100/30 mt-auto">
                <div className="w-10 h-10 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{review.author}</h4>
                  <p className="text-[10px] text-gray-500 font-light mt-0.5">{review.role}</p>
                </div>
              </div>

              {/* Date & Thumbs Up */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4">
                <span>{review.date}</span>
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 text-forest-500 mr-1" />
                  Полезный отзыв
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate trust badges */}
        <div id="reviews-badges" className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <span className="block text-3xl font-extrabold font-display text-gray-900">5.0</span>
            <div className="flex items-center justify-center space-x-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="block text-xs text-gray-500 font-light">Средняя оценка на Яндекс.Картах</span>
          </div>

          <div className="text-center">
            <span className="block text-3xl font-extrabold font-display text-gray-900">3275</span>
            <span className="block text-xs text-gray-500 font-light mt-1.5">Успешно спиленных дерева</span>
          </div>

          <div className="text-center">
            <span className="block text-3xl font-extrabold font-display text-gray-900">100%</span>
            <span className="block text-xs text-gray-500 font-light mt-1.5">Довольных клиентов по договору</span>
          </div>
        </div>

      </div>
    </section>
  );
}
