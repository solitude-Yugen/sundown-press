import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useReducedMotion } from 'framer-motion';
import BloomWaveText from './components/originkit/ui/bloom-wave-text';
import '../css/originkit-tailwind.css';
import './wedding-heading.css';

const palette = {
  blue: '#1a5e5f', green: '#71856a', orange: '#d4a03c',
  pink: '#d9a5a6', cream: '#efe4cd', hover: 24,
};

function WeddingHeading() {
  const reducedMotion = useReducedMotion();
  const root = useRef(null);
  const [fontSize, setFontSize] = useState(64);
  useEffect(() => {
    // Use the computed font size so clamp() resolves consistently at every width.
    const read = () => setFontSize(parseFloat(getComputedStyle(root.current).fontSize));
    read();
    const observer = new ResizeObserver(read);
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <div className="wedding-bloom-heading" ref={root}>
    <h2 className={reducedMotion ? 'section-title' : 'wedding-bloom-accessible'}>
      Your Love Story,<br /><span className="accent">Elegantly Told.</span>
    </h2>
    {!reducedMotion && <div aria-hidden="true">
      {[
        { text: 'Your Love Story,', ink: '#0f3d3e', weight: 300, fontStyle: 'normal' },
        { text: 'Elegantly Told.', ink: '#b8860b', weight: 500, fontStyle: 'italic' },
      ].map(line => <div className="wedding-bloom-line" key={line.text}>
        <BloomWaveText text={line.text} ink={line.ink} background="transparent"
          font={{ fontFamily: 'Cormorant Garamond', fontWeight: line.weight, fontStyle: line.fontStyle, fontSize, lineHeight: 1 }}
          style={{ minWidth: 0, minHeight: 0, width: '100%', height: '100%' }}
          speed={32} hold={1.8} autoPlay={true} density={55} flowerSize={68} advanced={palette} />
      </div>)}
    </div>}
  </div>;
}

export function initWeddingHeading() {
  const mount = document.querySelector('#wedding-bloom-heading');
  if (mount) createRoot(mount).render(<WeddingHeading />);
}
