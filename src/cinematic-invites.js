import { getStoryStyle } from './story-styles.js';

const style = getStoryStyle(new URLSearchParams(location.search).get('style'));
const full = new URLSearchParams(location.search).get('view') === 'full';
const form = document.querySelector('#details');
const scroll = document.querySelector('#story-scroll');
const track = document.querySelector('.story-track');
const stage = document.querySelector('#stage');
const draftKey = `sundown-story-draft-${style.id}`;
const clamp = n => Math.min(1, Math.max(0, n));
const state = { opened: false, opening: 0, playing: false, hold: null, lastFrame: 0, photoUrls: [] };

document.body.classList.add('cinematic', `story-${style.id}`);
if (full) document.body.classList.add('full-view');
document.title = `${style.name} | Sundown Press`;
document.querySelector('.editor h1').textContent = style.name;
document.querySelector('.editor .eyebrow').textContent = `${style.category.toUpperCase()} / INTERACTIVE STORY`;
document.querySelector('.editor .lead').textContent = 'Tap to open. The story plays automatically and pauses for your reveals. Scroll inside the preview to explore at your own pace.';
document.querySelector('.site-bar span').textContent = `SUNDOWN PRESS / ${style.name.toUpperCase()}`;
document.querySelector('.preview-footnote a').href = `/royal-story.html?style=${style.id}&view=full`;
document.querySelector('.preview-heading span:last-child').textContent = 'TAP TO BEGIN';
form.querySelector('[name="bridePhoto"]').closest('label').firstChild.textContent = 'First portrait';
form.querySelector('[name="groomPhoto"]').closest('label').firstChild.textContent = 'Second portrait';

const portraits = `<div class="cinema-portraits"><div class="portrait-frame"><img data-photo="bride" alt="Bride portrait"><span data-initial="first">A</span></div><span class="portrait-amp">&</span><div class="portrait-frame"><img data-photo="groom" alt="Groom portrait"><span data-initial="second">A</span></div></div>`;
const name = '<h2 data-field="names"></h2>';
const date = '<div class="invite-date"><strong data-field="date"></strong><span data-field="time"></span></div>';
const venue = '<strong data-field="venue"></strong>';
const opening = {
  royal: '<div class="opening-palace"><div class="opening-world"><div class="palace-sky"></div><div class="palace-far"></div><div class="palace-aisle"></div><div class="palace-canopy"></div></div><div class="opening-door left"></div><div class="opening-door right"></div></div>',
  velvet: '<div class="opening-book"><div class="book-pages"></div><div class="book-cover"><span>THE VELVET CHAPTER</span><b>✦</b></div></div>',
  garden: '<div class="opening-garden"><div class="garden-moon"></div><div class="garden-arch"></div><div class="garden-vines left"></div><div class="garden-vines right"></div><div class="garden-floor"></div></div>',
  letter: '<div class="opening-envelope"><div class="envelope-letter"><span>FOR YOU</span><b>With love</b></div><div class="envelope-body"></div><div class="envelope-flap"></div><div class="envelope-seal">✦</div></div>',
  confetti: '<div class="opening-gift"><div class="gift-rays"></div><div class="gift-box"></div><div class="gift-lid"></div><div class="gift-sparks">✧ ✦ ✧</div></div>',
  lantern: '<div class="opening-lights"><div class="lights-moon"></div><div class="lights-road"></div><i></i><i></i><i></i><i></i><i></i></div>',
};

function panel(kind, eyebrow, title, body) {
  return `<section class="cinema-scene scene-${kind}" aria-label="${eyebrow}"><div class="cinema-content"><span class="cinema-kicker">${eyebrow}</span><h2>${title}</h2>${body}</div></section>`;
}
function reveal(kind, eyebrow, title, inner, action) {
  return panel(kind, eyebrow, title, `<div class="reveal-object"><div class="reveal-inner">${inner}</div><button type="button" class="reveal-action">${action}</button></div><p class="cinema-hint">Tap the object to reveal</p>`);
}
const eventList = (labels = style.events) => `<div class="cinema-events">${labels.map((event, index) => `<article><span>0${index + 1}</span><h3>${event}</h3><p>${['The first beautiful moment.', 'A night to remember.', 'The celebration continues.'][index]}</p></article>`).join('')}</div>`;
const stories = {
  royal: [
    panel('royal-welcome', 'THE ROYAL INVITATION', 'A celebration awaits', `<div class="cinema-crest">✦</div>${name}<p data-field="message"></p>`),
    panel('royal-portraits', 'TOGETHER WITH THEIR FAMILIES', 'A story of two hearts', `${portraits}<p data-field="names"></p>`),
    reveal('royal-date', 'SAVE THE DATE', 'Pull the golden tassel', `<span>THE WEDDING OF</span>${name}<div class="secret">${date}</div>`, 'Pull the tassel'),
    panel('royal-events', 'THE FESTIVITIES', 'Days to remember', eventList()),
    panel('royal-venue', 'THE DESTINATION', 'The palace awaits', `<div class="scratch-card"><div class="scratch-under"><span>JOIN US AT</span>${venue}</div><canvas class="scratch-surface" aria-label="Scratch the gold surface to reveal the venue"></canvas></div><button type="button" class="scratch-reveal">Reveal venue</button><p class="cinema-hint">Scratch the gold card or tap reveal</p>`),
    panel('royal-finale', 'WITH LOVE', 'We cannot wait to celebrate with you.', `<p data-field="names"></p><a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
  velvet: [
    panel('velvet-chapter', 'CHAPTER ONE', 'The beginning of forever', `${name}<p data-field="message"></p>`),
    panel('velvet-gallery', 'CHAPTER TWO', 'The people in our pages', portraits),
    reveal('velvet-date', 'CHAPTER THREE', 'A date to keep', `<span>OUR WEDDING DAY</span><div class="secret">${date}</div>`, 'Turn the page'),
    panel('velvet-vow', 'CHAPTER FOUR', 'A promise written in gold', '<div class="vow-page"><span>✦</span><p>Every page led us here. The next one begins with you beside us.</p></div>'),
    panel('velvet-events', 'CHAPTER FIVE', 'The celebrations', eventList()),
    panel('velvet-finale', 'THE LAST PAGE', 'Meet us there', `${venue}<p data-field="date"></p><a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
  garden: [
    panel('garden-seed', 'BENEATH THE STARS', 'Something beautiful is growing', `${name}<p data-field="message"></p>`),
    panel('garden-bloom', 'A NEW BEGINNING', 'From one small moment', '<div class="bloom-art" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>Into a lifetime of memories.</p>'),
    panel('garden-portraits', 'IN FULL BLOOM', 'Our story, together', portraits),
    reveal('garden-date', 'THE BLOOMING DAY', 'Let the flowers part', `<div class="secret">${date}</div>`, 'Open the blooms'),
    panel('garden-events', 'FOLLOW THE GARDEN PATH', 'A trail of celebrations', eventList()),
    panel('garden-finale', 'UNDER THE MOONLIGHT', 'Meet us in the garden', `${venue}<a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
  letter: [
    panel('letter-note', 'DEAR FRIEND', 'We have news to share', `<p data-field="message"></p><span class="letter-signature" data-field="names"></span>`),
    panel('letter-photo', 'A LITTLE ABOUT US', 'Two lives, one promise', portraits),
    reveal('letter-date', 'A PERSONAL NOTE', 'Untie the ribbon', `<span>PLEASE SAVE</span><div class="secret">${date}</div>`, 'Untie the ribbon'),
    panel('letter-finale', 'WITH LOVE', 'We hope you will join us', `${venue}<a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
  confetti: [
    panel('confetti-pop', 'A LITTLE SURPRISE', 'It is time to celebrate', `${name}<p data-field="message"></p>`),
    reveal('confetti-date', 'MARK THE MOMENT', 'Pop the surprise', `<span>THE BIG DAY</span><div class="secret">${date}</div>`, 'Pop to reveal'),
    panel('confetti-memories', 'THE PEOPLE WHO MATTER', 'Made brighter together', portraits),
    panel('confetti-party', 'THE PARTY PLAN', 'Make every moment count', eventList()),
    panel('confetti-finale', 'SEE YOU THERE', 'Bring your brightest self', `${venue}<a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
  lantern: [
    panel('lantern-path', 'FOLLOW THE LIGHTS', 'The way to our gathering', '<div class="lantern-trail"><i></i><i></i><i></i><i></i></div>'),
    panel('lantern-welcome', 'AN EVENING OF LIGHT', 'Let the night glow', `${name}<p data-field="message"></p>`),
    reveal('lantern-date', 'A NIGHT TO SHARE', 'Light the lantern', `<div class="secret">${date}</div>`, 'Light the lantern'),
    panel('lantern-family', 'GATHER TOGETHER', 'The people make the night', portraits),
    panel('lantern-gathering', 'TOGETHER AGAIN', 'An evening in three moments', eventList()),
    panel('lantern-finale', 'THE LIGHTS ARE ON', 'We will be waiting', `${venue}<a class="cinema-directions" target="_blank" rel="noopener noreferrer" hidden>Get directions</a>`),
  ],
};

stage.innerHTML = `<div class="cinema-layer cinema-opening"><div class="opening-art">${opening[style.id]}</div><div class="opening-caption"><span>${style.category.toUpperCase()} / ${style.name.toUpperCase()}</span><h2>${style.name}</h2><button type="button" id="open-story">Tap to open</button></div></div>${stories[style.id].join('')}<button type="button" id="play-pause" class="cinema-play" hidden aria-label="Pause story">Pause</button><div class="cinema-progress" aria-hidden="true"><span></span></div>`;
const scenes = [...stage.querySelectorAll('.cinema-scene')];
// Template-owned ambient animation. Each scene gets a distinct looping moment;
// editable invitation details remain separate DOM content above the artwork.
const ambient = scenes.map((scene, sceneIndex) => {
  const canvas = document.createElement('canvas');
  canvas.className = 'cinema-ambient';
  canvas.setAttribute('aria-hidden', 'true');
  scene.prepend(canvas);
  const seed = sceneIndex * 79 + style.id.length * 31;
  const random = n => {
    const value = Math.sin(seed + n * 127.1) * 43758.5453;
    return value - Math.floor(value);
  };
  const count = style.id === 'confetti' ? 48 : style.id === 'garden' ? 36 : 26;
  const particles = Array.from({ length:count }, (_, i) => ({
    x:random(i * 5), y:random(i * 5 + 1), size:2 + random(i * 5 + 2) * (style.id === 'confetti' ? 8 : 5),
    speed:.35 + random(i * 5 + 3) * .7, phase:random(i * 5 + 4) * Math.PI * 2,
  }));
  return { canvas, scene, sceneIndex, particles };
});
let ambientFrame = 0;
function animateAmbient(now) {
  if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ambientFrame = requestAnimationFrame(animateAmbient);
    return;
  }
  const active = ambient.find(item => item.scene.getAttribute('aria-hidden') === 'false');
  if (active) {
    const { canvas, particles, sceneIndex } = active;
    const width = Math.round(canvas.clientWidth * Math.min(devicePixelRatio || 1, 2));
    const height = Math.round(canvas.clientHeight * Math.min(devicePixelRatio || 1, 2));
    if (width && height) {
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      particles.forEach((p, index) => {
        const travel = (p.y + t * p.speed * .08) % 1;
        const x = (p.x + Math.sin(t * .8 + p.phase) * .025) * width;
        const y = (style.id === 'garden' || style.id === 'lantern' ? 1 - travel : travel) * height;
        const radius = p.size * width / 450;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * (index % 2 ? .55 : -.42) + p.phase);
        ctx.globalAlpha = (.25 + .4 * (1 + Math.sin(t * 2 + p.phase)) / 2) * (sceneIndex % 2 ? .85 : 1);
        if (style.id === 'confetti') {
          ctx.fillStyle = ['#ffe0a3', '#ff789a', '#87d5db', '#f9f2ce'][index % 4];
          ctx.fillRect(-radius, -radius * .6, radius * 2, radius * 1.2);
        } else if (style.id === 'garden') {
          ctx.fillStyle = index % 3 ? '#fff0b4' : '#eab2c2';
          if (index % 3) { ctx.shadowBlur = radius * 6; ctx.shadowColor = '#ffe395'; ctx.beginPath(); ctx.arc(0, 0, radius * .52, 0, Math.PI * 2); ctx.fill(); }
          else { ctx.beginPath(); ctx.ellipse(0, 0, radius * .6, radius * 1.5, .4, 0, Math.PI * 2); ctx.fill(); }
        } else if (style.id === 'lantern') {
          ctx.fillStyle = '#ffd890'; ctx.shadowBlur = radius * 8; ctx.shadowColor = '#ffc075';
          ctx.beginPath(); ctx.ellipse(0, 0, radius * .6, radius, 0, 0, Math.PI * 2); ctx.fill();
        } else if (style.id === 'letter') {
          ctx.fillStyle = '#fff8e6'; ctx.fillRect(-radius * .7, -radius * .25, radius * 1.4, radius * .5);
        } else {
          ctx.fillStyle = style.id === 'velvet' ? '#efd3a2' : '#f6cda8';
          ctx.shadowBlur = radius * 4; ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath(); ctx.arc(0, 0, radius * .5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
    }
  }
  ambientFrame = requestAnimationFrame(animateAmbient);
}
ambientFrame = requestAnimationFrame(animateAmbient);
scroll.style.overflowY = 'hidden';

function size() {
  const h = scroll.clientHeight;
  track.style.setProperty('--track-height', `${h * (scenes.length + 1)}px`);
  stage.style.height = `${h}px`;
  updateTimeline();
}
function updateTimeline() {
  const progress = scroll.scrollTop / (scroll.clientHeight || 1);
  stage.style.setProperty('--opening', state.opening);
  stage.style.setProperty('--world-scale', String(1 + state.opening * .12));
  const left = Math.round(state.opening * -79);
  stage.style.setProperty('--door-left', `${left}deg`);
  stage.style.setProperty('--door-right', `${-left}deg`);
  stage.style.setProperty('--cover-angle', `${Math.round(state.opening * -156)}deg`);
  stage.style.setProperty('--flap-angle', `${Math.round(state.opening * 168)}deg`);
  stage.style.setProperty('--lift', `${Math.round(state.opening * -190)}px`);
  stage.style.setProperty('--part', `${Math.round(state.opening * 115)}px`);
  stage.querySelector('.cinema-opening').style.opacity = String(1 - clamp((progress - .48) * 1.85));
  scenes.forEach((scene, index) => {
    const distance = Math.abs(progress - (index + 1));
    const visibility = clamp((.5 - distance) / .16);
    scene.style.opacity = String(visibility);
    scene.style.transform = `scale(${1.055 - visibility * .055}) translateY(${Math.round((1 - visibility) * 22)}px)`;
    scene.style.pointerEvents = visibility > .85 ? 'auto' : 'none';
    scene.setAttribute('aria-hidden', String(visibility < .5));
    const video = scene.querySelector('.scene-media video');
    if (video) {
      if (visibility > .6 && state.opened) video.play().catch(() => {});
      else video.pause();
    }
  });
  stage.querySelector('.cinema-progress span').style.width = `${clamp(progress / scenes.length) * 100}%`;
}
function playOpen() {
  if (state.opened) return;
  state.opened = true;
  stage.querySelector('#open-story').disabled = true;
  const openingVideo = stage.querySelector('.cinema-opening .scene-media video');
  if (openingVideo) { openingVideo.currentTime = 0; openingVideo.play().catch(() => {}); }
  const start = performance.now();
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : openingVideo?.duration && Number.isFinite(openingVideo.duration) ? Math.min(12000, Math.max(1000, openingVideo.duration * 1000)) : 1750;
  function frame(now) {
    const t = clamp((now - start) / duration);
    state.opening = 1 - (1 - t) ** 3;
    updateTimeline();
    if (t < 1) requestAnimationFrame(frame);
    else {
      stage.querySelector('.cinema-opening').style.pointerEvents = 'none';
      scroll.style.overflowY = 'auto';
      document.querySelector('#play-pause').hidden = false;
      document.querySelector('.preview-heading span:last-child').textContent = 'PLAYING THE STORY';
      if (duration > 100) playStory();
      else { scroll.scrollTop = scroll.clientHeight; updateTimeline(); }
    }
  }
  requestAnimationFrame(frame);
}
stage.querySelector('#open-story').addEventListener('click', playOpen);
const playback = stage.querySelector('#play-pause');
function pauseStory() {
  state.playing = false;
  playback.textContent = 'Play';
  playback.setAttribute('aria-label', 'Play story');
  document.querySelector('.preview-heading span:last-child').textContent = 'SCROLL OR PLAY';
}
function playStory() {
  if (!state.opened || state.playing) return;
  state.playing = true;
  state.lastFrame = 0;
  playback.textContent = 'Pause';
  playback.setAttribute('aria-label', 'Pause story');
  document.querySelector('.preview-heading span:last-child').textContent = 'PLAYING THE STORY';
  requestAnimationFrame(advance);
}
function advance(now) {
  if (!state.playing) return;
  const elapsed = state.lastFrame ? now - state.lastFrame : 0;
  state.lastFrame = now;
  const previous = scroll.scrollTop / scroll.clientHeight;
  let progress = previous + elapsed / 2600;
  const nextReveal = [...scenes].findIndex((scene, index) => index + 1 >= previous - .001 && index + 1 <= progress && scene.querySelector('.reveal-object:not(.is-revealed), .scratch-card:not(.is-revealed)'));
  if (nextReveal >= 0) {
    progress = nextReveal + 1;
    state.hold = nextReveal;
    pauseStory();
  }
  scroll.scrollTop = Math.min(progress * scroll.clientHeight, scenes.length * scroll.clientHeight);
  updateTimeline();
  if (progress >= scenes.length) pauseStory();
  else if (state.playing) requestAnimationFrame(advance);
}
playback.addEventListener('click', () => state.playing ? pauseStory() : playStory());
scroll.addEventListener('wheel', () => { if (state.playing) pauseStory(); }, { passive:true });
scroll.addEventListener('touchstart', () => { if (state.playing) pauseStory(); }, { passive:true });

function dateText(value) {
  const [year, month, day] = (value || '').split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? 'Your date' : new Intl.DateTimeFormat('en-IN', { day:'numeric', month:'long', year:'numeric' }).format(parsed);
}
function updateFields() {
  const values = Object.fromEntries(new FormData(form));
  for (const node of stage.querySelectorAll('[data-field]')) node.textContent = node.dataset.field === 'date' ? dateText(values.date) : node.dataset.field === 'time' ? (values.time ? new Intl.DateTimeFormat('en-IN', { hour:'numeric', minute:'2-digit', hour12:true }).format(new Date(`2000-01-01T${values.time}:00`)) : '') : (values[node.dataset.field] || '');
  const parts = (values.names || '').split(/\s*(?:&| and )\s*/i);
  stage.querySelectorAll('[data-initial="first"]').forEach(node => { node.textContent = (parts[0] || 'A').trim()[0]?.toUpperCase() || 'A'; });
  stage.querySelectorAll('[data-initial="second"]').forEach(node => { node.textContent = (parts[1] || parts[0] || 'A').trim()[0]?.toUpperCase() || 'A'; });
  for (const link of stage.querySelectorAll('.cinema-directions')) {
    link.hidden = !/^https:\/\//i.test(values.map || '');
    if (!link.hidden) link.href = values.map;
    else link.removeAttribute('href');
  }
  try { localStorage.setItem(draftKey, JSON.stringify({ names:values.names, message:values.message, date:values.date, time:values.time, venue:values.venue, map:values.map })); } catch { /* Optional local draft. */ }
}
for (const object of stage.querySelectorAll('.reveal-object')) {
  object.setAttribute('role', 'button');
  object.setAttribute('tabindex', '0');
  object.setAttribute('aria-label', 'Reveal invitation detail');
  function revealObject() {
    if (object.classList.contains('is-revealed')) return;
    object.classList.add('is-revealed');
    object.setAttribute('aria-label', 'Invitation detail revealed');
    object.closest('.cinema-scene').querySelector('.cinema-hint').textContent = 'Revealed';
    if (state.hold !== null) { state.hold = null; setTimeout(playStory, 550); }
  }
  object.addEventListener('click', revealObject);
  object.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); revealObject(); }
  });
}

const scratchCard = stage.querySelector('.scratch-card');
if (scratchCard) {
  const canvas = scratchCard.querySelector('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently:true });
  let drawing = false;
  let strokes = 0;
  function paintScratch() {
    if (scratchCard.classList.contains('is-revealed')) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    ctx.fillStyle = '#b18c56'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const shine = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    shine.addColorStop(0, '#e9cf94'); shine.addColorStop(.5, '#b08754'); shine.addColorStop(1, '#f0d8a1');
    ctx.fillStyle = shine; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#674531'; ctx.textAlign = 'center';
    ctx.font = `${Math.round(15 * ratio)}px Georgia, serif`;
    ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
  }
  function finishScratch() {
    scratchCard.classList.add('is-revealed');
    canvas.style.pointerEvents = 'none';
    scratchCard.closest('.cinema-scene').querySelector('.cinema-hint').textContent = 'The destination is revealed';
    if (state.hold !== null) { state.hold = null; setTimeout(playStory, 650); }
  }
  function scratchAt(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = canvas.width * .14;
    ctx.lineTo(x, y); ctx.stroke();
    strokes++;
    if (strokes > 22) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      for (let i = 3; i < pixels.length; i += 40) if (pixels[i] < 80) cleared++;
      if (cleared / (pixels.length / 40) > .38) finishScratch();
    }
  }
  canvas.addEventListener('pointerdown', event => {
    drawing = true; canvas.setPointerCapture(event.pointerId);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath(); ctx.moveTo((event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height);
    scratchAt(event);
  });
  canvas.addEventListener('pointermove', event => { if (drawing) scratchAt(event); });
  canvas.addEventListener('pointerup', () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener('pointercancel', () => { drawing = false; ctx.beginPath(); });
  scratchCard.closest('.cinema-scene').querySelector('.scratch-reveal').addEventListener('click', finishScratch);
  new ResizeObserver(paintScratch).observe(canvas);
  document.querySelector('#restart').addEventListener('click', () => { scratchCard.classList.remove('is-revealed'); canvas.style.pointerEvents = ''; strokes = 0; paintScratch(); });
}

function photoDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sundown-royal-story', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('portraits');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function showPhoto(index, blob) {
  if (state.photoUrls[index]) URL.revokeObjectURL(state.photoUrls[index]);
  state.photoUrls[index] = blob?.type.startsWith('image/') ? URL.createObjectURL(blob) : null;
  stage.querySelectorAll(`[data-photo="${index ? 'groom' : 'bride'}"]`).forEach(image => {
    image.src = state.photoUrls[index] || `/images/invites/sample-${index ? 'groom' : 'bride'}.svg`;
  });
}
async function persistPhoto(index, blob) {
  try {
    const db = await photoDb();
    const tx = db.transaction('portraits', 'readwrite');
    tx.objectStore('portraits').put(blob || null, `${style.id}-${index ? 'groomPhoto' : 'bridePhoto'}`);
    tx.oncomplete = () => db.close();
  } catch { /* Local preview still works. */ }
}
async function restorePhotos() {
  try {
    const db = await photoDb();
    for (let index = 0; index < 2; index++) {
      const request = db.transaction('portraits').objectStore('portraits').get(`${style.id}-${index ? 'groomPhoto' : 'bridePhoto'}`);
      const blob = await new Promise(resolve => { request.onsuccess = () => resolve(request.result); request.onerror = () => resolve(null); });
      if (blob) showPhoto(index, blob);
    }
    db.close();
  } catch { /* Photos are optional. */ }
}
['bridePhoto', 'groomPhoto'].forEach((name, index) => form.elements.namedItem(name).addEventListener('change', event => {
  const blob = event.target.files?.[0];
  showPhoto(index, blob); persistPhoto(index, blob);
}));

try {
  const saved = JSON.parse(localStorage.getItem(draftKey));
  const defaults = saved || { names:style.names, date:style.date, venue:style.venue, time:'18:30', message:style.category === 'Weddings' ? 'Together with our families, we invite you to celebrate our wedding.' : 'Join us for a celebration made to share.' };
  for (const [key, value] of Object.entries(defaults)) if (form.elements.namedItem(key) && typeof value === 'string') form.elements.namedItem(key).value = value;
} catch { /* Use the form defaults. */ }
form.addEventListener('input', updateFields);
scroll.addEventListener('scroll', updateTimeline, { passive:true });
new ResizeObserver(size).observe(scroll);
document.querySelector('#restart').addEventListener('click', () => { pauseStory(); scroll.scrollTop = 0; scroll.style.overflowY = 'hidden'; state.opened = false; state.opening = 0; state.hold = null; playback.hidden = true; stage.querySelector('.cinema-opening').style.pointerEvents = 'auto'; stage.querySelector('#open-story').disabled = false; stage.querySelectorAll('.reveal-object').forEach(node => node.classList.remove('is-revealed')); updateTimeline(); });
showPhoto(0); showPhoto(1); updateFields(); restorePhotos(); requestAnimationFrame(size);
