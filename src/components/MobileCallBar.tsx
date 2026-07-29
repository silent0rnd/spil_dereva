/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Calculator, Phone } from 'lucide-react';
import { CONTACTS } from '../data';

interface MobileCallBarProps {
  onOpenCallbackModal: (serviceId?: string) => void;
}

/**
 * On phones the header CTA scrolls away and the only way back to a conversion
 * point is scrolling. This bar appears once the hero is behind you.
 */
export default function MobileCallBar({ onOpenCallbackModal }: MobileCallBarProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldShow = latest > window.innerHeight * 0.8;
    setIsVisible((current) => (current === shouldShow ? current : shouldShow));
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="mobile-call-bar"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          // Solid white rather than translucent + backdrop-blur: this bar only
          // ever renders on phones, where the blur costs real frames.
          className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-ink-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-panel lg:hidden"
        >
          <a
            href={CONTACTS.phoneHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-forest-600 py-3 text-xs font-bold text-white transition-colors hover:bg-forest-700 active:scale-95"
          >
            <Phone className="h-4 w-4" />
            Позвонить
          </a>
          <button
            type="button"
            onClick={() => onOpenCallbackModal()}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-btn border border-forest-200 bg-forest-50 py-3 text-xs font-bold text-forest-800 transition-colors hover:bg-forest-100 active:scale-95"
          >
            <Calculator className="h-4 w-4" />
            Рассчитать
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
