import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { clamp, END, pageTurn, paperStrip, catalogueState } from './timeline.js';
import './catalogue.css';

const services = [
  { name: 'Digital', subtitle: 'A little magic. Instantly delivered.', text: 'Thoughtfully designed invitations, made for screens and shared with the people who matter.', color: '#0f3d3e', paper: '#b9d6cf', ink: '#123c39', image: 'invite_card_1.jpg', label: 'YOU’RE INVITED', type: 'phone', link: 'digital-greetings.html' },
  { name: 'Printable', subtitle: 'Your celebration, beautifully on paper.', text: 'Personalised, print-ready designs. Choose your paper, print your way, and make it yours.', color: '#745244', paper: '#f5f0e1', ink: '#654331', image: 'invite_card_2.jpg', label: 'SAVE THE DATE', type: 'print', link: 'printed-keepsakes.html' },
  { name: 'Printed', subtitle: 'Something wonderful to hold.', text: 'Rich colour, tactile details and keepsake-worthy invitations, crafted with care.', color: '#4a121a', paper: '#ead7bb', ink: '#651c29', image: 'invite_card_3.jpg', label: 'THE ART OF GATHERING', type: 'traditional', link: 'printed-keepsakes.html' },
  { name: 'Wedding', subtitle: 'The first chapter of your forever.', text: 'An invitation suite as individual as your love story. From the first announcement to the final detail.', color: '#536455', paper: '#e8eadf', ink: '#314c3c', image: 'invite_card_4.jpg', label: 'TOGETHER, ALWAYS', type: 'wedding', link: 'weddings.html' },
  { name: 'Custom', subtitle: 'Dream it. We’ll make it personal.', text: 'A colour, a memory, an idea. Let’s turn your story into an invitation that could only be yours.', color: '#614e72', paper: '#ddd0e7', ink: '#4b335c', image: 'invite_card_5.jpg', label: 'ONE OF A KIND', type: 'custom', link: 'contact.html' },
];

function PageFront({ service, index }) {
  return <div className={`cat-face cat-front cat-${service.type}`} style={{ background: service.paper, color: service.ink }}>
    <div className="cat-folio"><span>SUNDOWN PRESS</span><span>0{index + 1} / 05</span></div>
    <p className="cat-page-label">{service.label}</p>
    <div className="cat-mockup"><img src={service.image} alt={`${service.name} invitation design by Sundown Press`} /><span className="cat-seal">S<span>✦</span>P</span></div>
    <h2>{service.name}<em>invitations</em></h2>
    <div className="cat-page-foot"><span>PERSONALISED WITH LOVE</span><span>✦</span></div>
  </div>;
}
function PageBack({ service }) {
  return <div className="cat-face cat-back" style={{ background: service.paper, color: service.ink }}><span className="cat-back-mark">✦</span><p>A moment becomes<br /><em>a memory.</em></p><small>SUNDOWN PRESS</small></div>;
}
const STRIPS = Array.from({ length: 10 }, (_, index) => index);
function PaperStrip({ service, index, strip, progress, opened, reduced }) {
  const turn = useTransform(() => opened && !reduced ? pageTurn(progress.get(), index) : 0);
  const transform = useTransform(() => {
    const { x, z, angle } = paperStrip(turn.get(), strip);
    return `translateX(calc(var(--book-w) * ${x})) translateZ(calc(var(--book-w) * ${z})) rotateY(${angle}deg)`;
  });
  const shade = useTransform(() => paperStrip(turn.get(), strip).shade);
  return <motion.div className="cat-paper-strip" style={{ transform, '--paper-shade': shade }}>
    <div className="cat-sheet-side cat-sheet-front"><div className="cat-sheet-art" style={{ left: `calc(var(--book-w) * ${-strip / 10})` }}><PageFront service={service} index={index} /></div></div>
    <div className="cat-sheet-side cat-sheet-back"><div className="cat-sheet-art" style={{ left: `calc(var(--book-w) * ${-(9 - strip) / 10})` }}><PageBack service={service} /></div></div>
  </motion.div>;
}
function BookPage({ service, index, progress, opened, reduced }) {
  const transform = useTransform(() => {
    const p = opened ? pageTurn(progress.get(), index) : 0;
    // Turned leaves stack above the inside cover on the left side of the spread.
    return `translateZ(${(5 - index) * 3 + p * (9 + index * 6)}px) rotateY(${reduced ? 0 : -p * 180}deg)`;
  });
  const opacity = useTransform(() => reduced && opened ? (Math.min(4, Math.floor(progress.get())) === index && progress.get() < 5.25 ? 1 : 0) : 1);
  return <motion.div className="cat-leaf cat-paper" style={{ transform, opacity }}>{STRIPS.map(strip => <PaperStrip key={strip} {...{ service, index, strip, progress, opened, reduced }} />)}</motion.div>;
}
function BookCover({ opening, progress, reduced }) {
  const transform = useTransform(() => `translateZ(21px) rotateY(${reduced ? 0 : -180 * opening.get()}deg)`);
  const opacity = useTransform(opening, [0, 0.9, 1], [1, reduced ? 0 : 1, reduced ? 0 : 1]);
  return <motion.div className="cat-leaf cat-cover" style={{ transform, opacity }}><div className="cat-face cat-front"><span>THE INVITATION COLLECTION</span><div className="cat-cover-sun">☼</div><h2>Sundown<br /><em>Press</em></h2><p>For every story.<br />For every celebration.</p><small>PERSONALISED CELEBRATIONS & KEEPSAKES</small></div><div className="cat-face cat-back"><span>Beautiful beginnings,<br /><em>unforgettable moments.</em></span><small>SUNDOWN PRESS</small></div></motion.div>;
}
function Book({ progress, intro, opening, opened, reduced, onOpen, ready }) {
  const transform = useTransform(() => {
    const exit = clamp(progress.get() - 6);
    const arrival = reduced ? 0 : 1 - intro.get();
    return `translateX(calc(var(--spread-offset) * ${opening.get()} + ${arrival * 240}px)) translateY(${-arrival * 150 - exit * 65}px) translateZ(${-arrival * 1400 - (reduced ? 0 : exit * 180)}px) scale(${1 - arrival * 0.65 - exit * 0.12}) rotateX(${reduced ? 0 : 12 * (1 - opening.get()) + arrival * 22}deg) rotateY(${reduced ? 0 : -14 * (1 - opening.get()) - arrival * 44}deg) rotateZ(${-arrival * 18}deg)`;
  });
  const opacity = useTransform(() => (reduced ? 1 : clamp(intro.get() / 0.3)) * (1 - clamp(progress.get() - 6)));
  const darkness = useTransform(intro, [0, 0.45, 1], [1, 0.3, 0]);
  return <div className="cat-stage">
    <motion.div className="cat-book-visibility" style={{ opacity }} aria-hidden="true">
    <motion.div className="cat-book" style={{ transform }}>
      <div className="cat-rear cat-face"><span>Every celebration<br />starts with<br /><em>an invitation.</em></span><small>SUNDOWN PRESS · MADE FOR YOU</small></div>
      <div className="cat-spine">SUNDOWN PRESS · THE COLLECTION</div>
      <div className="cat-stack" />
      {services.map((service, index) => <BookPage key={service.name} {...{ service, index, progress, intro, opened, reduced }} />)}
      <BookCover opening={opening} progress={progress} reduced={reduced} />
    </motion.div>
    </motion.div>
    <motion.div className="cat-arrival-dark" style={{ opacity: reduced ? 0 : darkness }} />
    {!opened && <button className="cat-book-hit" aria-label="Open invitation catalogue" disabled={!ready} onClick={onOpen} />}
  </div>;
}
function CatalogueController() {
  const root = useRef(null), touch = useRef(null), controls = useRef(null);
  const motionPreference = useReducedMotion();
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    update();
    return () => preference.removeEventListener('change', update);
  }, [motionPreference]);
  const [ready, setReady] = useState(false), [opened, setOpened] = useState(false), [phase, setPhase] = useState('loading'), [active, setActive] = useState(0);
  const intro = useMotionValue(0), opening = useMotionValue(0);
  const progress = useMotionValue(0);
  const scrollYProgress = useTransform(progress, v => v / END);
  const backgroundColor = useTransform(progress, [0, 1, 2, 3, 4, 5.3, 6.3, 7], ['#06191b', '#271b18', '#260b11', '#1b251e', '#221a2c', '#071719', '#071719', '#071719']);
  // Measure after the open layout commits. The closed hero has no scroll range;
  // reusing its normalized progress can otherwise jump straight to the hidden end frame.
  useLayoutEffect(() => {
    const update = () => {
      const el = root.current;
      const range = el.offsetHeight - window.innerHeight;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      el.dataset.inView = String(rect.bottom > 0 && rect.top < window.innerHeight);
      progress.set(opened && range > 0 ? clamp((window.scrollY - top) / range) * END : 0);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root.current);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [opened, progress]);
  useMotionValueEvent(progress, 'change', v => { if (!opened) return; setActive(Math.min(4, Math.floor(v + 0.25))); setPhase(catalogueState(v)); });
  useEffect(() => {
    let animation;
    const start = () => { setPhase('arriving'); animation = animate(intro, 1, { duration: reduced ? 0 : 2.6, ease: [0.22, 0.65, 0.25, 1], onComplete: () => { setReady(true); setPhase('closed'); } }); };
    if (window.sundownLoaded) start(); else window.addEventListener('sundown:loaded', start, { once: true });
    return () => { window.removeEventListener('sundown:loaded', start); animation?.stop(); };
  }, [intro]);
  useEffect(() => () => controls.current?.stop(), []);
  function open() {
    if (!ready || opened || phase === 'opening') return;
    setPhase('opening');
    controls.current = animate(opening, 1, { duration: reduced ? 0 : 1.65, ease: [0.22, 1, 0.36, 1], onComplete: () => { setOpened(true); setPhase('active'); window.ScrollTrigger?.refresh(); } });
  }
  function go(value) {
    const el = root.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + clamp(value / END) * (el.offsetHeight - window.innerHeight), behavior: reduced ? 'instant' : 'smooth' });
  }
  function next() { if (progress.get() >= 6.95) skip(); else go(Math.min(END, Math.floor(progress.get() + 0.05) + 1)); }
  function previous() { go(Math.max(0, Math.ceil(progress.get() - 0.05) - 1)); }
  function skip() { const el = root.current; window.scrollTo({ top: el.getBoundingClientRect().bottom + window.scrollY, behavior: reduced ? 'instant' : 'smooth' }); document.querySelector('.marquee-section')?.focus({ preventScroll: true }); }
  const service = services[active];
  return <motion.section id="hero" ref={root} style={{ '--opening': opening }} className={`catalogue-hero ${opened ? 'is-open' : ''} ${reduced ? 'is-reduced' : ''}`} data-state={phase} aria-label="Interactive invitation catalogue" onKeyDown={e => { if (!opened || e.altKey || e.ctrlKey || e.metaKey) return; if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); if (['ArrowRight', 'PageDown'].includes(e.key)) next(); else if (['ArrowLeft', 'PageUp'].includes(e.key)) previous(); else go(e.key === 'Home' ? 0 : END); } }}>
    <motion.div className="cat-pin" style={{ backgroundColor }}>
      <div className="cat-topline"><span>AN INVITATION TO SOMETHING SPECIAL</span><button onClick={skip}>Skip introduction ↗</button></div>
      <div className="cat-watermark" aria-hidden="true">{opened ? (phase === 'back-cover' || phase === 'departing' || phase === 'handoff' ? 'Made for you.' : service.name) : 'Beautiful beginnings.'}</div>
      <div className="cat-content" onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { const t = touch.current; if (!t || !opened) return; const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) dx < 0 ? next() : previous(); touch.current = null; }}>
        <Book {...{ progress, intro, opening, opened, reduced, ready }} onOpen={open} />
      </div>
      <div className="cat-caption" aria-live="polite" aria-atomic="true">
        <p className="cat-eyebrow">{opened ? `THE COLLECTION / 0${active + 1}` : 'SUNDOWN PRESS / THE COLLECTION'}</p>
        <h1>{opened ? (progress.get() >= 5.25 ? 'Your story starts here.' : service.subtitle) : 'Every moment deserves a beautiful beginning.'}</h1>
        {opened && <p className="cat-description">{progress.get() >= 5.25 ? 'Explore more of what we make, or tell us what you have in mind.' : service.text}</p>}
        {!opened ? <button className="cat-open" onClick={open} disabled={!ready || phase === 'opening'}>{phase === 'opening' ? 'Opening your catalogue…' : ready ? 'Open the catalogue ↗' : 'Preparing your catalogue…'}</button> : <a className="cat-explore" href={service.link}>Explore {service.name.toLowerCase()} invitations ↗</a>}
      </div>
      <div className="cat-navigation">{opened ? <><button onClick={previous} disabled={active === 0 && phase === 'active'} aria-label="Previous catalogue page">← Previous</button><span>SCROLL TO TURN · {Math.min(7, Math.floor(progress.get()) + 1)} / 8</span><button onClick={next}>{phase === 'handoff' ? 'Continue below ↓' : 'Next →'}</button></> : <><span>CRAFTED WITH CARE. KEPT WITH LOVE.</span><span>FIVE WAYS TO SAY YOU’RE INVITED</span></>}</div>
      {opened && <motion.div className="cat-progress" style={{ scaleX: scrollYProgress }} />}
    </motion.div>
  </motion.section>;
}
createRoot(document.getElementById('catalogue-root')).render(<CatalogueController />);
