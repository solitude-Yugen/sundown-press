/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: preloader.js                          ║
   ║  Handles the brand loading screen on page load                 ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

/**
 * Initializes the preloader.
 * Hides the preloader overlay after a short delay and fires a callback.
 *
 * @param {Function} onComplete - Called once preloader fades out
 */
export function initPreloader(onComplete) {
  const finish = () => {
    window.sundownLoaded = true;
    window.dispatchEvent(new Event('sundown:loaded'));
    onComplete?.();
  };
  const start = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      finish();
      return;
    }

    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.style.display = 'none';
        finish();
      }, 800);
    }, 2400);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
