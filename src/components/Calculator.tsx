/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SERVICES } from '../data';
import { Calculator, ShieldCheck, Check, Info, FileText, ArrowRight } from 'lucide-react';
import { CalculatorParams } from '../types';

interface CalculatorProps {
  onOpenCallbackModal: (serviceId?: string, calcDetails?: string) => void;
}

export default function CalculatorComponent({ onOpenCallbackModal }: CalculatorProps) {
  const [params, setParams] = useState<CalculatorParams>({
    serviceId: SERVICES[0].id,
    diameter: 30, // Default 30cm
    distanceToBuildings: 'safe',
    count: 1,
    hasPowerLines: false,
    needsStumpRemoval: false,
    needsCleanUp: false
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Helper to calculate cost dynamically
  useEffect(() => {
    const service = SERVICES.find(s => s.id === params.serviceId);
    if (!service) return;

    let total = service.priceFrom;

    // Scale calculations based on tree-related services
    const isTreeService = ['felling-whole', 'felling-parts', 'pruning'].includes(params.serviceId);

    if (isTreeService) {
      // 1. Diameter multiplier
      let dMult = 1.0;
      if (params.diameter > 80) dMult = 3.5;
      else if (params.diameter > 60) dMult = 2.5;
      else if (params.diameter > 40) dMult = 1.8;
      else if (params.diameter > 20) dMult = 1.3;
      total = total * dMult;

      // 2. Distance multiplier
      let distMult = 1.0;
      if (params.distanceToBuildings === 'close') distMult = 1.25;
      else if (params.distanceToBuildings === 'danger') distMult = 1.6;
      total = total * distMult;

      // 3. Add-ons
      if (params.hasPowerLines) {
        total += 1500;
      }

      if (params.needsStumpRemoval) {
        // Grinding sturdiness scales with diameter
        total += Math.max(1000, params.diameter * 45);
      }

      if (params.needsCleanUp) {
        // Cleanup scale
        total += Math.max(1500, 1000 + params.diameter * 25);
      }
    } else if (params.serviceId === 'stump-removal') {
      // Stump removal service only
      total = Math.max(1000, params.diameter * 55);
      if (params.needsCleanUp) total += 800;
    } else if (params.serviceId === 'land-clearing') {
      // Land clearing goes by "sotka" count
      total = service.priceFrom;
      if (params.needsCleanUp) total += 1500;
    }

    // Multiply by number of items (count)
    total = total * params.count;

    // Round to nearest hundred
    setEstimatedPrice(Math.round(total / 100) * 100);
  }, [params]);

  const activeService = SERVICES.find(s => s.id === params.serviceId) || SERVICES[0];
  const isTreeService = ['felling-whole', 'felling-parts', 'pruning'].includes(params.serviceId);
  const isStumpOnly = params.serviceId === 'stump-removal';

  const handleApplyEstimate = () => {
    // Generate text specification for the modal
    const buildingsText = params.distanceToBuildings === 'safe'
      ? 'Безопасная зона'
      : params.distanceToBuildings === 'close'
      ? 'Вблизи построек (<5м)'
      : 'Аварийная зона (ЛЭП/крыша)';

    const details = `Калькуляция: Услуга - "${activeService.title}", Диаметр - ${isTreeService || isStumpOnly ? params.diameter + ' см' : 'не применимо'}, Дистанция - ${buildingsText}, Кол-во - ${params.count} шт., ЛЭП - ${params.hasPowerLines ? 'Да' : 'Нет'}, Удаление пня - ${params.needsStumpRemoval ? 'Да' : 'Нет'}, Уборка - ${params.needsCleanUp ? 'Да' : 'Нет'}. Оценка: ~${estimatedPrice.toLocaleString('ru-RU')} руб.`;

    onOpenCallbackModal(params.serviceId, details);
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="calculator-header" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-100 px-3 py-1 rounded-full">
            Онлайн-оценка
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal font-display text-gray-900 mt-4 tracking-tight">
            Калькулятор стоимости работ
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg font-light">
            Укажите параметры дерева, чтобы получить мгновенную прозрачную оценку. 
            Цена является ориентировочной и фиксируется при заключении официального договора.
          </p>
        </div>

        {/* Calculator Main Layout */}
        <div id="calculator-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls - Left Panel */}
          <div id="calculator-controls" className="lg:col-span-7 bg-forest-50/40 border border-forest-100/60 rounded-3xl p-6 md:p-8 space-y-8">
            
            {/* Step 1: Service Selection */}
            <div>
              <label id="label-service" className="block text-sm font-bold text-gray-900 mb-3.5 uppercase tracking-wider">
                1. Выберите тип услуги
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    id={`calc-service-tab-${s.id}`}
                    type="button"
                    onClick={() => {
                      setParams(prev => ({
                        ...prev,
                        serviceId: s.id,
                        // Reset properties if irrelevant
                        needsStumpRemoval: s.id === 'stump-removal' ? false : prev.needsStumpRemoval
                      }));
                    }}
                    className={`p-3.5 text-left rounded-xl border text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                      params.serviceId === s.id
                        ? 'bg-forest-600 border-forest-600 text-white shadow-md shadow-forest-100'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-forest-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0 bg-current" />
                    <span className="truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Diameter Slider (Only for tree or stump services) */}
            {(isTreeService || isStumpOnly) && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label id="label-diameter" className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                    2. Примерный диаметр ствола
                  </label>
                  <span className="text-base font-extrabold font-mono text-forest-700 bg-forest-100 px-3 py-1 rounded-lg">
                    {params.diameter} см
                  </span>
                </div>
                
                <input
                  id="diameter-range-input"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={params.diameter}
                  onChange={(e) => setParams(p => ({ ...p, diameter: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
                />
                
                <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                  <span>Малое (10-25 см)</span>
                  <span>Среднее (30-50 см)</span>
                  <span>Крупное (55-80 см)</span>
                  <span>Вековое (&gt;80 см)</span>
                </div>
              </div>
            )}

            {/* Step 3: Proximity to buildings (Only for tree services) */}
            {isTreeService && (
              <div>
                <label id="label-proximity" className="block text-sm font-bold text-gray-900 mb-3.5 uppercase tracking-wider">
                  3. Окружающая обстановка (препятствия)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'safe', label: 'Свободно', desc: 'Строений рядом нет' },
                    { id: 'close', label: 'Близко', desc: 'Забор / дом < 5м' },
                    { id: 'danger', label: 'Опасно', desc: 'Нависает над крышей/ЛЭП' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`calc-proximity-tab-${opt.id}`}
                      type="button"
                      onClick={() => setParams(p => ({ ...p, distanceToBuildings: opt.id as any }))}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        params.distanceToBuildings === opt.id
                          ? 'bg-forest-100 border-forest-600 text-forest-900 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-forest-300'
                      }`}
                    >
                      <span className="block text-xs font-bold">{opt.label}</span>
                      <span className="block text-[10px] text-gray-500 font-light mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Add-ons checkboxes */}
            <div>
              <label id="label-addons" className="block text-sm font-bold text-gray-900 mb-3.5 uppercase tracking-wider">
                {isTreeService ? '4. Сопутствующие услуги' : '2. Дополнительные опции'}
              </label>
              <div className="space-y-3">
                {/* Power Lines Difficulty Toggle (only for trees) */}
                {isTreeService && (
                  <label id="toggle-power-lines" className="flex items-start p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer select-none hover:border-forest-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={params.hasPowerLines}
                      onChange={(e) => setParams(p => ({ ...p, hasPowerLines: e.target.checked }))}
                      className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500 mt-0.5"
                    />
                    <div className="ml-3 text-xs">
                      <span className="block font-bold text-gray-900">Близость проводов ЛЭП</span>
                      <span className="block text-[10px] text-gray-500 font-light mt-0.5">Требует привлечения арбористов со спецдопуском или оттяжки ветвей (+1 500 ₽)</span>
                    </div>
                  </label>
                )}

                {/* Stump Removal Toggle (only if felling trees, not for stump itself) */}
                {isTreeService && (
                  <label id="toggle-stump-removal" className="flex items-start p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer select-none hover:border-forest-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={params.needsStumpRemoval}
                      onChange={(e) => setParams(p => ({ ...p, needsStumpRemoval: e.target.checked }))}
                      className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500 mt-0.5"
                    />
                    <div className="ml-3 text-xs">
                      <span className="block font-bold text-gray-900">Выкорчевать / сдробить пень</span>
                      <span className="block text-[10px] text-gray-500 font-light mt-0.5">Дробление пня фрезой ниже уровня земли на 30 см (от +1 000 ₽)</span>
                    </div>
                  </label>
                )}

                {/* Cleanup Toggle */}
                <label id="toggle-cleanup" className="flex items-start p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer select-none hover:border-forest-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={params.needsCleanUp}
                    onChange={(e) => setParams(p => ({ ...p, needsCleanUp: e.target.checked }))}
                    className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500 mt-0.5"
                  />
                  <div className="ml-3 text-xs">
                    <span className="block font-bold text-gray-900">Сбор мусора и вывоз порубочных остатков</span>
                    <span className="block text-[10px] text-gray-500 font-light mt-0.5">Соберем все ветки, распилим ствол на дрова, уберем опилки и вывезем самосвалом (от +1 500 ₽)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-4 border-t border-forest-100/50">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Количество объектов</span>
              <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl p-1">
                <button
                  id="qty-decrement"
                  type="button"
                  onClick={() => setParams(p => ({ ...p, count: Math.max(1, p.count - 1) }))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-extrabold font-mono text-gray-800 w-6 text-center">{params.count}</span>
                <button
                  id="qty-increment"
                  type="button"
                  onClick={() => setParams(p => ({ ...p, count: p.count + 1 }))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Results Card - Right Panel */}
          <div id="calculator-results" className="lg:col-span-5 bg-forest-950 text-white rounded-3xl p-6 md:p-8 lg:sticky lg:top-24 shadow-xl shadow-forest-950/20">
            <div className="flex items-center space-x-2.5 text-forest-400 mb-6">
              <Calculator className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Предварительный расчет</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                <span className="text-xs text-forest-200 font-light">Выбранная услуга</span>
                <span className="text-xs font-bold text-right truncate max-w-[200px]">{activeService.title}</span>
              </div>

              {isTreeService && (
                <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <span className="text-xs text-forest-200 font-light">Диаметр ствола</span>
                  <span className="text-xs font-bold font-mono">{params.diameter} см</span>
                </div>
              )}

              {isTreeService && (
                <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <span className="text-xs text-forest-200 font-light">Зона производства</span>
                  <span className="text-xs font-bold">
                    {params.distanceToBuildings === 'safe' ? 'Безопасная' : params.distanceToBuildings === 'close' ? 'Вблизи объектов' : 'Аварийный наклон'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                <span className="text-xs text-forest-200 font-light">Общее количество</span>
                <span className="text-xs font-bold font-mono">{params.count} шт.</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                <span className="text-xs text-forest-200 font-light">Доп. опции</span>
                <span className="text-xs font-bold text-forest-400">
                  {[
                    params.hasPowerLines ? 'ЛЭП' : null,
                    params.needsStumpRemoval ? 'Пень' : null,
                    params.needsCleanUp ? 'Уборка' : null
                  ].filter(Boolean).join(', ') || 'нет'}
                </span>
              </div>
            </div>

            <div className="bg-forest-900/50 rounded-2xl p-5 mb-8 border border-forest-800/30">
              <span className="block text-[11px] text-forest-300 uppercase tracking-widest font-semibold">Ориентировочная стоимость</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-3xl md:text-4xl font-black font-mono text-white">
                  ~ {estimatedPrice.toLocaleString('ru-RU')}
                </span>
                <span className="text-xl font-bold text-forest-300">₽</span>
              </div>
              <p className="text-[10px] text-forest-200/70 font-light mt-3 leading-relaxed">
                *Расчет сделан автоматически. Окончательная смета утверждается на объекте. Выезд замерщика и осмотр абсолютно бесплатны.
              </p>
            </div>

            <button
              id="calc-submit-btn"
              onClick={handleApplyEstimate}
              className="w-full py-4 bg-forest-500 hover:bg-forest-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
            >
              <span>Зафиксировать цену и вызвать оценщика</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 justify-center mt-6 text-[10px] text-forest-300">
              <ShieldCheck className="w-4 h-4 text-forest-400" />
              <span>Договор гарантирует неизменность сметы</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
