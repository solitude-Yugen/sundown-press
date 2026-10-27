/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: persistent-cta.js                     ║
   ║  Floating bottom CTA bar + WhatsApp button scroll behaviour    ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

/**
 * Shows/hides the persistent bottom CTA bar and the floating
 * WhatsApp button based on scroll position.
 */
export function initPersistentCta() {
  const ctaBar = document.getElementById('persistentCtaBar');
  const waBtn  = document.getElementById('floatingWhatsappBtn');

  if (!ctaBar && !waBtn) return;

  // Initial transition
  if (ctaBar) {
    ctaBar.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease';
  }

  const onScroll = () => {
    const scrolled = (window.pageYOffset || document.documentElement.scrollTop) > 300;

    if (ctaBar) {
      ctaBar.style.transform = scrolled ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)';
      ctaBar.style.opacity   = scrolled ? '1' : '0';
    }

    if (waBtn) {
      waBtn.style.transform = scrolled ? 'scale(1)'   : 'scale(0.8)';
      waBtn.style.opacity   = scrolled ? '1'          : '0.7';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init so initial state is correct
}
