import React from 'react';
import { createRoot } from 'react-dom/client';
import './wedding-heading.css';

function WeddingHeading() {
  return <div className="wedding-bloom-heading">
    <h2 className="section-title">Your Love Story,<br /><span className="accent">Elegantly Told.</span></h2>
  </div>;
}

export function initWeddingHeading() {
  const mount = document.querySelector('#wedding-bloom-heading');
  if (mount) createRoot(mount).render(<WeddingHeading />);
}
