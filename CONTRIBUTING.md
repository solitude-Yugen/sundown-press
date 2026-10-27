# Contributing to Sundown Press

Thank you for helping build Sundown Press! This guide explains how to work in parallel without stepping on each other's toes.

---

## Branching Model

```
main              ← always deployable, protected
│
├── dev           ← integration branch; merge feature branches here first
│   ├── feat/hero-envelope     ← one feature per branch
│   ├── feat/how-it-works-step2
│   ├── feat/navigation-mobile
│   └── fix/carousel-loop
```

### Branch naming

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature or section |
| `fix/`  | Bug fix |
| `chore/` | Tooling, dependencies, cleanup |
| `style/` | Pure CSS / design tweaks (no logic change) |
| `refactor/` | Code restructure without behaviour change |

---

## Ownership Map (who owns what)

To avoid merge conflicts, each dev should primarily work in their assigned files:

| Dev | Files |
|-----|-------|
| **@solitude-Yugen** (Vishruti) | `index.html`, `src/animations.js`, `src/three-scene.js`, `css/hero.css` |
| **Dev B** | `src/how-it-works.js`, `css/how-it-works.css` |
| **Dev C** | `src/navigation.js`, `css/navigation.css`, `css/responsive.css` |
| **Dev D** | `css/greetings.css`, `css/weddings.css`, `css/keepsakes.css` |

> If you need to touch a file outside your area, tag the owner in the PR for review.

---

## Workflow

```bash
# 1. Pull the latest dev branch
git checkout dev
git pull origin dev

# 2. Create your feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes (only in your module file!)
# 4. Commit with a clear message
git add src/your-module.js css/your-section.css
git commit -m "feat(how-it-works): add step 3 typing animation"

# 5. Push and open a PR into dev
git push origin feat/your-feature-name
# → open PR on GitHub: base = dev, compare = feat/your-feature-name

# 6. After review, merge into dev
# 7. Releases: dev → main (Vishruti only)
```

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

Examples:
- `feat(hero): add envelope open animation`
- `fix(carousel): remove double-scroll jump`
- `style(nav): increase logo size on mobile`
- `chore: add .gitignore`

---

## Pull Request Checklist

Before requesting a review, confirm:

- [ ] Branch is based off latest `dev`
- [ ] Changes are scoped to my assigned module(s)
- [ ] No whitespace-only changes in unrelated files
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Tested in Chrome + Safari
- [ ] PR title follows Conventional Commits format

---

## Code Style

- **JavaScript:** ES Modules (`import`/`export`), `'use strict'`, 2-space indent
- **CSS:** BEM-inspired class names, CSS custom properties from `:root`
- **HTML:** Semantic elements, unique IDs, `alt` attributes on every `<img>`
- **No frameworks** — vanilla HTML/CSS/JS only

---

## Contact

Questions? Ping **Vishruti** on WhatsApp or open a GitHub issue.
