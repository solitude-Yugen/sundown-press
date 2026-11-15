/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: animations.js                         ║
   ║  GSAP ScrollTrigger animations, hero entrance, card tilt,      ║
   ║  carousel stagger, parallax sections                           ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

/**
 * Registers all GSAP-driven scroll animations.
 * Called after the preloader finishes so GSAP can measure the DOM.
 *
 * Requires `gsap`, `ScrollTrigger`, and `ScrollToPlugin` as globals (CDN).
 */
export function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ── Hero title lines ─────────────────────────────────────────
  gsap.to('.title-line', {
    opacity:  1,
    y:        0,
    duration: 1.0,
    stagger:  0.15,
    ease:     'power3.out',
    delay:    0.3,
  });

  // ── Generic scroll-triggered fade-up ─────────────────────────
  document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity:  1,
      y:        0,
      duration: 0.8,
      delay:    parseFloat(el.dataset.delay) || 0,
      ease:     'power3.out',
    });
  });

  // ── Fade right ───────────────────────────────────────────────
  document.querySelectorAll('[data-animate="fade-right"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity:  1,
      x:        0,
      duration: 0.8,
      delay:    parseFloat(el.dataset.delay) || 0,
      ease:     'power3.out',
    });
  });

  // ── Fade left ────────────────────────────────────────────────
  document.querySelectorAll('[data-animate="fade-left"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity:  1,
      x:        0,
      duration: 0.8,
      delay:    parseFloat(el.dataset.delay) || 0,
      ease:     'power3.out',
    });
  });

  // ── Stagger up (card grids) ──────────────────────────────────
  document.querySelectorAll('[data-animate="stagger-up"]').forEach((container) => {
    gsap.to(container.children, {
      scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none reverse' },
      opacity:  1,
      y:        0,
      duration: 0.7,
      stagger:  0.12,
      ease:     'power3.out',
    });
  });

  // ── Parallax quote sections ───────────────────────────────────
  gsap.utils.toArray('.parallax-divider').forEach((section) => {
    gsap.fromTo(
      section.querySelector('.parallax-content'),
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      }
    );
  });

  // ── Visual card parallax depth ────────────────────────────────
  gsap.utils.toArray('.visual-card').forEach((card, i) => {
    gsap.to(card, {
      y: -20 - i * 10,
      scrollTrigger: { trigger: card.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  });

  // ── Carousel card entrance ───────────────────────────────────
  const carouselCards = document.querySelectorAll('.carousel-card');
  if (carouselCards.length) {
    gsap.fromTo(
      carouselCards,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: (i) => {
          const v = carouselCards[i].style.getPropertyValue('--stagger-y');
          return v ? parseInt(v) : 0;
        },
        scale: 1, duration: 0.8, stagger: 0.04, delay: 1.2, ease: 'power3.out',
      }
    );
  }
}
