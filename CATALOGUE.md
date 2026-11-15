# Invitation catalogue hero

Run `npm install`, then `npm run dev` and open http://127.0.0.1:3000.
Run `npm test` for timeline checks and `npm run build` for a production build.
Run `npm run preview` to inspect the built site. Deploy the `dist` directory.

The existing HTML site is retained. Only the hero is a React island, mounted by
`src/catalogue/Hero.jsx`. It uses free `motion/react`; no Motion+ components.
`timeline.js` defines reversible page intervals. `catalogue.css` defines the
front/back surfaces, hinges, spine, paper edges and responsive layouts.
The existing preloader dispatches `sundown:loaded` before the entrance begins.

The intro, cover opening and browsing are coordinated states. Browsing uses a
single scroll progress value; button navigation scrolls that same timeline.
CSS sticky pinning releases naturally at the end, including on reverse scroll.
Scroll progress is measured against the committed open layout and recalculated
on resize, so opening never reuses the closed hero's zero-length scroll range.
Open spreads stay upright, use larger pages, and sit on a darker background.
Phones keep a single full-size page centered while turned leaves move left.
No wheel or vertical touch events are cancelled. Skip is always available.
Arrow keys and Page Up/Down work when focus is in the catalogue. Home/End seek
to the beginning/end. Horizontal touch swipes navigate; vertical swipes scroll.
The closed book flies from the dark with depth, lateral travel and a visible
zoom. Opening smoothly enlarges its dimensions, then settles upright for reading.
Each leaf uses connected paper strips for a curved turn with changing shading.
At the end the intact spread recedes and fades; pages never reverse-fold or spin.
The navbar stays transparent while the catalogue is visible.
Reduced motion removes perspective, parallax, entry and cover rotation, and
shows one page at a time. The system preference is respected dynamically.

Manual acceptance checks:
- Wait for the loader: pages close in reverse order and the book centres.
- Leave it idle, hover, click the book or Open button, then scroll slowly.
- Inspect fronts and designed backs at halfway turns; reverse through all pages.
- Alternate fast forward/back scrolling and buttons during partial turns.
- Reach the back cover, close, continue into the original marquee and sections.
- Scroll back up from below: the book reappears and reverses the closing sequence.
- Repeat at 390×844 and 768×1024, resize mid-turn, and try horizontal touch swipes.
- Tab through the controls and test keys, Skip, and reduced-motion preference.

Mockups use existing invitation JPGs with CSS phone, print, frame and paper
treatments. The original external GSAP, Three.js and Google Fonts still require
network access. Curved paper uses ten connected CSS surfaces per leaf.
