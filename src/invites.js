import { storyStyles } from './story-styles.js';
const list = document.querySelector('#story-grid');
const filters = document.querySelector('#category-pills');
const categories = ['All', ...new Set(storyStyles.map(style => style.category))];
const requested = new URLSearchParams(location.search).get('category');
let active = categories.includes(requested) ? requested : 'All';
function render() {
  filters.replaceChildren();
  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = category;
    button.className = category === active ? 'active' : '';
    button.setAttribute('aria-pressed', String(category === active));
    button.addEventListener('click', () => { active = category; render(); });
    filters.append(button);
  }
  list.replaceChildren();
  for (const style of storyStyles.filter(item => active === 'All' || item.category === active)) {
    const article = document.createElement('article');
    article.className = `story-card style-${style.id}`;
    const art = document.createElement('div'); art.className = 'story-art'; art.setAttribute('aria-hidden', 'true');
    art.innerHTML = '<div class="art-frame"><span class="art-symbol"></span><span class="art-title"></span></div>';
    art.querySelector('.art-symbol').textContent = ({ royal:'✧', velvet:'✦', garden:'✿', letter:'✉', confetti:'✳', lantern:'✧' })[style.id];
    art.querySelector('.art-title').textContent = style.name;
    const content = document.createElement('div'); content.className = 'story-card-content';
    const category = document.createElement('span'); category.className = 'story-category'; category.textContent = style.category;
    const title = document.createElement('h3'); title.textContent = style.name;
    const description = document.createElement('p'); description.textContent = style.description;
    const interactions = document.createElement('span'); interactions.className = 'interactions'; interactions.textContent = `${style.opening} · ${style.reveal}`;
    const link = document.createElement('a'); link.href = `/royal-story.html?style=${encodeURIComponent(style.id)}`; link.textContent = 'Experience this invitation';
    content.append(category, title, description, interactions, link); article.append(art, content); list.append(article);
  }
}
render();
