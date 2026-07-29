/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Phone, Clock, MapPin, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { CONTACTS } from '../data';

interface HeaderProps {
  onOpenCallbackModal: (serviceId?: string) => void;
}

const MENU_ITEMS = [
  { label: 'Услуги', id: 'services' },
  { label: 'Калькулятор', id: 'calculator' },
  { label: 'Наши работы', id: 'gallery' },
  { label: 'Отзывы', id: 'reviews' },
  { label: 'Вопросы', id: 'faq' }
];

export default function Header({ onOpenCallbackModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the menu entry for whichever section is currently in the middle
  // of the viewport. The hero, the steps and the footer are not in the menu, so
  // the highlight has to clear itself there rather than keep the last match.
  useEffect(() => {
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        });
        const current = MENU_ITEMS.find((item) => intersecting.has(item.id));
        setActiveSection(current ? current.id : null);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    MENU_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
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

  return (
    <header
      id="site-header"
      // backdrop-filter on a fixed bar repaints a blurred strip on every scroll
      // frame and was the single biggest source of jank on phones (p95 83ms ->
      // 50ms without it). At 95% opacity the blur is invisible anyway, so it is
      // only enabled from md up, where it is cheap.
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 md:backdrop-blur-md shadow-card border-b border-forest-100 py-3'
          : 'bg-white/95 md:bg-white/80 md:backdrop-blur-sm border-b border-transparent py-4'
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
            <Logo
              size="md"
              className={`shadow-card transition-transform duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}
            />
            <div>
              <span className="block text-xl font-bold font-display text-forest-950 tracking-tight leading-none">
                Спил Деревьев
              </span>
              <span className="block text-xs font-medium text-forest-600 tracking-wide mt-0.5">
                Профессиональная арбористика
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {MENU_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-forest-700' : 'text-ink-600 hover:text-forest-700'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-forest-600 transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Contact Details & Action - Desktop */}
          <div id="header-contacts" className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <a
                id="header-phone-link"
                href={CONTACTS.phoneHref}
                className="flex items-center justify-end text-base font-bold font-mono text-ink-900 hover:text-forest-700 transition-colors duration-150"
              >
                <Phone className="w-4 h-4 text-forest-600 mr-2" />
                {CONTACTS.phone}
              </a>
              <div className="flex items-center justify-end text-[11px] text-ink-500 mt-0.5 space-x-3">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 text-forest-400 mr-1" />
                  {CONTACTS.hoursShort}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 text-forest-400 mr-1" />
                  {CONTACTS.areaShort}
                </span>
              </div>
            </div>
            <button
              id="header-callback-btn"
              onClick={() => onOpenCallbackModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-btn transition-all duration-150 shadow-card hover:shadow-card-hover active:scale-95 cursor-pointer"
            >
              Заказать звонок
            </button>
          </div>

          {/* Phone Icon & Burger Menu for Small Screens */}
          <div className="flex items-center space-x-3 md:space-x-0">
            <a
              id="mobile-phone-shortcut"
              href={CONTACTS.phoneHref}
              className="p-2 text-forest-700 hover:bg-forest-50 rounded-btn lg:hidden transition-colors"
              title="Позвонить нам"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              id="burger-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-ink-600 hover:text-forest-700 hover:bg-forest-50 rounded-btn md:hidden transition-all duration-150"
              aria-label="Переключить меню"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-forest-100 shadow-panel py-4 px-6"
          >
            <div className="flex flex-col space-y-4">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-2 text-base font-semibold text-ink-700 hover:text-forest-700 hover:bg-forest-50 px-3 rounded-btn transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-ink-100 pt-4 flex flex-col space-y-4">
                <div className="flex flex-col space-y-1.5 text-sm text-ink-600">
                  <a
                    id="mobile-drawer-phone"
                    href={CONTACTS.phoneHref}
                    className="flex items-center font-bold text-ink-900 text-lg font-mono hover:text-forest-700"
                  >
                    <Phone className="w-4 h-4 text-forest-600 mr-2" />
                    {CONTACTS.phone}
                  </a>
                  <div className="flex items-center text-xs text-ink-500">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-forest-500" />
                    {CONTACTS.hoursLong}
                  </div>
                  <div className="flex items-center text-xs text-ink-500">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-forest-500" />
                    {CONTACTS.areaLong}
                  </div>
                </div>
                <button
                  id="mobile-drawer-callback-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCallbackModal();
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-btn shadow-card transition-all active:scale-95"
                >
                  Заказать бесплатный расчет стоимости
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
