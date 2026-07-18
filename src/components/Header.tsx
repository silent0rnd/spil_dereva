/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Phone, Clock, MapPin, Menu, X } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onOpenCallbackModal: (serviceId?: string) => void;
}

export default function Header({ onOpenCallbackModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of header
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

  const menuItems = [
    { label: 'Услуги', id: 'services' },
    { label: 'Калькулятор', id: 'calculator' },
    { label: 'Наши работы', id: 'gallery' },
    { label: 'Отзывы', id: 'reviews' },
    { label: 'Вопросы', id: 'faq' }
  ];

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-forest-100 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="logo-container"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo size="md" className="shadow-sm shadow-forest-200/50" />
            <div>
              <span className="block text-xl font-extrabold font-display text-forest-950 tracking-tight leading-none">
                Спил Деревьев
              </span>
              <span className="block text-xs font-medium text-forest-600 tracking-wide mt-0.5">
                Профессиональная арбористика
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-semibold text-gray-600 hover:text-forest-700 transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Details & Action - Desktop */}
          <div id="header-contacts" className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <a
                id="header-phone-link"
                href="tel:+74951234567"
                className="flex items-center justify-end text-base font-bold font-mono text-gray-900 hover:text-forest-700 transition-colors duration-150"
              >
                <Phone className="w-4 h-4 text-forest-600 mr-2" />
                +7 (495) 123-45-67
              </a>
              <div className="flex items-center justify-end text-[11px] text-gray-500 mt-0.5 space-x-3">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 text-forest-400 mr-1" />
                  Ежедневно: 8:00 – 21:00
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 text-forest-400 mr-1" />
                  Москва и МО
                </span>
              </div>
            </div>
            <button
              id="header-callback-btn"
              onClick={() => onOpenCallbackModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-xl transition-all duration-150 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              Заказать звонок
            </button>
          </div>

          {/* Phone Icon & Burger Menu for Small Screens */}
          <div className="flex items-center space-x-3 md:space-x-0">
            <a
              id="mobile-phone-shortcut"
              href="tel:+74951234567"
              className="p-2 text-forest-700 hover:bg-forest-50 rounded-xl lg:hidden transition-colors"
              title="Позвонить нам"
            >
              <Phone className="w-5 h-5" />
            </a>
            
            <button
              id="burger-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl md:hidden transition-all duration-150"
              aria-label="Переключить меню"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-forest-100 shadow-xl py-4 px-6 animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className="text-left py-2 text-base font-semibold text-gray-700 hover:text-forest-700 hover:bg-forest-50 px-3 rounded-lg transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            
            <div className="border-t border-gray-100 pt-4 flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5 text-sm text-gray-600">
                <a
                  id="mobile-drawer-phone"
                  href="tel:+74951234567"
                  className="flex items-center font-bold text-gray-900 text-lg font-mono hover:text-forest-700"
                >
                  <Phone className="w-4 h-4 text-forest-600 mr-2" />
                  +7 (495) 123-45-67
                </a>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-forest-500" />
                  Без выходных: с 8:00 до 21:00
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-forest-500" />
                  Москва, Новая Москва, Московская область
                </div>
              </div>
              <button
                id="mobile-drawer-callback-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCallbackModal();
                }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                Заказать бесплатный расчет стоимости
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
