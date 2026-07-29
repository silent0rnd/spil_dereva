/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CASE_STUDIES } from '../data';
import { getImage } from '../lib/images';
import { MapPin, Clock, CheckCircle, ExternalLink, Hammer, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';

interface GalleryProps {
  onOpenCallbackModal: (serviceId?: string) => void;
}

export default function Gallery({ onOpenCallbackModal }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const activeCase = CASE_STUDIES[activeIndex];
  const activeImage = getImage(activeCase.images[imgIndex]);

  const handleTabChange = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setImgIndex(0);
  };

  const goPrev = () => {
    setDirection(-1);
    setImgIndex((prev) => (prev === 0 ? activeCase.images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setDirection(1);
    setImgIndex((prev) => (prev === activeCase.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    goPrev();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    goNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeCase.images.length < 2) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const slideOffset = shouldReduceMotion ? 0 : 40;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-forest-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          id="gallery-header"
          eyebrow="Наше портфолио"
          title="Посмотрите на наши результаты"
          subtitle="Реальные примеры выполненных нами работ с подробным разбором задач, технологических этапов и примененного оборудования."
          className="mb-16"
        />

        {/* Tab Selection */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CASE_STUDIES.map((study, index) => (
              <button
                key={study.id}
                onClick={() => handleTabChange(index)}
                aria-pressed={activeIndex === index}
                className={`px-5 py-3 rounded-btn text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? 'bg-forest-600 text-white shadow-card-hover'
                    : 'bg-white border border-ink-100 text-ink-700 hover:border-forest-300 hover:-translate-y-0.5'
                }`}
              >
                {study.location}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Active Case Details Card */}
        <Reveal delay={0.1}>
          <div className="bg-white border border-ink-100 rounded-panel overflow-hidden shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* Case Image Container */}
              <div
                className="lg:col-span-6 relative h-64 sm:h-96 lg:h-auto min-h-[420px] overflow-hidden bg-forest-950 group"
                tabIndex={0}
                role="group"
                aria-roledescription="карусель"
                aria-label={`Фотографии проекта: ${activeCase.title}. Листайте стрелками влево и вправо.`}
                onKeyDown={handleKeyDown}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={`${activeCase.id}-${imgIndex}`}
                    src={activeImage.src}
                    srcSet={activeImage.srcSet}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    width={activeImage.width}
                    height={activeImage.height}
                    loading="lazy"
                    decoding="async"
                    alt={`${activeCase.title} — фото ${imgIndex + 1} из ${activeCase.images.length}`}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * slideOffset }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -slideOffset }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Image Navigation Arrows */}
                {activeCase.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-forest-950/40 hover:bg-forest-950/80 text-white md:backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 active:scale-95 cursor-pointer"
                      aria-label="Предыдущее фото"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-forest-950/40 hover:bg-forest-950/80 text-white md:backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 active:scale-95 cursor-pointer"
                      aria-label="Следующее фото"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Dots / Indicator Overlay */}
                {activeCase.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-forest-950/25 md:backdrop-blur-xs px-3 py-1.5 rounded-full">
                    {activeCase.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > imgIndex ? 1 : -1);
                          setImgIndex(idx);
                        }}
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
                  <span className="bg-forest-900/80 md:backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-btn uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {activeCase.location}
                  </span>
                  <span className="bg-forest-950/60 md:backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-btn uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {activeCase.duration}
                  </span>
                  {activeCase.images.length > 1 && (
                    <span className="bg-forest-600/90 md:backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-btn uppercase tracking-wider">
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
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-ink-900 mt-2 leading-tight text-balance">
                    {activeCase.title}
                  </h3>

                  <p className="text-ink-600 font-light text-sm sm:text-base leading-relaxed mt-4 text-pretty">
                    {activeCase.description}
                  </p>

                  {/* Key Accomplished Steps */}
                  <div className="mt-8 pt-6 border-t border-ink-100 space-y-4">
                    <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider">Выполненные работы:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCase.tasks.map((task, i) => (
                        <div key={i} className="flex items-start space-x-2.5">
                          <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                          <span className="text-xs text-ink-700 leading-normal font-light">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment Used */}
                  <div className="mt-6 pt-6 border-t border-ink-100">
                    <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5" /> Спецтехника и инструменты:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCase.equipment.map((item, i) => (
                        <span key={i} className="bg-forest-50 text-ink-600 text-[11px] px-2.5 py-1 rounded-btn border border-ink-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action and Old Link */}
                <div className="mt-8 pt-6 border-t border-ink-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenCallbackModal()}
                    className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-btn tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    Заказать аналогичный спил
                  </button>

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
        </Reveal>

      </div>
    </section>
  );
}
