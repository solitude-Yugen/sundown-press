/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: particles-overlay.js                  ║
   ║  HTML floating gold particles, card sparkles, card tilt,       ║
   ║  hover confetti, custom cursor glow                            ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

// ── CSS injector helper ──────────────────────────────────────────
function injectStyle(css) {
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
}

// ── 1. Floating HTML gold particles overlay ──────────────────────
export function initFloatingParticles() {
  const overlay = document.getElementById('particles-overlay');
  if (!overlay) return;

  injectStyle(`
    @keyframes floatUp {
      0%   { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
      10%  { opacity: 0.6; transform: translateY(-10vh) translateX(10px) scale(1); }
      50%  { opacity: 0.4; }
      90%  { opacity: 0.1; }
      100% { transform: translateY(-105vh) translateX(30px) scale(0.3); opacity: 0; }
    }
  `);

  for (let i = 0; i < 25; i++) {
    const p   = document.createElement('div');
    const dur = Math.random() * 8 + 6;
    const del = Math.random() * 5;
    const sz  = Math.random() * 4 + 1;
    p.style.cssText = `
      position: absolute;
      bottom: -10px;
      left: ${Math.random() * 100}%;
      width: ${sz}px;
      height: ${sz}px;
      background: radial-gradient(circle, rgba(212,160,60,0.8), rgba(212,160,60,0));
      border-radius: 50%;
      animation: floatUp ${dur}s ${del}s linear infinite;
      pointer-events: none;
    `;
    overlay.appendChild(p);
  }
}

// ── 2. Card sparkles around the envelope ────────────────────────
export function initCardSparkles() {
  const container = document.getElementById('cardSparkles');
  if (!container || container.children.length) return;

  for (let i = 0; i < 20; i++) {
    const angle    = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 80;
    const s        = document.createElement('div');
    s.classList.add('card-sparkle');
    s.style.cssText = `
      left: ${40 + Math.random() * 20}%;
      top:  ${40 + Math.random() * 20}%;
      --tx: ${Math.cos(angle) * distance}px;
      --ty: ${Math.sin(angle) * distance}px;
      --dur:   ${3 + Math.random() * 4}s;
      --delay: ${Math.random() * 3}s;
      width:  ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
    `;
    container.appendChild(s);
  }
}

// ── 3. Greeting card tilt ────────────────────────────────────────
export function initCardTilt() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((e.clientY - rect.top)  - cy) / cy * -5;
      const rotateY = ((e.clientX - rect.left) - cx) / cx *  5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${e.clientX - rect.left - rect.width}px`;
        glow.style.top  = `${e.clientY - rect.top  - rect.height}px`;
      }
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ── 4. Greeting card hover confetti ─────────────────────────────
export function initCardConfetti() {
  injectStyle(`
    @keyframes confettiBurst {
      0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0.3) rotate(360deg); opacity: 0; }
    }
  `);

  document.querySelectorAll('.greeting-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const confetti = card.querySelector('.card-confetti');
      if (!confetti) return;
      const palette = ['#D4A03C', '#E8C547', '#0F3D3E', '#FF6B6B', '#4ECDC4'];
      for (let i = 0; i < 8; i++) {
        const angle    = (Math.PI * 2 / 8) * i;
        const dist     = 30 + Math.random() * 30;
        const particle = document.createElement('span');
        particle.style.cssText = `
          position: absolute;
          width: 6px; height: 6px;
          background: ${palette[Math.floor(Math.random() * palette.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          top: 50%; left: 50%;
          pointer-events: none;
          z-index: 10;
          animation: confettiBurst 0.8s ease-out forwards;
          --tx: ${Math.cos(angle) * dist}px;
          --ty: ${Math.sin(angle) * dist}px;
        `;
        confetti.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    });
  });
}

// ── 5. Custom cursor glow (desktop only) ────────────────────────
export function initCursorGlow() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,160,60,0.06), transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
