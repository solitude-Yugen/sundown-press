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

  // ── Hero decor parallax ───────────────────────────────────────
  gsap.to('.hero-decor', {
    y: -150,
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 2 },
  });

  // ── Hero text side fade on scroll ────────────────────────────
  gsap.to('.hero-text-side', {
    y: -80, opacity: 0.3,
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.5 },
  });

  gsap.to('.hero-card-side', {
    y: -40, opacity: 0.5,
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 2 },
  });

  // ── Hero 3D card entrance ─────────────────────────────────────
  const hero3dCard = document.getElementById('hero3dCard');
  if (hero3dCard) {
    gsap.fromTo(
      hero3dCard,
      { y: 120, opacity: 0, rotateX: 15, rotateY: -10, scale: 0.8 },
      { y: 0,   opacity: 1, rotateX: 0,  rotateY: 0,  scale: 1, duration: 1.6, delay: 0.5, ease: 'power3.out' }
    );

    gsap.to(hero3dCard, { y: '-=10', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 });

    // Toggle open / close on click
    const badgeText = document.getElementById('suiteBadgeText');
    hero3dCard.addEventListener('click', () => {
      const opening = !hero3dCard.classList.contains('opened');
      hero3dCard.classList.toggle('opened');
      if (badgeText) badgeText.textContent = opening ? 'Click to Close' : 'Click to Open Invitation';
    });

    hero3dCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hero3dCard.click(); }
    });

    // Subtle 3D mouse tilt on the envelope
    const suiteElem = hero3dCard.querySelector('.envelope-suite');
    if (suiteElem) {
      hero3dCard.addEventListener('mousemove', (e) => {
        const rect = hero3dCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        suiteElem.style.setProperty('--tilt-x', `${-y * 12}deg`);
        suiteElem.style.setProperty('--tilt-y', `${x  * 12}deg`);
      });
      hero3dCard.addEventListener('mouseleave', () => {
        suiteElem.style.setProperty('--tilt-x', '0deg');
        suiteElem.style.setProperty('--tilt-y', '0deg');
      });
    }
  }

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
