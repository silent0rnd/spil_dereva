/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SERVICES } from '../data';
import { X, ShieldCheck, Upload, Trash2, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { CallRequest } from '../types';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  calculatorDetails?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function FeedbackForm({
  isOpen,
  onClose,
  preselectedServiceId = SERVICES[0].id,
  calculatorDetails = ''
}: FeedbackFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(preselectedServiceId);
  const [treeInfo, setTreeInfo] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<CallRequest | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Sync state if preselected variables change
  React.useEffect(() => {
    if (isOpen) {
      setServiceId(preselectedServiceId);
      if (calculatorDetails) {
        setTreeInfo(calculatorDetails);
      } else {
        setTreeInfo('');
      }
      setSuccessTicket(null);
    }
  }, [isOpen, preselectedServiceId, calculatorDetails]);

  // Escape to close, Tab kept inside the dialog, and page scroll frozen while open.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  // File Upload Handlers (Drag and Drop + Click)
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    // Simulate sending data (safely save to localStorage as database substitute)
    setTimeout(() => {
      const ticketId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
      const newRequest: CallRequest = {
        id: ticketId,
        name,
        phone,
        serviceId,
        treeInfo: treeInfo || undefined,
        photoUrl: photoPreview || undefined,
        timestamp: Date.now(),
        status: 'new'
      };

      // Persistent save
      try {
        const currentRequests = JSON.parse(localStorage.getItem('arbo_requests') || '[]');
        currentRequests.push(newRequest);
        localStorage.setItem('arbo_requests', JSON.stringify(currentRequests));
      } catch (err) {
        console.error('LocalStorage write failed:', err);
      }

      setIsSubmitting(false);
      setSuccessTicket(newRequest);

      // Reset inputs
      setName('');
      setPhone('');
      setPhoto(null);
      setPhotoPreview(null);
    }, 1200);
  };

  const activeService = SERVICES.find(s => s.id === serviceId) || SERVICES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="feedback-modal-overlay"
          role="presentation"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            id="feedback-modal-content"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Заказать бесплатный выезд технолога"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white w-full max-w-lg rounded-panel overflow-hidden shadow-panel border border-ink-100 flex flex-col my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              aria-label="Закрыть форму"
              className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-900 hover:bg-ink-50 rounded-btn transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {!successTicket ? (
              /* Main Callback Form */
              <form id="modal-callback-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-display text-ink-900 tracking-tight leading-tight">
                    Бесплатный выезд технолога
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-1.5 leading-relaxed">
                    Оставьте контакты. Наш специалист перезвонит в течение 10 минут, сориентирует по стоимости и согласует удобное время выезда оценщика.
                  </p>
                </div>

                {/* Service selector */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-service-select" id="lbl-modal-service" className="block text-[11px] font-bold text-ink-700 uppercase tracking-wider">
                    Интересующая услуга
                  </label>
                  <select
                    id="modal-service-select"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full p-3 bg-ink-50 border border-ink-200 rounded-btn text-xs font-bold text-ink-800 focus:outline-none focus:border-forest-600 focus:bg-white transition-all"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {/* Input Name */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-name-input" id="lbl-modal-name" className="block text-[11px] font-bold text-ink-700 uppercase tracking-wider">
                    Ваше имя *
                  </label>
                  <input
                    id="modal-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванович"
                    className="w-full p-3 bg-ink-50 border border-ink-200 rounded-btn text-xs focus:outline-none focus:border-forest-600 focus:bg-white transition-all text-ink-800 font-medium"
                  />
                </div>

                {/* Input Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-phone-input" id="lbl-modal-phone" className="block text-[11px] font-bold text-ink-700 uppercase tracking-wider">
                    Номер телефона *
                  </label>
                  <input
                    id="modal-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full p-3 bg-ink-50 border border-ink-200 rounded-btn text-xs font-mono focus:outline-none focus:border-forest-600 focus:bg-white transition-all text-ink-800 font-bold"
                  />
                </div>

                {/* Tree Info Details (Calculations details if any, or text comments) */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-info-textarea" id="lbl-modal-info" className="block text-[11px] font-bold text-ink-700 uppercase tracking-wider">
                    Описание дерева или параметры участка
                  </label>
                  <textarea
                    id="modal-info-textarea"
                    rows={2}
                    value={treeInfo}
                    onChange={(e) => setTreeInfo(e.target.value)}
                    placeholder="Например: Две березы диаметром около 40см, стоят близко к дому. Нужен вывоз древесины."
                    className="w-full p-3 bg-ink-50 border border-ink-200 rounded-btn text-xs focus:outline-none focus:border-forest-600 focus:bg-white transition-all text-ink-800 font-light resize-none leading-relaxed"
                  />
                </div>

                {/* Drag & Drop Photo Upload */}
                <div className="space-y-1.5">
                  <label id="lbl-modal-upload" className="block text-[11px] font-bold text-ink-700 uppercase tracking-wider">
                    Прикрепить фото дерева (для точной оценки)
                  </label>

                  {!photoPreview ? (
                    <div
                      id="dropzone"
                      role="button"
                      tabIndex={0}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      className={`border-2 border-dashed rounded-card p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 select-none ${
                        isDragOver
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-ink-200 bg-ink-50/60 hover:bg-ink-50 hover:border-forest-300'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-ink-400" />
                      <span className="block text-xs font-bold text-ink-700">Перетащите сюда фото или нажмите</span>
                      <span className="block text-[10px] text-ink-400">Форматы: JPG, PNG. До 10 МБ</span>
                      <input
                        id="hidden-file-input"
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div id="photo-preview-box" className="relative border border-forest-100 rounded-card p-2.5 bg-forest-50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={photoPreview}
                          alt="Превью загруженного фото"
                          className="w-12 h-12 rounded-btn object-cover border border-ink-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="block text-xs font-bold text-ink-800 truncate max-w-[180px]">{photo?.name || 'Изображение'}</span>
                          <span className="block text-[10px] text-ink-400 font-mono">{(photo!.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button
                        id="remove-photo-btn"
                        type="button"
                        onClick={removePhoto}
                        aria-label="Удалить фото"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-btn transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Call to action button */}
                <button
                  id="modal-submit-btn"
                  type="submit"
                  disabled={isSubmitting || !name || !phone}
                  className={`w-full py-4 text-white font-bold text-xs uppercase tracking-wider rounded-btn shadow-card flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isSubmitting || !name || !phone
                      ? 'bg-ink-300 shadow-none cursor-not-allowed'
                      : 'bg-forest-600 hover:bg-forest-700 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Отправка данных...</span>
                    </>
                  ) : (
                    <span>Отправить и рассчитать стоимость</span>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-ink-400 mt-2">
                  <ShieldCheck className="w-4 h-4 text-forest-500" />
                  <span>Конфиденциальность гарантируется</span>
                </div>
              </form>
            ) : (
              /* Success Ticket screen */
              <div id="modal-success-ticket" className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="mx-auto w-14 h-14 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full font-mono">
                    {successTicket.id}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-ink-900 mt-3.5 tracking-tight">
                    Заявка успешно принята!
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-1.5 leading-relaxed">
                    Спасибо за обращение, <strong>{successTicket.name}</strong>. Наш ведущий технолог свяжется с вами в течение 10 минут.
                  </p>
                </div>

                {/* Ticket Summary Details */}
                <div className="bg-forest-50 border border-forest-100 rounded-card p-5 text-left space-y-3.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-forest-200">
                    <span className="text-ink-400 font-light">Выбранный тариф</span>
                    <span className="font-bold text-forest-900">{activeService.title}</span>
                  </div>

                  <div className="flex items-start justify-between text-xs pb-2 border-b border-forest-200">
                    <span className="text-ink-400 font-light shrink-0">Контакты</span>
                    <span className="font-bold text-ink-800 text-right font-mono flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-forest-600" />
                      {successTicket.phone}
                    </span>
                  </div>

                  {successTicket.treeInfo && (
                    <div className="text-xs">
                      <span className="text-ink-400 font-light block">Данные расчета / параметры</span>
                      <p className="font-medium text-ink-700 mt-1 bg-white p-2 border border-ink-100 rounded-btn text-[11px] leading-relaxed">
                        {successTicket.treeInfo}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-ink-400">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(successTicket.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>Статус: в обработке</span>
                  </div>
                </div>

                <button
                  id="success-close-btn"
                  onClick={onClose}
                  className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs uppercase tracking-wider rounded-btn transition-all cursor-pointer"
                >
                  Отлично, буду ждать звонка
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
