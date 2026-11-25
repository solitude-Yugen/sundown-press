export function initServiceShowcases() {
  const featureStrip = document.querySelector('.wedding-features');
  if (featureStrip) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      featureStrip.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(featureStrip);
  }
  const books = [...document.querySelectorAll('.occasion-book')];
  books.forEach(book => book.addEventListener('click', () => {
    const opening = !book.classList.contains('is-open');
    books.forEach(item => {
      const active = item === book && opening;
      item.classList.toggle('is-open', active);
      item.setAttribute('aria-expanded', String(active));
    });
  }));

  const turntable = document.querySelector('.sample-turntable');
  const pause = turntable?.querySelector('.rotation-toggle');
  pause?.addEventListener('click', () => {
    const paused = turntable.classList.toggle('is-paused');
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume rotation' : 'Pause rotation';
  });

  const stack = document.querySelector('.invitation-stack-wrap');
  const toggle = stack?.querySelector('.stack-toggle');
  if (!stack || !toggle) return;
  let pinned = false;
  const show = open => {
    stack.classList.toggle('is-expanded', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => { pinned = !pinned; show(pinned); });
  stack.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(true); });
  stack.addEventListener('pointerleave', () => {
    if (!pinned && !stack.contains(document.activeElement)) show(false);
  });
  stack.addEventListener('focusin', () => show(true));
  stack.addEventListener('focusout', e => { if (!pinned && !stack.contains(e.relatedTarget)) show(false); });
  stack.addEventListener('keydown', e => {
    if (e.key === 'Escape') { pinned = false; toggle.focus(); show(false); }
  });
}
