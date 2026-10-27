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
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      onComplete && onComplete();
      return;
    }

    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.style.display = 'none';
        onComplete && onComplete();
      }, 800);
    }, 2400);
  });
}
