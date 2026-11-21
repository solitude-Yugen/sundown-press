import { templates, getTemplate } from './invitation-templates.js';

const form = document.querySelector('#invitation-form');
const preview = document.querySelector('#invitation-preview');
const list = document.querySelector('#template-list');
const initial = Object.fromEntries(new FormData(form));
const storageKey = 'sundown-invitation-draft-v1';
let selected = templates[0].id;

function formatDate(value) {
  if (!value) return 'YOUR DATE';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? 'YOUR DATE' : new Intl.DateTimeFormat('en-IN', {day:'numeric',month:'long',year:'numeric'}).format(date);
}
function formatTime(value) {
  if (!value) return '';
  const [hours, minutes] = value.split(':').map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return '';
  return new Intl.DateTimeFormat('en-IN',{hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(2027,0,1,hours,minutes));
}
function node(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function makeInvitation(template, fields) {
  const page = node('article', `invitation design-${template.style} palette-${template.palette}`);
  const ornament = node('div','ornament'); ornament.setAttribute('aria-hidden','true');
  const content = node('div','invitation-content');
  content.append(node('span','invite-kicker','SUNDOWN PRESS PRESENTS'),node('p','invite-subtitle',fields.subtitle || 'Please join us to celebrate'),node('h2','invite-names',fields.names || 'Your celebration'),node('div','invite-rule'),node('p','invite-date',formatDate(fields.date)),node('p','invite-time',formatTime(fields.time)),node('p','invite-venue',fields.venue || 'Your venue'),node('p','invite-message',fields.message || 'We look forward to celebrating with you.'));
  const rsvp = node('a','invite-rsvp',fields.rsvp ? 'RSVP' : 'Save the date');
  if (fields.rsvp && /^https?:\/\//i.test(fields.rsvp)) { rsvp.href = fields.rsvp; rsvp.target = '_blank'; rsvp.rel = 'noopener noreferrer'; }
  else rsvp.removeAttribute('href');
  content.append(rsvp);
  page.append(ornament,content);
  return page;
}
function fields() { return Object.fromEntries(new FormData(form)); }
function render() {
  const template = getTemplate(selected);
  preview.replaceChildren(makeInvitation(template,fields()));
  document.querySelector('#selected-name').textContent = template.name;
  list.querySelectorAll('button').forEach(button => {
    const active = button.dataset.id === selected;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  try { localStorage.setItem(storageKey,JSON.stringify({template:selected,fields:fields()})); } catch { /* Storage is optional. */ }
}
for (const template of templates) {
  const button = node('button','template-choice'); button.type = 'button'; button.dataset.id = template.id;
  const thumbnail = node('span',`template-thumb design-${template.style} palette-${template.palette}`);
  thumbnail.append(node('span','thumbnail-ornament'),node('span','thumbnail-title','A & M'));
  button.append(thumbnail,node('span','template-name',template.name),node('span','template-category',template.category));
  button.addEventListener('click',()=>{selected=template.id;render();});
  list.append(button);
}
document.querySelector('#design-count').textContent = `${templates.length} curated designs`;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && templates.some(template=>template.id===saved.template)) selected=saved.template;
  if (saved?.fields) for (const [key,value] of Object.entries(saved.fields)) {
    const control=form.elements.namedItem(key);
    if(control && typeof value==='string') control.value=value;
  }
} catch { /* A malformed draft is ignored. */ }
form.addEventListener('input',render);
form.addEventListener('change',render);
document.querySelector('#reset-invitation').addEventListener('click',()=>{
  for (const [key,value] of Object.entries(initial)) form.elements.namedItem(key).value=value;
  selected=templates[0].id; render();
  document.querySelector('#studio-status').textContent='Details reset.';
});
document.querySelector('#download-page').addEventListener('click',()=>{
  if (!form.reportValidity()) return;
  const template=getTemplate(selected);
  const page=makeInvitation(template,fields());
  const css=[...document.styleSheets].find(sheet=>sheet.href?.includes('invitation-studio.css'));
  // A stylesheet link keeps the exported HTML small and uses the site's hosted assets.
  // Inline the invitation rules so the downloaded page works offline as well.
  const stylesheet=css ? [...css.cssRules].map(rule=>rule.cssText).join('\n') : '';
  const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(fields().names || 'Invitation')}</title><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${stylesheet}\nbody{margin:0;background:#eee9df}.invitation{min-height:100dvh;width:100%;max-width:none;box-sizing:border-box}.invitation-content{min-height:100dvh;box-sizing:border-box}</style></head><body>${page.outerHTML}</body></html>`;
  const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`sundown-${selected}-invitation.html`;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.querySelector('#studio-status').textContent='Invitation webpage downloaded.';
});
function escapeHtml(value) {return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
render();
