import { initNavigation } from './navigation.js';
initNavigation();

const recipient = 'hello@sundownpress.com';
const form = document.querySelector('#rental-form');
const whatsapp = document.querySelector('#rental-whatsapp');
const dialog = document.querySelector('#rental-chat-dialog');
const messages = document.querySelector('#rental-messages');
const chatForm = document.querySelector('#rental-chat-form');
const chatInput = document.querySelector('#rental-chat-input');
const questions = [
  { key:'name', prompt:'Hello! What name should we put on your enquiry?' },
  { key:'event', prompt:'What kind of event are you planning?' },
  { key:'date', prompt:'When is it happening? An approximate date is fine.' },
  { key:'location', prompt:'Which city or venue will it be at?' },
  { key:'message', prompt:'Tell us anything else about the celebration or the booth you have in mind.' },
  { key:'email', prompt:'What email address can we use for your enquiry?' },
];
let step = 0;
let answers = {};

function enquiry(values) {
  return [
    'Photo booth rental enquiry',
    '',
    `Name: ${values.name || 'Not supplied'}`,
    `Email: ${values.email || 'Not supplied'}`,
    `Phone: ${values.phone || 'Not supplied'}`,
    `Event: ${values.event || 'Not supplied'}`,
    `Date: ${values.date || 'To be confirmed'}`,
    `City / venue: ${values.location || 'To be confirmed'}`,
    '',
    `Details: ${values.message || 'Please contact me about photo booth rental.'}`,
  ].join('\n');
}
function emailLink(values) {
  const subject = `Photo booth rental enquiry - ${values.name || 'New enquiry'}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry(values))}`;
}
function formValues() { return Object.fromEntries(new FormData(form)); }
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  location.href = emailLink(formValues());
});
whatsapp.addEventListener('click', () => {
  const values = formValues();
  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(values.name || values.event || values.message ? enquiry(values) : "Hi, I'd like to enquire about photo booth rental.")}`;
});
function bubble(text, mine = false) {
  const node = document.createElement('div');
  node.className = `chat-bubble${mine ? ' mine' : ''}`;
  node.textContent = text;
  messages.append(node);
  messages.scrollTop = messages.scrollHeight;
}
function ask() {
  if (step < questions.length) {
    bubble(questions[step].prompt);
    chatInput.type = questions[step].key === 'email' ? 'email' : 'text';
    chatInput.placeholder = questions[step].key === 'email' ? 'you@example.com' : 'Type your answer';
    chatInput.focus();
    return;
  }
  bubble('Your enquiry is ready. Open the prepared email and press Send to reach us.');
  chatForm.hidden = true;
  const send = document.createElement('a');
  send.className = 'chat-send';
  send.textContent = 'Open enquiry email ↗';
  send.href = emailLink(answers);
  messages.append(send);
  messages.scrollTop = messages.scrollHeight;
}
document.querySelector('#open-rental-chat').addEventListener('click', () => {
  answers = {}; step = 0; messages.replaceChildren(); chatForm.hidden = false;
  dialog.showModal(); ask();
});
document.querySelector('#close-rental-chat').addEventListener('click', () => dialog.close());
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value || !chatInput.checkValidity()) return;
  answers[questions[step].key] = value;
  bubble(value, true);
  chatInput.value = '';
  step++;
  ask();
});
