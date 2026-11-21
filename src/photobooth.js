import { clampZoom, galleryTiles, MIN_ZOOM, MAX_ZOOM } from './photobooth-layout.js';

// Stock images, not customer photographs. Source pages are listed in PHOTO_CREDITS.md.
export const boothPhotos = [4307635,30723691,37572244,26423890,19119341,16902222,18107912,9271168,29153202];
const photoUrl = id => `${import.meta.env.BASE_URL}images/photobooth/${id}.avif`;

export function initPhotoBooth() {
  const viewport = document.querySelector('#booth-gallery');
  if (!viewport) return;
  const container = viewport.querySelector('.booth-gallery-tiles');
  const controls = document.querySelector('.booth-gallery-controls');
  const pauseButton = controls.querySelector('[data-booth-action="pause"]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let x = -55, y = -65, zoom = 0.95, vx = 0, vy = 0;
  let width = viewport.clientWidth, height = viewport.clientHeight;
  let paused = reducedMotion.matches, visible = false, frame = 0, previousTime = 0, pointer = null;
  const nodes = new Map();

  function draw() {
    const tiles = galleryTiles(width, height, x, y, zoom, boothPhotos.length);
    const keys = new Set(tiles.map(tile => tile.key));
    for (const [key, node] of nodes) {
      if (!keys.has(key)) { node.remove(); nodes.delete(key); }
    }
    for (const tile of tiles) {
      let node = nodes.get(tile.key);
      if (!node) {
        node = document.createElement('span');
        node.className = 'booth-gallery-photo';
        const image = new Image();
        image.alt = '';
        image.draggable = false;
        image.decoding = 'async';
        image.addEventListener('load', () => viewport.classList.add('has-images'), { once: true });
        image.addEventListener('error', () => node.classList.add('is-unavailable'), { once: true });
        image.src = photoUrl(boothPhotos[tile.image]);
        node.append(image);
        nodes.set(tile.key, node);
        container.append(node);
      }
      node.style.transform = `translate(${tile.x.toFixed(2)}px,${tile.y.toFixed(2)}px) scale(${zoom}) rotate(${tile.tilt}deg)`;
    }
    controls.querySelector('[data-booth-action="zoom-out"]').disabled = zoom <= MIN_ZOOM;
    controls.querySelector('[data-booth-action="zoom-in"]').disabled = zoom >= MAX_ZOOM;
  }

  function tick(time) {
    frame = 0;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0;
    previousTime = time;
    if (!pointer) {
      x += (vx + (paused || reducedMotion.matches ? 0 : -7)) * dt;
      y += (vy + (paused || reducedMotion.matches ? 0 : -3)) * dt;
      const damping = Math.exp(-5 * dt);
      vx *= damping; vy *= damping;
      if (Math.abs(vx) < 1) vx = 0;
      if (Math.abs(vy) < 1) vy = 0;
    }
    draw();
    schedule();
  }

  function schedule() {
    if (frame || !visible || document.hidden) return;
    if ((!paused && !reducedMotion.matches) || vx || vy) frame = requestAnimationFrame(tick);
    else previousTime = 0;
  }

  function setPaused(value) {
    paused = value; vx = vy = 0;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    schedule();
  }

  function setZoom(value) { zoom = clampZoom(value); draw(); }
  controls.addEventListener('click', e => {
    const action = e.target.closest('[data-booth-action]')?.dataset.boothAction;
    if (action === 'zoom-in') setZoom(zoom + 0.15);
    if (action === 'zoom-out') setZoom(zoom - 0.15);
    if (action === 'pause') setPaused(!paused);
    if (action === 'reset') { x = -55; y = -65; vx = vy = 0; setZoom(0.95); }
  });

  viewport.addEventListener('pointerdown', e => {
    if (pointer || e.button !== 0) return;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp };
    vx = vy = 0;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
    viewport.focus({ preventScroll: true });
  });
  viewport.addEventListener('pointermove', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    // Screen coordinates account for the CSS cabinet perspective on touch and mouse.
    const bounds = viewport.getBoundingClientRect();
    const dx = (e.clientX - pointer.x) * width / bounds.width / zoom;
    const dy = (e.clientY - pointer.y) * height / bounds.height / zoom;
    const dt = Math.max((e.timeStamp - pointer.time) / 1000, 0.008);
    x += dx; y += dy;
    vx = Math.max(-900, Math.min(900, dx / dt));
    vy = Math.max(-900, Math.min(900, dy / dt));
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp };
    draw();
  });
  const release = e => {
    if (!pointer || e.pointerId !== pointer.id) return;
    if (e.type === 'pointercancel' || e.timeStamp - pointer.time > 100 || paused || reducedMotion.matches) vx = vy = 0;
    pointer = null;
    viewport.classList.remove('is-dragging');
    schedule();
  };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('lostpointercapture', release);
  viewport.addEventListener('keydown', e => {
    const moves = { ArrowLeft: [60,0], ArrowRight: [-60,0], ArrowUp: [0,60], ArrowDown: [0,-60] };
    if (moves[e.key]) { e.preventDefault(); x += moves[e.key][0] / zoom; y += moves[e.key][1] / zoom; draw(); }
    else if (['+','=','-','_'].includes(e.key)) { e.preventDefault(); setZoom(zoom + (['+','='].includes(e.key) ? 0.15 : -0.15)); }
    else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); }
    else if (e.key === 'Home') { e.preventDefault(); x = -55; y = -65; setZoom(0.95); }
  });
  // Ordinary scrolling continues down the landing page; modifier-wheel zooms only this screen.
  viewport.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault(); setZoom(zoom * Math.exp(-e.deltaY * 0.003));
  }, { passive: false });

  new ResizeObserver(() => { width = viewport.clientWidth; height = viewport.clientHeight; draw(); }).observe(viewport);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    else schedule();
  }).observe(viewport);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    else schedule();
  });
  reducedMotion.addEventListener('change', () => setPaused(reducedMotion.matches));
  document.querySelectorAll('.booth-paper-strip > span').forEach((photo, i) => {
    photo.style.backgroundImage = `url("${photoUrl(boothPhotos[i])}")`;
  });
  setPaused(paused);
  draw();
}
