import { initNavigation } from './navigation.js';
initNavigation();

const form = document.querySelector('#magazine-form');
const book = document.querySelector('#magazine-book');
const stage = document.querySelector('.magazine-stage');
const indicator = document.querySelector('#page-indicator');
const upload = document.querySelector('#magazine-photos');
const photoList = document.querySelector('#photo-list');
const sampleImages = [4307635, 30723691, 37572244, 26423890, 19119341, 16902222].map(id => `images/photobooth/${id}.avif`);
const names = { editorial:'The Editorial', heirloom:'The Heirloom', modern:'The Modern', journal:'The Journal' };
let template = 'editorial';
let page = 0;
let photos = [];
let turnTimer;
const formData = () => Object.fromEntries(new FormData(form));
const imageAt = index => photos[index]?.url || sampleImages[index % sampleImages.length];
const make = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
function textLines(value, fallback) { return (value || fallback).trim(); }
function sheet(side, type, image, headline, text, folio, date) {
  const node = make('article', `magazine-page-sheet ${side} ${type}`);
  node.setAttribute('aria-label', `${type.replace('-', ' ')} page ${folio}`);
  if (image) {
    const photo = make('div', 'page-photo');
    const img = document.createElement('img');
    img.src = image;
    img.alt = photos.some(item => item.url === image) ? 'Your uploaded photograph' : 'Sample magazine photograph';
    photo.append(img);
    node.append(photo);
  }
  const copy = make('div', 'page-copy');
  copy.append(make('h3', '', headline), make('p', '', text));
  node.append(copy);
  if (type === 'cover') node.append(make('span', 'page-brand', 'SUNDOWN PRESS / PERSONAL EDITION'));
  node.append(make('span', 'page-folio', type === 'cover' ? date : String(folio).padStart(2, '0')));
  return node;
}
function render() {
  const data = formData();
  const title = textLines(data.title, 'Your Story');
  const subtitle = textLines(data.subtitle, 'A collection of moments');
  const intro = textLines(data.intro, 'The moments that brought us here.');
  const note = textLines(data.note, 'Here is to every story still to come.');
  const date = data.date ? new Intl.DateTimeFormat('en', { month:'long', year:'numeric' }).format(new Date(`${data.date}-01T12:00:00`)) : 'A PERSONAL EDITION';
  const sets = [
    [sheet('right','cover',imageAt(0),title,subtitle,1,date)],
    [sheet('left','spread-one',imageAt(1),'','',2),sheet('right','spread-one',imageAt(2),'The beginning',intro,3)],
    [sheet('left','spread-two',imageAt(3),'A little more of us',subtitle,4),sheet('right','spread-two',imageAt(4),'','',5)],
    [sheet('left','back',null,'With love',note,6)],
  ];
  book.replaceChildren(...sets[page]);
  stage.dataset.templateStyle = template;
  document.querySelector('#preview-template-name').textContent = names[template].toUpperCase();
  indicator.textContent = `${['Cover', 'First spread', 'Second spread', 'Closing page'][page]} / 4`;
  document.querySelector('#previous-page').disabled = page === 0;
  document.querySelector('#next-page').disabled = page === 3;
}
function go(direction) {
  const next = Math.max(0, Math.min(3, page + direction));
  if (next === page) return;
  page = next;
  render();
  book.classList.remove('turning');
  void book.offsetWidth;
  book.classList.add('turning');
  clearTimeout(turnTimer);
  turnTimer = setTimeout(() => book.classList.remove('turning'), 600);
}
document.querySelector('#next-page').addEventListener('click', () => go(1));
document.querySelector('#previous-page').addEventListener('click', () => go(-1));
book.addEventListener('click', event => {
  const leaf = event.target.closest('.magazine-page-sheet');
  if (!leaf) return;
  go(leaf.classList.contains('left') && page !== 3 ? -1 : 1);
});
book.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
});
book.tabIndex = 0;
document.querySelectorAll('[data-template]').forEach(button => button.addEventListener('click', () => {
  template = button.dataset.template;
  document.querySelectorAll('[data-template]').forEach(tile => {
    const selected = tile.dataset.template === template;
    tile.classList.toggle('selected', selected);
    tile.setAttribute('aria-pressed', String(selected));
  });
  page = 0;
  render();
}));
form.addEventListener('input', render);
form.addEventListener('change', render);
upload.addEventListener('change', () => {
  photos.forEach(item => URL.revokeObjectURL(item.url));
  const files = [...upload.files].filter(file => /^image\/(jpeg|png|webp)$/.test(file.type)).slice(0, 8);
  photos = files.map(file => ({ name:file.name, url:URL.createObjectURL(file) }));
  photoList.replaceChildren();
  if (upload.files.length > 8) photoList.append(make('span', '', 'Showing the first 8 photos.'));
  photos.forEach(item => {
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = item.name;
    image.title = item.name;
    photoList.append(image);
  });
  render();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = formData();
  const body = [
    'Printed photo magazine enquiry', '',
    `Name: ${data.customer}`, `Email: ${data.email}`,
    `Template: ${names[template]}`, `Title: ${data.title}`, `Subtitle: ${data.subtitle}`,
    `Issue date: ${data.date || 'Not specified'}`, `Size: ${data.size}`,
    `Approximate length: ${data.pages}`, `Copies: ${data.copies}`,
    `Opening line: ${data.intro}`, `Closing note: ${data.note}`,
    `Special requests: ${data.requests || 'None'}`, '',
    `Photos selected in local preview: ${photos.length}. Please attach the original full-resolution images to this email before sending.`,
  ].join('\n');
  location.href = `mailto:hello@sundownpress.com?subject=${encodeURIComponent(`Printed magazine enquiry - ${data.customer}`)}&body=${encodeURIComponent(body)}`;
});
window.addEventListener('pagehide', () => photos.forEach(item => URL.revokeObjectURL(item.url)));
render();
