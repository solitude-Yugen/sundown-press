# ☼ Sundown Press — Landing Page

> Personalized digital greetings, bespoke wedding invitations, printed keepsakes, and photo booth experiences.  
> **Live dev server:** `http://localhost:3000`

---

## Quick Start

```bash
# Clone
git clone https://github.com/solitude-Yugen/sundown-press.git
cd sundown-press

# Run local dev server (no build step needed)
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
sundown-press/
│
├── index.html            ← Page markup (single HTML file, no framework)
├── style.css             ← Compiled / legacy CSS (browser fallback)
│
├── src/                  ← JavaScript ES modules (one feature per file)
│   ├── main.js           ← Entry point — imports & boots every module
│   ├── brand.js          ← Shared colour constants
│   ├── preloader.js      ← Loading screen
│   ├── three-scene.js    ← Three.js WebGL background (particles, wave, sun)
│   ├── navigation.js     ← Nav bar, hamburger, smooth anchor scroll
│   ├── animations.js     ← GSAP + ScrollTrigger animations
│   ├── counters.js       ← Animated number counters
│   ├── particles-overlay.js  ← HTML particles, card sparkles, tilt, confetti, cursor glow
│   ├── how-it-works.js   ← 3-step interactive section (fan cards, briefing loop, WhatsApp)
│   └── persistent-cta.js ← Floating bottom bar + WhatsApp button
│
├── css/                  ← CSS partials (one section per file)
│   ├── index.css         ← @imports every partial (dev entry point)
│   ├── base.css          ← CSS variables, reset, canvas
│   ├── preloader.css
│   ├── navigation.css
│   ├── hero.css
│   ├── carousel.css
│   ├── greetings.css
│   ├── how-it-works.css
│   ├── persistent-cta.css
│   ├── parallax.css
│   ├── keepsakes.css
│   ├── weddings.css
│   ├── photobooth.css
│   ├── testimonials.css
│   ├── contact.css
│   ├── footer.css
│   └── responsive.css
│
├── package.json
├── .gitignore
└── CONTRIBUTING.md
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Markup | Vanilla HTML5 |
| Styles | Vanilla CSS (partials under `css/`) |
| Scripts | Vanilla JS ES Modules (`src/`) |
| 3D Background | [Three.js r128](https://threejs.org/) via CDN |
| Animations | [GSAP 3.12](https://greensock.com/gsap/) + ScrollTrigger via CDN |
| Dev server | `npx serve` (zero config) |

---

## Brand Colours

| Name | Hex | Usage |
|------|-----|-------|
| Gold | `#D4A03C` | CTAs, accents, star elements |
| Deep Teal | `#0F3D3E` | Backgrounds, nav, hero |
| Crimson | `#4A121A` | Active states, step gliders |
| Cream | `#F5F0E1` | Content sections |
| Bronze | `#8B6914` | Darker gold accents |

---

## Git Workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full branching model and PR checklist.

---

## Author

**Vishruti Jadhav** · [github.com/solitude-Yugen](https://github.com/solitude-Yugen)
