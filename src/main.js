/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — src/main.js  (ES Module entry point)          ║
   ║  Imports and boots every feature module in the correct order.  ║
   ║                                                                ║
   ║  Module map                                                    ║
   ║  ─────────────────────────────────────────────────────────    ║
   ║  brand.js           → shared color constants                  ║
   ║  preloader.js       → loading screen                          ║
   ║  three-scene.js     → WebGL background                        ║
   ║  navigation.js      → nav bar, hamburger, smooth scroll       ║
   ║  animations.js      → GSAP ScrollTrigger animations           ║
   ║  counters.js        → animated number counters                ║
   ║  particles-overlay.js → HTML particles, sparkles, tilt, etc. ║
   ║  how-it-works.js    → 3-step interactive section              ║
   ║  persistent-cta.js  → floating CTA bar + WhatsApp button      ║
   ╚══════════════════════════════════════════════════════════════════╝ */

import { initPreloader }      from './preloader.js';
import { initThreeScene }     from './three-scene.js';
import { initNavigation }     from './navigation.js';
import { initGSAPAnimations } from './animations.js';
import { initCounters }       from './counters.js';
import {
  initFloatingParticles,
  initCardSparkles,
  initCardTilt,
  initCardConfetti,
  initCursorGlow,
}                             from './particles-overlay.js';
import { initHowItWorks }     from './how-it-works.js';
import { initPersistentCta }  from './persistent-cta.js';

// ── Boot order ────────────────────────────────────────────────────
// Three.js scene starts immediately (runs its own rAF loop)
const threeScene = initThreeScene();

// Push scrollY into Three.js shader uniforms every frame
window.addEventListener('scroll', () => {
  threeScene?.setScrollY(window.pageYOffset);
}, { passive: true });

// Preloader → once hidden, fire GSAP animations
initPreloader(() => {
  initGSAPAnimations();
});

// DOM-ready initialisations (don't need to wait for images)
initNavigation();
initCounters();
initFloatingParticles();
initCardSparkles();
initCardTilt();
initCardConfetti();
initCursorGlow();
initHowItWorks();
initPersistentCta();
