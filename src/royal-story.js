import { getStoryStyle } from './story-styles.js';
const style = getStoryStyle(new URLSearchParams(location.search).get('style'));
document.body.classList.add(`story-${style.id}`);
document.title = `${style.name} | Sundown Press`;
document.querySelector('.editor .eyebrow').textContent = `${style.category.toUpperCase()} / INTERACTIVE INVITATION`;
document.querySelector('.editor h1').textContent = style.name;
document.querySelector('.site-bar span').textContent = `SUNDOWN PRESS / ${style.name.toUpperCase()}`;
document.querySelector('.preview-footnote a').href = `royal-story.html?style=${style.id}&view=full`;
document.querySelector('.scene-intro>div>p:first-of-type').textContent = style.category === 'Weddings' ? 'TOGETHER WITH THEIR FAMILIES' : 'YOU ARE INVITED';
document.querySelector('.scene-portraits .scene-label').textContent = style.category === 'Weddings' || style.category === 'Engagements' ? 'A STORY WRITTEN TOGETHER' : 'THE PEOPLE BEHIND THE CELEBRATION';
document.querySelector('.scene-portraits h2').textContent = style.category === 'Weddings' || style.category === 'Engagements' ? 'Two hearts, one beginning.' : 'Made for unforgettable moments.';
document.querySelector('.bride figcaption').textContent = style.category === 'Weddings' ? 'THE BRIDE' : 'YOUR MOMENT';
document.querySelector('.groom figcaption').textContent = style.category === 'Weddings' ? 'THE GROOM' : 'YOUR PEOPLE';
document.querySelectorAll('.event-card strong').forEach((item, index) => { item.textContent = style.events[index]; });
document.querySelector('.scene-scroll .scene-label').textContent = style.category === 'Weddings' ? 'A DATE TO REMEMBER' : 'MARK YOUR CALENDAR';
document.querySelector('.scroll-body>span').textContent = style.category === 'Weddings' ? 'THE WEDDING OF' : 'CELEBRATING';
const openingLabels = { royal: ['THE CELEBRATION BEGINS', 'Beyond these doors'], velvet: ['A STORY IN THE MAKING', 'Open the first chapter'], garden: ['WHERE LOVE GROWS', 'Follow the garden path'], letter: ['A PERSONAL INVITATION', 'A letter for you'], confetti: ['A DAY TO CELEBRATE', 'Open your surprise'], lantern: ['FOLLOW THE LIGHT', 'An evening awaits'] };
document.querySelector('.gate-copy span').textContent = openingLabels[style.id][0];
document.querySelector('.gate-copy h2').textContent = openingLabels[style.id][1];
if (style.id !== 'royal') {
  const opener = document.createElement('div');
  opener.className = `variant-opening opening-${style.id}`;
  opener.setAttribute('aria-hidden', 'true');
  opener.innerHTML = ({
    velvet: '<div class="book-back"></div><div class="book-pages"></div><div class="book-cover"><span>THE VELVET CHAPTER</span><b>✦</b></div>',
    garden: '<div class="garden-moon"></div><div class="garden-arch"></div><div class="garden-vines left"></div><div class="garden-vines right"></div><div class="garden-floor"></div>',
    letter: '<div class="letter-paper"><span>YOU ARE INVITED</span><b>With love</b></div><div class="envelope-back"></div><div class="envelope-front"></div><div class="envelope-flap"></div><div class="wax-seal">✦</div>',
    confetti: '<div class="gift-glow"></div><div class="gift-lid"></div><div class="gift-box"><span>✳</span></div><div class="gift-sparks">✦ ✧ ✦ ✧ ✦</div>',
    lantern: '<div class="lantern-moon"></div><div class="lantern-path"></div><div class="lanterns"><i></i><i></i><i></i><i></i><i></i></div><div class="lantern-gate"></div>',
  })[style.id];
  document.querySelector('.scene-gate').prepend(opener);
}
const scroll = document.querySelector('#story-scroll');
const stage = document.querySelector('#stage');
const form = document.querySelector('#details');
const tassel = document.querySelector('#tassel');
const scrollScene = document.querySelector('.scene-scroll');
const canvas = document.querySelector('#scratch');
const context = canvas.getContext('2d', { willReadFrequently: true });
const storageKey = `sundown-story-draft-${style.id}`;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
let revealed = false;
let scratching = false;
let lastPoint = null;
let pullStart = null;
const photoUrls = { bridePhoto: null, groomPhoto: null };
function photoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sundown-royal-story', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('portraits');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function storePhoto(name, file) {
  try {
    const db = await photoDatabase();
    const transaction = db.transaction('portraits', 'readwrite');
    transaction.objectStore('portraits').put(file || null, `${style.id}-${name}`);
    transaction.oncomplete = () => db.close();
  } catch { /* Preview still works when browser storage is unavailable. */ }
}
function showPhoto(name, file) {
  if (photoUrls[name]) URL.revokeObjectURL(photoUrls[name]);
  const image = document.querySelector(name === 'bridePhoto' ? '#bride-preview' : '#groom-preview');
  photoUrls[name] = file?.type.startsWith('image/') ? URL.createObjectURL(file) : null;
  image.hidden = !photoUrls[name];
  if (photoUrls[name]) image.src = photoUrls[name];
  else image.removeAttribute('src');
}
async function restorePhotos() {
  try {
    const db = await photoDatabase();
    for (const name of ['bridePhoto', 'groomPhoto']) {
      const file = await new Promise(resolve => {
        const request = db.transaction('portraits').objectStore('portraits').get(`${style.id}-${name}`);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
      if (file) showPhoto(name, file);
    }
    db.close();
  } catch { /* Local photos are optional. */ }
}

function dimensions() {
  const height = scroll.clientHeight;
  scroll.style.setProperty('--scene-height', `${height}px`);
  updateScroll();
}

function updateScroll() {
  const height = scroll.clientHeight || 1;
  const progress = scroll.scrollTop / height;
  stage.style.setProperty('--gate-hold', `${Math.round(Math.min(scroll.scrollTop, height))}px`);
  stage.style.setProperty('--gate-visibility', String(1 - clamp((progress - .86) * 7)));
  stage.style.setProperty('--world-zoom', String(1 + clamp(progress / .9) * .22));
  stage.style.setProperty('--opening-progress', String(clamp(progress / .9)));
  stage.style.setProperty('--cover-angle', `${Math.round(clamp(progress / .85) * -155)}deg`);
  stage.style.setProperty('--flap-angle', `${Math.round(clamp(progress / .75) * 165)}deg`);
  stage.style.setProperty('--reveal-lift', `${Math.round(clamp(progress / .85) * -145)}px`);
  stage.style.setProperty('--vines-open', `${Math.round(clamp(progress / .85) * 90)}px`);
  stage.style.setProperty('--gift-lift', `${Math.round(clamp(progress / .8) * -180)}px`);
  const angle = Math.round(clamp(progress / .9) * 78);
  stage.style.setProperty('--door-left', `${-angle}deg`);
  stage.style.setProperty('--door-right', `${angle}deg`);
  stage.style.setProperty('--gate-zoom', String(1 + clamp(progress / 1.1) * .22));
  stage.style.setProperty('--gate-copy', String(1 - clamp(progress * 1.6)));
  stage.style.setProperty('--intro-opacity', String(clamp((progress - .65) * 2.2)));
  stage.style.setProperty('--intro-offset', `${Math.round((1 - clamp((progress - .65) * 2.2)) * 32)}px`);
  stage.style.setProperty('--portrait-opacity', String(clamp((progress - 1.65) * 2)));
  stage.style.setProperty('--card-rise', `${Math.round((1 - clamp((progress - 3.8) * 2)) * 35)}px`);
  stage.style.setProperty('--card-opacity', String(clamp((progress - 3.8) * 2)));
}

function formatDate(value) {
  if (!value) return 'Your wedding date';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? 'Your wedding date' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function updateDetails() {
  const fields = Object.fromEntries(new FormData(form));
  const date = formatDate(fields.date);
  for (const element of document.querySelectorAll('[data-field]')) {
    const key = element.dataset.field;
    element.textContent = key === 'date' ? date : key === 'time' ? (fields.time || '') : (fields[key] || '');
  }
  const names = (fields.names || '').split(/\s*(?:&| and )\s*/i);
  document.querySelector('.bride .portrait-placeholder').textContent = (names[1] || 'B').trim().charAt(0).toUpperCase();
  document.querySelector('.groom .portrait-placeholder').textContent = (names[0] || 'G').trim().charAt(0).toUpperCase();
  const directions = document.querySelector('#directions');
  directions.hidden = !/^https:\/\//i.test(fields.map || '');
  if (!directions.hidden) directions.href = fields.map;
  else directions.removeAttribute('href');
  try { localStorage.setItem(storageKey, JSON.stringify(fields)); } catch { /* Local storage is optional. */ }
}

function revealDate() {
  if (revealed) return;
  revealed = true;
  scrollScene.classList.add('revealed');
  document.querySelector('#tassel-hint').textContent = 'The date is revealed';
  tassel.style.setProperty('--pull', '30px');
}

tassel.addEventListener('click', revealDate);
tassel.addEventListener('pointerdown', event => {
  pullStart = event.clientY;
  tassel.setPointerCapture(event.pointerId);
});
tassel.addEventListener('pointermove', event => {
  if (pullStart === null || revealed) return;
  const distance = clamp(event.clientY - pullStart, 0, 85);
  tassel.style.setProperty('--pull', `${distance}px`);
  if (distance > 50) revealDate();
});
tassel.addEventListener('pointerup', () => { pullStart = null; if (!revealed) tassel.style.setProperty('--pull', '0px'); });
tassel.addEventListener('pointercancel', () => { pullStart = null; if (!revealed) tassel.style.setProperty('--pull', '0px'); });

function paintScratch() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  context.globalCompositeOperation = 'source-over';
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#b78956'); gradient.addColorStop(.5, '#e8cf9e'); gradient.addColorStop(1, '#ad754b');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#6e3040';
  context.textAlign = 'center';
  context.font = `${Math.round(15 * ratio)}px Georgia`;
  context.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
  canvas.hidden = false;
}

function point(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}

function scratch(event) {
  const current = point(event);
  context.globalCompositeOperation = 'destination-out';
  context.lineWidth = canvas.width * .14;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(lastPoint?.x ?? current.x, lastPoint?.y ?? current.y);
  context.lineTo(current.x, current.y);
  context.stroke();
  lastPoint = current;
}

canvas.addEventListener('pointerdown', event => { scratching = true; lastPoint = null; canvas.setPointerCapture(event.pointerId); scratch(event); });
canvas.addEventListener('pointermove', event => { if (scratching) scratch(event); });
canvas.addEventListener('pointerup', () => {
  if (!scratching) return;
  scratching = false; lastPoint = null;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;
  for (let i = 3; i < pixels.length; i += 64) if (pixels[i] < 100) cleared++;
  if (cleared > pixels.length / 64 * .42) canvas.hidden = true;
});
canvas.addEventListener('pointercancel', () => { scratching = false; lastPoint = null; });
document.querySelector('#reveal-all').addEventListener('click', () => { canvas.hidden = true; });

function replay() {
  scroll.scrollTo({ top: 0, behavior: 'smooth' });
  revealed = false;
  scrollScene.classList.remove('revealed');
  document.querySelector('#tassel-hint').textContent = 'Tap or pull the tassel';
  tassel.style.setProperty('--pull', '0px');
  paintScratch();
}
document.querySelector('#restart').addEventListener('click', replay);
document.querySelector('#replay-end').addEventListener('click', replay);
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) for (const [key, value] of Object.entries(saved)) {
    const control = form.elements.namedItem(key);
    if (control && typeof value === 'string') control.value = value;
  }
  else {
    form.elements.namedItem('names').value = style.names;
    form.elements.namedItem('date').value = style.date;
    form.elements.namedItem('venue').value = style.venue;
    form.elements.namedItem('message').value = style.category === 'Weddings' ? 'Together with our families, we invite you to celebrate our wedding.' : `Join us for ${style.name.toLowerCase()}, a celebration made to share.`;
  }
} catch { /* Ignore malformed local drafts. */ }
form.addEventListener('input', updateDetails);
for (const name of ['bridePhoto', 'groomPhoto']) {
  const input = form.elements.namedItem(name);
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    showPhoto(name, file);
    storePhoto(name, file);
  });
}
scroll.addEventListener('scroll', updateScroll, { passive: true });
new ResizeObserver(dimensions).observe(scroll);
if (new URLSearchParams(location.search).get('view') === 'full') document.body.classList.add('full-view');
updateDetails();
restorePhotos();
requestAnimationFrame(() => { dimensions(); paintScratch(); });
