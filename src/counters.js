/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: counters.js                           ║
   ║  Animated number counters triggered by IntersectionObserver    ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

/**
 * Animates a single numeric counter element from 0 to its data-count value.
 * @param {Element} counter - DOM element with a data-count attribute
 */
function animateSingleCounter(counter) {
  const target    = parseInt(counter.dataset.count, 10);
  const duration  = 2000;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    counter.textContent = Math.floor(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Observes hero stats and the parallax stats row.
 * Triggers the counter animation once when each enters the viewport.
 */
export function initCounters() {
  // Hero stats row
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroStats.querySelectorAll('[data-count]').forEach(animateSingleCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(heroStats);
  }

  // Parallax stats row
  const parallaxStats = document.querySelector('.parallax-stats-row');
  if (parallaxStats) {
    const obs2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateSingleCounter);
          obs2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs2.observe(parallaxStats);
  }
}
