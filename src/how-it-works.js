/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: how-it-works.js                       ║
   ║  How It Works 3-step section:                                  ║
   ║    Step 1 — Fan card hover interaction                         ║
   ║    Step 2 — Looping briefing form → draft progress animation   ║
   ║    Step 3 — Mock WhatsApp RSVP sequence                        ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

// ── Shared sleep helper ──────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Step 2 state ─────────────────────────────────────────────────
let isStep2Active  = false;
let isStep2Running = false;

// ── Step 3 state ─────────────────────────────────────────────────
let isStep3Active  = false;
let isStep3Running = false;

// ── Typewriter helper ─────────────────────────────────────────────
async function typeText(el, text, speed = 32) {
  if (!el) return false;
  el.innerHTML = '<span class="typing-cursor"></span>';
  for (let i = 0; i < text.length; i++) {
    if (!isStep2Active) return false;
    el.textContent = text.slice(0, i + 1);
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);
    await sleep(speed);
  }
  el.querySelector('.typing-cursor')?.remove();
  return true;
}

// ── Step 1: Fan cards hover ───────────────────────────────────────
function initStep1() {
  const fanCardsStack = document.getElementById('fanCardsStack');
  const fpTiers       = document.querySelectorAll('.fp-tier');

  if (fanCardsStack) {
    fanCardsStack.addEventListener('mousemove', (e) => {
      const rect  = fanCardsStack.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const normY = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

      fanCardsStack.querySelectorAll('.fan-card').forEach((card) => {
        const baseRot = parseFloat(card.style.getPropertyValue('--rot')) || 0;
        const baseTx  = parseFloat(card.style.getPropertyValue('--tx'))  || 0;
        card.style.transform = `translateX(${baseTx + normX * 8}px) translateY(${normY * -8}px) rotate(${baseRot + normX * 4}deg)`;
      });
    });

    fanCardsStack.addEventListener('mouseleave', () => {
      fanCardsStack.querySelectorAll('.fan-card').forEach((card) => {
        const r = card.style.getPropertyValue('--rot') || '0deg';
        const t = card.style.getPropertyValue('--tx')  || '0px';
        card.style.transform = `translateX(${t}) rotate(${r})`;
      });
    });
  }

  fpTiers.forEach((tier) => {
    tier.addEventListener('click', () => {
      fpTiers.forEach((t) => t.classList.remove('active'));
      tier.classList.add('active');
    });
  });
}

// ── Step 2: Briefing → Draft loop ────────────────────────────────
async function runStep2Loop() {
  if (isStep2Running) return;
  isStep2Running = true;

  const briefingState    = document.getElementById('briefingState');
  const draftState       = document.getElementById('draftState');
  const briefingNames    = document.getElementById('briefingNames');
  const briefingDate     = document.getElementById('briefingDate');
  const briefingVenue    = document.getElementById('briefingVenue');
  const briefingSavedPill = document.getElementById('briefingSavedPill');
  const draftProgBarFill  = document.getElementById('draftProgBarFill');
  const draftReadyFill    = document.getElementById('draftReadyFill');
  const progStepReady     = document.getElementById('progStepReady');

  while (isStep2Active) {
    // — Part A: Fill in briefing —
    draftState?.classList.remove('active');
    briefingState?.classList.add('active');

    if (briefingSavedPill) {
      briefingSavedPill.style.opacity   = '0';
      briefingSavedPill.style.transform = 'translateY(-4px) scale(0.9)';
      briefingSavedPill.classList.remove('pill-saved');
    }
    if (briefingNames) briefingNames.innerHTML = '';
    if (briefingDate)  briefingDate.innerHTML  = '';
    if (briefingVenue) briefingVenue.innerHTML  = '';

    await sleep(350);
    if (!isStep2Active) break;

    if (!await typeText(briefingNames, 'Priya & Arjun', 35)   || !isStep2Active) break;
    await sleep(150);
    if (!await typeText(briefingDate, '14 December 2024', 30)  || !isStep2Active) break;
    await sleep(150);
    if (!await typeText(briefingVenue, 'The Jeypore Palace, Jaipur', 25) || !isStep2Active) break;
    await sleep(200);

    if (briefingSavedPill) {
      briefingSavedPill.style.opacity   = '1';
      briefingSavedPill.style.transform = 'translateY(0) scale(1)';
      briefingSavedPill.classList.add('pill-saved');
    }

    await sleep(2400);
    if (!isStep2Active) break;

    // — Part B: Draft ready progress bar —
    briefingState?.classList.remove('active');
    draftState?.classList.add('active');

    if (draftProgBarFill) { draftProgBarFill.style.transition = 'none'; draftProgBarFill.style.width = '0%'; }
    if (draftReadyFill)   { draftReadyFill.style.transition   = 'none'; draftReadyFill.style.width   = '0%'; }
    if (progStepReady)    { progStepReady.classList.replace('step-complete', 'step-pending'); }
    if (draftProgBarFill) void draftProgBarFill.offsetWidth; // force reflow

    await sleep(350);
    if (!isStep2Active) break;

    if (draftProgBarFill) {
      draftProgBarFill.style.transition = 'width 2.4s cubic-bezier(0.4,0,0.2,1)';
      draftProgBarFill.style.width      = '100%';
    }

    await sleep(2400);
    if (!isStep2Active) break;

    progStepReady?.classList.replace('step-pending', 'step-complete');
    if (draftReadyFill) { draftReadyFill.style.transition = 'width 0.4s ease'; draftReadyFill.style.width = '100%'; }

    const approveBtn = document.querySelector('.btn-approve');
    if (approveBtn) {
      approveBtn.style.transform  = 'scale(1.05)';
      approveBtn.style.boxShadow  = '0 0 16px rgba(212,160,60,0.6)';
      setTimeout(() => { approveBtn.style.transform = ''; approveBtn.style.boxShadow = ''; }, 800);
    }

    await sleep(2800);
  }

  isStep2Running = false;
}

// ── Step 3: WhatsApp RSVP sequence ───────────────────────────────
async function runStep3Sequence() {
  if (isStep3Running) return;
  isStep3Running = true;

  const waMsg1           = document.getElementById('waMsg1');
  const waMsg2           = document.getElementById('waMsg2');
  const waTypingBubble   = document.getElementById('waTypingBubble');
  const liveRsvpsCard    = document.getElementById('liveRsvpsCard');
  const rsvpAcceptsMetric = document.getElementById('rsvpAcceptsMetric');
  const rsvpDietMetric   = document.getElementById('rsvpDietMetric');

  while (isStep3Active) {
    // Reset
    waMsg1?.classList.replace('wa-visible', 'wa-hidden');
    const ticks = waMsg1?.querySelector('.blue-ticks');
    if (ticks) { ticks.style.color = '#888'; ticks.textContent = '✓'; }
    if (waTypingBubble) waTypingBubble.style.display = 'none';
    waMsg2?.classList.replace('wa-visible', 'wa-hidden');
    liveRsvpsCard?.classList.replace('card-visible', 'card-hidden');
    if (rsvpAcceptsMetric) { rsvpAcceptsMetric.textContent = '0 guests'; rsvpAcceptsMetric.classList.remove('metric-bump'); }
    if (rsvpDietMetric)    { rsvpDietMetric.textContent    = '0 guests'; rsvpDietMetric.classList.remove('metric-bump'); }

    await sleep(350); if (!isStep3Active) break;

    // Link shared
    waMsg1?.classList.replace('wa-hidden', 'wa-visible');
    await sleep(800); if (!isStep3Active) break;

    // Blue ticks
    if (ticks) { ticks.textContent = '✓✓'; ticks.style.color = '#34B7F1'; }
    await sleep(600); if (!isStep3Active) break;

    // Typing indicator
    if (waTypingBubble) waTypingBubble.style.display = 'inline-flex';
    await sleep(1400); if (!isStep3Active) break;

    // Guest reply
    if (waTypingBubble) waTypingBubble.style.display = 'none';
    waMsg2?.classList.replace('wa-hidden', 'wa-visible');
    await sleep(800); if (!isStep3Active) break;

    // RSVP card appears
    liveRsvpsCard?.classList.replace('card-hidden', 'card-visible');
    await sleep(700); if (!isStep3Active) break;

    // Counts tick up
    if (rsvpAcceptsMetric) {
      rsvpAcceptsMetric.textContent = '2 guests';
      rsvpAcceptsMetric.classList.add('metric-bump');
      setTimeout(() => rsvpAcceptsMetric.classList.remove('metric-bump'), 600);
    }
    await sleep(500); if (!isStep3Active) break;

    if (rsvpDietMetric) {
      rsvpDietMetric.textContent = '1 guest';
      rsvpDietMetric.classList.add('metric-bump');
      setTimeout(() => rsvpDietMetric.classList.remove('metric-bump'), 600);
    }

    await sleep(6500);
  }

  isStep3Running = false;
}

/**
 * Main entry point — wires up all 3 steps.
 * Must be called after the DOM is ready.
 */
export function initHowItWorks() {
  const section = document.getElementById('how-it-works');
  if (!section) return;

  initStep1();

  // IntersectionObserver drives steps 2 & 3
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'hiwStep2') {
          isStep2Active = entry.isIntersecting;
          if (isStep2Active) runStep2Loop();
        } else if (entry.target.id === 'hiwStep3') {
          isStep3Active = entry.isIntersecting;
          if (isStep3Active) runStep3Sequence();
        }
      });
    }, { threshold: 0.15 });

    const s2 = document.getElementById('hiwStep2');
    const s3 = document.getElementById('hiwStep3');
    if (s2) observer.observe(s2);
    if (s3) observer.observe(s3);
  } else {
    // Fallback
    isStep2Active = true;
    isStep3Active = true;
    runStep2Loop();
    runStep3Sequence();
  }

  // Smooth scroll for all HIW section internal tab / progress links
  section.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    });
  });
}
