/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Clock, MapPin, Mail, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="site-footer" className="bg-forest-950 text-gray-300 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div id="footer-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-forest-900/60">
          
          {/* Company Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <Logo size="sm" className="shadow-sm shadow-forest-900/50" />
              <span className="text-lg font-black font-display tracking-tight leading-none">
                Спил Деревьев
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Профессиональное удаление аварийных деревьев, обрезка и санитарная вырубка в Москве и Московской области. Безопасно, аккуратно и с полной гарантией материальной ответственности.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-forest-400 font-medium">
              <ShieldAlert className="w-4 h-4 text-forest-500 shrink-0" />
              <span>Лицензия на высотные работы и санитарную вырубку</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Навигация</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Услуги и цены', id: 'services' },
                { label: 'Калькулятор стоимости', id: 'calculator' },
                { label: 'Галерея (До/После)', id: 'gallery' },
                { label: 'Отзывы клиентов', id: 'reviews' },
                { label: 'Частые вопросы', id: 'faq' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-forest-400 transition-colors cursor-pointer text-left font-light"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Услуги</h4>
            <ul className="space-y-2.5 text-xs font-light text-gray-400">
              <li>Спил по частям</li>
              <li>Валка с оттяжкой</li>
              <li>Кронирование берез, сосен</li>
              <li>Удаление пней фрезой</li>
              <li>Расчистка участков</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-3.5 text-xs">
              <li>
                <a
                  id="footer-phone"
                  href="tel:+74951234567"
                  className="flex items-center font-bold text-white text-sm font-mono hover:text-forest-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-forest-500 mr-2 shrink-0" />
                  +7 (495) 123-45-67
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <Clock className="w-4 h-4 text-forest-500 mr-2 shrink-0 mt-0.5" />
                <span className="font-light">
                  Прием заявок: Ежедневно<br />
                  с 08:00 до 21:00
                </span>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="w-4 h-4 text-forest-500 mr-2 shrink-0 mt-0.5" />
                <span className="font-light">
                  Работаем по Москве, Новой Москве и всей Московской области
                </span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 text-forest-500 mr-2 shrink-0" />
                <a href="mailto:info@spil-dereviev.ru" className="hover:text-forest-400 font-light font-mono text-[11px]">
                  info@spil-dereviev.ru
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal and Copyright */}
        <div id="footer-bottom" className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <div className="font-light">
            © {currentYear} Спил Деревьев. Все права защищены.
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center font-light">
            <span>Информация на сайте не является публичной офертой.</span>
            <span>Политика конфиденциальности</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
