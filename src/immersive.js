import './immersive.css';
import './collection-scenes.css';
import './album-library.css';
import './album-pages.css';
import birthdayArt from '../invite_card_2.jpg';
import anniversaryArt from '../invite_card_4.jpg';
import celebrationArt from '../invite_card_3.jpg';
import personalArt from '../invite_card_6.jpg';

// One scroll scheduler for the editorial scenes; no wheel interception.
export function initImmersive() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  let frame = 0;
  function draw() {
    frame = 0;
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      scene.style.setProperty('--progress', reduced.matches ? '.5' : p);
      scene.style.setProperty('--entrance', reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight * .7))));
      scene.classList.toggle('scene-entered', rect.top < innerHeight * .85);
    });
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  draw();

  const hero = document.querySelector('#catalogue-root');
  hero?.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches || document.body.classList.contains('motion-paused')) return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', `${(event.clientX / rect.width - .5) * 9}deg`);
    hero.style.setProperty('--pointer-y', `${-(event.clientY / innerHeight - .5) * 6}deg`);
  });
  hero?.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '0deg');
    hero.style.setProperty('--pointer-y', '0deg');
  });

  document.querySelectorAll('[data-occasion]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-occasion]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.querySelector('.art-message').textContent = button.dataset.message;
      document.querySelector('.art-occasion').textContent = button.textContent;
      document.querySelector('.stationery-stage').style.setProperty('--card-ink', button.dataset.color);
      const covers = { Birthday: ['A little', 'more', 'joy.'], Anniversary: ['You, me', 'and', 'always.'], Celebration: ['Here’s to', 'beautiful', 'beginnings.'], 'Just because': ['Simply', 'because', 'you.'] };
      const title = document.querySelector('.art-cover-title');
      const lines = covers[button.textContent];
      title.replaceChildren(document.createTextNode(lines[0]), document.createElement('br'), document.createTextNode(`${lines[1]} `));
      const emphasis = document.createElement('em');
      emphasis.textContent = lines[2];
      title.append(emphasis);
      const stage = document.querySelector('.stationery-stage');
      stage.dataset.occasionTheme = button.textContent;
      const themes = { Birthday: [birthdayArt, 'A day to remember.', 'Joy, in the making.'], Anniversary: [anniversaryArt, 'A story for two.', 'Another chapter together.'], Celebration: [celebrationArt, 'Make it a moment.', 'Every milestone matters.'], 'Just because': [personalArt, 'No reason needed.', 'A little unexpected love.'] };
      const [image, note, caption] = themes[button.textContent];
      stage.querySelector('.stationery-photo img').src = image;
      stage.querySelector('.stationery-photo span').textContent = caption;
      stage.querySelector('.stationery-note strong').textContent = note;
      if (!reduced.matches && !document.body.classList.contains('motion-paused')) {
        stage.querySelectorAll('.art-card,.stationery-note,.stationery-photo').forEach((item, i) => {
          item.getAnimations().forEach(animation => animation.cancel());
          item.animate([
            { opacity: .15, translate: `${(i - 1) * 90}px 65px`, rotate: `${(i - 1) * 15}deg`, scale: .85 },
            { opacity: 1, translate: '0px 0px', rotate: '0deg', scale: 1 }
          ], { duration: 850, delay: i * 65, easing: 'cubic-bezier(.16,1,.3,1)' });
        });
      }
    });
  });
  const card = document.querySelector('.art-card');
  card?.addEventListener('click', () => {
    const open = card.getAttribute('aria-pressed') !== 'true';
    card.setAttribute('aria-pressed', String(open));
    card.setAttribute('aria-label', open ? 'Turn greeting card back to the design' : 'Turn greeting card over to read the message');
    card.classList.toggle('is-turned', open);
    document.querySelector('.stationery-stage').classList.toggle('is-revealed', open);
    document.querySelector('.letter-instruction').textContent = open ? 'Your words belong here. Tap to see the design.' : 'A card worth turning over. Tap to read.';
  });

  function collection(kind, stageSelector, initial, update) {
    const items = [...document.querySelectorAll(`[data-${kind}]`)];
    const stage = document.querySelector(stageSelector);
    if (!stage || !items.length) return;
    let selected = initial, touch = null, swiped = false;
    const select = index => {
      selected = (index + items.length) % items.length;
      items.forEach((item, i) => {
        let slot = (i - selected + items.length) % items.length;
        if (slot > items.length / 2) slot -= items.length;
        item.style.setProperty('--slot', slot);
        item.style.setProperty('--distance', Math.abs(slot));
        item.style.zIndex = String(10 - Math.abs(slot));
        item.setAttribute('aria-pressed', String(i === selected));
      });
      update(items[selected]);
    };
    items.forEach((item, i) => item.addEventListener('click', () => { if (!swiped) select(i); swiped = false; }));
    document.querySelectorAll(`[data-${kind}-step]`).forEach(button => button.addEventListener('click', () => select(selected + Number(button.dataset[`${kind}Step`]))));
    stage.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); select(selected + (event.key === 'ArrowRight' ? 1 : -1));
    });
    stage.addEventListener('pointerdown', event => { swiped = false; touch = { x: event.clientX, y: event.clientY }; });
    stage.addEventListener('pointerup', event => {
      if (!touch) return;
      const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; select(selected + (dx < 0 ? 1 : -1)); }
      touch = null;
    });
    stage.addEventListener('pointercancel', () => { touch = null; });
    select(initial);
  }
  collection('product', '.product-theatre', 1, item => {
    document.querySelector('#product-title').textContent = item.dataset.title;
    document.querySelector('#product-description').textContent = item.dataset.description;
  });
  collection('wedding', '.wedding-fan', 2, item => {
    document.querySelector('#wedding-selection').textContent = item.dataset.title;
  });

  const shelf = document.querySelector('.album-library');
  // Each row is a set of short floating shelves, each stocked with several albums.
  shelf?.querySelectorAll('.library-shelf').forEach((row, rowIndex) => {
    const books = Array.from(row.querySelectorAll('.album-spine-button'));
    const segmentCount = [3, 4, 3][rowIndex] || 3;
    const track = row.querySelector('.shelf-track');
    track.replaceChildren();
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
      const segment = document.createElement('div');
      segment.className = 'album-shelf-segment';
      const reel = document.createElement('div');
      reel.className = 'album-shelf-reel';
      for (let bookIndex = 0; bookIndex < 5; bookIndex++) {
        reel.append(books[(segmentIndex * 5 + bookIndex) % books.length]);
      }
      Array.from(reel.children).forEach(book => {
        const copy = book.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.tabIndex = -1;
        reel.append(copy);
      });
      segment.append(reel);
      track.append(segment);
    }
  });
  const albumPreview = document.querySelector('.album-preview');
  const previewTitle = document.querySelector('#album-preview-title');
  const previewMessage = document.querySelector('.album-preview-message');
  const previewImage = document.querySelector('.album-preview-photo img');
  const previewShell = document.querySelector('.album-preview-shell');
  const photoSet = ['/images/photobooth/4307635.avif','/images/photobooth/30723691.avif','/images/photobooth/37572244.avif','/images/photobooth/26423890.avif','/images/photobooth/19119341.avif','/images/photobooth/16902222.avif','/images/photobooth/18107912.avif','/images/photobooth/9271168.avif','/images/photobooth/29153202.avif'];
  const pageImages = [[0,1,2,3],[4,5,6],[7,8,0,1],[2,3,4]];
  let activeAlbumPage = 0;
  let albumTurning = false;
  const photoGrid = (indices, amount) => `<div class="album-photo-grid grid-${amount}">${indices.map(index => `<img src="${photoSet[index]}" alt="Album memory" loading="lazy">`).join('')}</div>`;
  const albumMarkup = page => `<article class="album-preview-page is-active"><div class="album-page-sheet"><small>SUNDOWN PRESS / PHOTO ALBUMS</small><h3 id="album-preview-title">${previewTitle.textContent}</h3><p class="album-preview-message">${previewMessage.textContent}</p><div class="album-preview-folio"><span>PERSONALISED KEEPSAKES</span><span>${String(page + 1).padStart(2,'0')}</span></div></div><div class="album-page-sheet">${photoGrid(pageImages[page], pageImages[page].length)}<div class="album-preview-folio"><span>SUNDOWN PRESS</span><span>${String(page + 1).padStart(2,'0')} / 04</span></div></div></article>`;
  if (previewShell) {
    previewShell.innerHTML = '<button type="button" class="album-preview-close" aria-label="Close album preview">×</button><div class="album-page-stage"></div><div class="album-page-controls"><button type="button" class="album-page-button" data-page-direction="-1" aria-label="Previous album page">Previous page</button><span class="album-page-status" aria-live="polite">Page 1 of 4</span><button type="button" class="album-page-button" data-page-direction="1" aria-label="Next album page">Next page</button></div>';
  }
  function renderAlbumPage(page) {
    const stage = previewShell.querySelector('.album-page-stage');
    if (!stage) return;
    stage.innerHTML = albumMarkup(page);
    stage.classList.remove('is-turning-next', 'is-turning-previous');
    previewShell.querySelector('.album-page-status').textContent = `Page ${page + 1} of 4`;
    previewShell.querySelector('[data-page-direction="-1"]').disabled = page === 0;
    previewShell.querySelector('[data-page-direction="1"]').disabled = page === 3;
  }
  const closeAlbum = () => {
    shelf?.classList.remove('is-dimmed');
    albumPreview?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('album-preview-open');
  };
  document.querySelectorAll('.album-spine-button').forEach(spine => {
    spine.addEventListener('click', () => {
      previewTitle.textContent = spine.dataset.album;
      previewMessage.textContent = spine.dataset.message;
      previewImage?.setAttribute('src', spine.dataset.image);
      shelf.classList.add('is-dimmed');
      albumPreview.setAttribute('aria-hidden', 'false');
      document.body.classList.add('album-preview-open');
      activeAlbumPage = 0;
      renderAlbumPage(activeAlbumPage);
      albumPreview.querySelector('.album-preview-close').focus();
    });
  });
  document.querySelector('.album-preview-close')?.addEventListener('click', closeAlbum);
  document.querySelectorAll('[data-page-direction]').forEach(button => button.addEventListener('click', () => {
    const next = Math.max(0, Math.min(3, activeAlbumPage + Number(button.dataset.pageDirection)));
    if (next === activeAlbumPage || albumTurning) return;
    const stage = previewShell.querySelector('.album-page-stage');
    const forward = next > activeAlbumPage;
    albumTurning = true;
    if (!reduced.matches) {
      const current = stage.querySelector('.album-preview-page');
      const turningSheet = current.querySelector(forward ? '.album-page-sheet:last-child' : '.album-page-sheet:first-child');
      const leaf = turningSheet.cloneNode(true);
      leaf.classList.add('album-turning-leaf', forward ? 'turn-forward' : 'turn-backward');
      leaf.setAttribute('aria-hidden', 'true');
      stage.innerHTML = albumMarkup(next);
      stage.append(leaf);
    }
    setTimeout(() => {
      activeAlbumPage = next;
      renderAlbumPage(next);
      albumTurning = false;
    }, reduced.matches ? 0 : 850);
  }));
  albumPreview?.addEventListener('click', event => { if (event.target === albumPreview) closeAlbum(); });
  previewShell?.querySelector('.album-page-stage')?.addEventListener('click', event => {
    const sheet = event.target.closest('.album-page-sheet');
    if (!sheet || albumTurning) return;
    const direction = sheet === sheet.parentElement.lastElementChild ? 1 : -1;
    previewShell.querySelector(`[data-page-direction="${direction}"]`)?.click();
  });
  document.addEventListener('keydown', event => {
    if (albumPreview?.getAttribute('aria-hidden') !== 'false') return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      previewShell.querySelector(`[data-page-direction="${event.key === 'ArrowRight' ? 1 : -1}"]`)?.click();
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && albumPreview?.getAttribute('aria-hidden') === 'false') closeAlbum(); });

  const motionToggle = document.querySelector('.motion-toggle');
  motionToggle?.addEventListener('click', () => {
    const paused = document.body.classList.toggle('motion-paused');
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = paused ? 'Scene motion off' : 'Scene motion on';
  });
}
