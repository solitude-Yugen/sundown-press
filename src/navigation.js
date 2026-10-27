/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: navigation.js                         ║
   ║  Hamburger menu, scroll-to-center nav, smooth anchor scroll    ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

/**
 * Wires up all navigation behaviour:
 *  - Hamburger toggle + mobile menu overlay
 *  - Scroll-to-center animation (logo glides to center on scroll)
 *  - Smooth scroll for all `<a href="#...">` links
 */
export function initNavigation() {
  // ── Hamburger / mobile menu ──────────────────────────────────
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll-to-center nav animation ──────────────────────────
  const nav = document.getElementById('main-nav');
  const onNavScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll(); // run on init

  // ── Smooth anchor scroll ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
