import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useReducedMotion } from 'framer-motion';
import InfiniteGallery from './components/originkit/ui/infinitegallery-custom-style';
import '../css/originkit-tailwind.css';

const portraits = [
  [4307635, 'Couple smiling together'],
  [30723691, 'Couple in colourful traditional attire'],
  [37572244, 'Black and white couple portrait'],
  [26423890, 'Woman smiling in traditional attire'],
  [19119341, 'Woman in a blue saree'],
  [16902222, 'Black and white portrait of a woman'],
  [18107912, 'Man with henna on his hands'],
  [9271168, 'Smiling man in a white shirt'],
  [29153202, 'Man in traditional attire'],
];
const images = portraits.map(([id, alt]) => ({ src: `${import.meta.env.BASE_URL}images/photobooth/${id}.avif`, alt }));

function PhotoBoothScreen() {
  const camera = useRef(null);
  const screen = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setPaused(Boolean(prefersReducedMotion));
  }, [prefersReducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(screen.current);
    return () => observer.disconnect();
  }, []);

  function onKeyDown(event) {
    const moves = { ArrowLeft: [-65, 0], ArrowRight: [65, 0], ArrowUp: [0, -65], ArrowDown: [0, 65] };
    if (moves[event.key]) { event.preventDefault(); camera.current?.panBy(...moves[event.key]); }
    else if (['+', '=', '-', '_'].includes(event.key)) {
      event.preventDefault(); camera.current?.zoomBy(['+', '='].includes(event.key) ? 0.3 : -0.3);
    } else if (event.key === 'Home') { event.preventDefault(); camera.current?.reset(); }
    else if (event.key === ' ') { event.preventDefault(); setPaused(value => !value); }
  }

  return <>
    <div className="booth-gallery" id="booth-gallery" ref={screen} role="region" tabIndex={0}
      aria-label="Infinite gallery of nine illustrative stock portraits" aria-describedby="booth-gallery-help"
      onKeyDown={onKeyDown} onPointerDown={() => screen.current?.focus({ preventScroll: true })}>
      <div className="booth-gallery-canvas" aria-hidden="true">
        <InfiniteGallery className="h-full w-full overflow-hidden" images={images}
          width="100%" height="100%" style={{ minWidth: 0, minHeight: 0, touchAction: 'pan-y' }}
          imageWidth={105} imageHeight={135} density={12} rounded={2}
          backgroundColor="#091c1e" dragSpeed={20} driftAmount={paused || prefersReducedMotion ? 0 : 7}
          friction={14} controlsRef={camera} paused={paused} active={active}
          reducedMotion={Boolean(prefersReducedMotion)} autoPanSpeed={1.1} />
      </div>
      <span className="booth-gallery-badge" aria-hidden="true">THE GOOD TIMES, ON REPEAT</span>
    </div>
    <div className="booth-gallery-controls" aria-label="Photo gallery controls">
      <button type="button" aria-label="Zoom out of photo gallery" onClick={() => camera.current?.zoomBy(-0.3)}>−</button>
      <button type="button" aria-label="Zoom into photo gallery" onClick={() => camera.current?.zoomBy(0.3)}>+</button>
      <button type="button" aria-label="Reset photo gallery" onClick={() => camera.current?.reset()}>Reset</button>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Play' : 'Pause'}</button>
    </div>
  </>;
}

export function initPhotoBooth() {
  const mount = document.querySelector('#booth-gallery-root');
  if (!mount) return;
  createRoot(mount).render(<PhotoBoothScreen />);
  document.querySelectorAll('.booth-paper-strip > span').forEach((photo, index) => {
    photo.style.backgroundImage = `url("${images[index].src}")`;
  });
}
