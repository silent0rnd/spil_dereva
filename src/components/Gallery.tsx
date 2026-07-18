/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CASE_STUDIES } from '../data';
import { MapPin, Clock, CheckCircle, ExternalLink, Hammer, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const activeCase = CASE_STUDIES[activeIndex];

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    setImgIndex(0);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? activeCase.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === activeCase.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="gallery-header" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full">
            Наше портфолио
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal font-display text-gray-900 mt-4 tracking-tight">
            Посмотрите на наши результаты
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg font-light">
            Реальные примеры выполненных нами работ с подробным разбором задач, технологических этапов и примененного оборудования.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CASE_STUDIES.map((study, index) => (
            <button
              key={study.id}
              onClick={() => handleTabChange(index)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? 'bg-forest-600 text-white shadow-md shadow-forest-900/10 scale-102'
                  : 'bg-white border border-gray-100 text-gray-700 hover:border-forest-300 hover:bg-gray-50'
              }`}
            >
              {study.location}
            </button>
          ))}
        </div>

        {/* Active Case Details Card */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-100/40">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Case Image Container */}
            <div className="lg:col-span-6 relative h-64 sm:h-96 lg:h-auto min-h-[420px] overflow-hidden bg-gray-900 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeCase.id}-${imgIndex}`}
                  src={activeCase.images[imgIndex]}
                  alt={`${activeCase.title} - Фото ${imgIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Image Navigation Arrows */}
              {activeCase.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95 cursor-pointer"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95 cursor-pointer"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots / Indicator Overlay */}
              {activeCase.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  {activeCase.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImgIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        imgIndex === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Перейти к фото ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="bg-forest-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {activeCase.location}
                </span>
                <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {activeCase.duration}
                </span>
                {activeCase.images.length > 1 && (
                  <span className="bg-forest-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    Фото {imgIndex + 1} из {activeCase.images.length}
                  </span>
                )}
              </div>
            </div>

            {/* Case Info Description Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-forest-600 uppercase tracking-widest font-mono">
                  Выполненный проект
                </span>
                <h3 className="text-2xl md:text-3xl font-normal font-display text-gray-900 mt-2 leading-tight">
                  {activeCase.title}
                </h3>
                
                <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed mt-4">
                  {activeCase.description}
                </p>

                {/* Key Accomplished Steps */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Выполненные работы:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCase.tasks.map((task, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-700 leading-normal font-light">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Used */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5" /> Спецтехника и инструменты:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.equipment.map((item, i) => (
                      <span key={i} className="bg-gray-50 text-gray-600 text-[11px] px-2.5 py-1 rounded-lg border border-gray-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action and Old Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="#feedback"
                  className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Заказать аналогичный спил
                </a>
                
                <a
                  href={activeCase.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-forest-600 hover:text-forest-800 transition-colors font-semibold"
                >
                  <span>Посмотреть отчет на старом сайте</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
