# ☼ Sundown Press — Landing Page Preview

## Live at: [http://localhost:3000](http://localhost:3000)

---

## Page Walkthrough

````carousel
![Hero Section — Split layout with 3D opening wedding card, envelope with wax seal, and staggered moving carousel](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/hero_verification_top_half_1792986550737.png)
<!-- slide -->
![How It Works Step 1: Choose — 3D fanned cards stack with seals, ribbon bow, glare sweep, and 3 personalization tiers](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/hiw_step1_fanned_cards.png)
<!-- slide -->
![How It Works Step 2A: We Create It — Live simulated typing of briefing details, song equalizer, and saved automatically badge](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/hiw_step2_briefing_typing.png)
<!-- slide -->
![How It Works Step 2B: Draft Ready — Phone mockup showing private invitation draft and loading progress bar completing](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/hiw_step2_draft_loading.png)
<!-- slide -->
![How It Works Step 3: Share One Link — Mock WhatsApp chat with link preview, enthusiastic guest reply, and live updating RSVP tracker card](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/hiw_step3_whatsapp_rsvps.png)
<!-- slide -->
![Staggered Carousel in Motion — continuous infinite marquee of invitation cards arranged above and below each other](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/carousel_in_motion_1792986565491.png)
<!-- slide -->
![Marquee & Digital Greetings — smooth scrolling ticker with gold text, leading into the greeting template showcase](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/digital_greetings_section_1792983882690.png)
<!-- slide -->
![Parallax Quote Divider & Keepsakes — elegant quote on teal with printed products showcase](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/keepsakes_and_quote_1792983890401.png)
<!-- slide -->
![Wedding Invitations — Royal Heritage, Botanical Garden, Modern Minimal cards with pricing](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/weddings_and_booth_1792983898109.png)
<!-- slide -->
![Photo Booth & Testimonials — booth visual with lights, client reviews with 5-star ratings](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/photobooth_and_testimonials_1792983914622.png)
<!-- slide -->
![Contact CTA & Footer — WhatsApp integration, social links, comprehensive footer navigation](C:/Users/VISHRUTI/.gemini/antigravity-ide/brain/1656640c-1473-4151-95ee-9ce892838423/absolute_footer_1792983943903.png)
````

---

## 🌟 Hero & Navigation Features

| Component | Feature | Details |
|-----------|---------|---------|
| **Loading Screen** | Full Brand Logo | Features `logo.png` with a breathing golden drop shadow aura and animated progress indicator. |
| **Navbar Brand Lockup** | Emblem + Typography | High-res arch emblem (`logo_emblem.png`) paired with elegant serif **"SUNDOWN PRESS"** text beside it. |
| **Scroll-to-Center Animation** | Minimalist Gliding Header | At top: left-aligned with full navigation links. Upon scroll: links fade away and the brand mark glides to the dead center. |
| **How It Works 3-Card Flow** | Continuous Bonework Flow | Stretches to `max-width: 1520px` across page borders with 3 sequential, full-sized physical cards continuing down in natural scroll motion (no dead blank space or erratic jumps), connected by elegant gold flow badges (`✦ STEP BELOW ✦`). |
| **Step 1: Choose (`#hiwStep1`)** | 3D Fanned Stack & Shine | Fanned envelope cards with wax seals, custom hero card with ribbon bow, hover glare sweep, step badge, active tab glider at position 1, top segmented bar at 01 active, and 3 personalisation tiers (*Essential*, *Premium*, *Excellence*). |
| **Step 2: We Create It (`#hiwStep2`)** | Looping Briefing & Draft | Active tab glider at position 2, top bar at 02 active. In-view automated loop: **Part A** simulates live typing of event details (Names, Date, Venue, Photos & Music) then flashes *"✓ Saved automatically"*; **Part B** reveals phone mockup with draft invitation and an animated progress bar that fills to 100% completion. |
| **Step 3: Share One Link (`#hiwStep3`)** | Mock WhatsApp & Live RSVPs | Active tab glider at position 3, top bar at 03 active. In-view WhatsApp chat simulation showing outgoing invitation link preview with blue read ticks, typing indicator, incoming excited guest reply, and a floating **"Your RSVPs • LIVE"** card that ticks upward live. |
| **Persistent Bottom CTAs** | Sticky Floating Bar & WhatsApp | Floating bottom bar (*"Your invitation, designed by hand [START MY INVITATION]"*) and bottom-right circular WhatsApp contact button. |

---

## Color Palette (from logo)

| Color | Hex | Usage |
|-------|-----|-------|
| 🟤 Gold | `#D4A03C` | Accents, CTAs, star elements, sun motif |
| 🟢 Deep Teal | `#0F3D3E` | Primary backgrounds, nav, hero |
| 🟡 Light Gold | `#E8C547` | Shimmer, highlights, hover states |
| ⬜ Cream | `#F5F0E1` | Content section backgrounds |
| 🟫 Bronze | `#8B6914` | Darker gold accents, tags |

## ✨ Animation & Effects Summary

| Effect | Technology | Description |
|--------|-----------|-------------|
| Floating gold particles | **Three.js** (custom shaders) | 800 additive-blended particles with sinusoidal movement |
| Card particle ring | **Three.js** (vertex & frag shaders) | Custom orbiting gold particle halo around the 3D card |
| Ocean wave mesh | **Three.js** (vertex shader) | Animated plane geometry representing waves from logo |
| Glowing sun sphere | **Three.js** (fresnel shader) | Floating sphere with torus ring orbits |
| 3D envelope suite physics | **CSS 3D & GSAP** | Realistic pull-out suite: flap unfolds 176° backwards, card slides up to rest gracefully in front of envelope border |
| Endless looping carousel | **CSS infinite marquee** | 3-group endless marquee with exact subpixel loop matching and artisanal staggered heights |
| Scroll animations | **GSAP ScrollTrigger** | fade-up, fade-left, fade-right, stagger-up |
| 3D mouse parallax tilt | **Vanilla JS & GSAP** | Subtle perspective tilt tracking cursor over envelope suite |
| Confetti burst | **Vanilla JS** | Micro-confetti on card hover |
| Counter animation | **Vanilla JS** | Number counting with eased timing |
| Marquee scroll | **CSS animation** | Infinite horizontal scroll |
| Preloader | **CSS animation** | Sun pulse + progress bar loading |
| Cursor glow | **Vanilla JS** | Radial gold glow following cursor |

## Files Updated

| File | Purpose |
|------|---------|
| [`index.html`](file:///c:/Users/VISHRUTI/OneDrive/Desktop/sundown%20press/index.html) | Royal invitation suite markup + 3 identical `.carousel-group`s for seamless endless looping |
| [`style.css`](file:///c:/Users/VISHRUTI/OneDrive/Desktop/sundown%20press/style.css) | Adjusted opened card translateY (-72px) closer to envelope border, 3-group endless loop keyframes |
| [`main.js`](file:///c:/Users/VISHRUTI/OneDrive/Desktop/sundown%20press/main.js) | Manual click toggle, dynamic badge, CSS variable mouse tilt, and tuned carousel stagger |

> [!TIP]
> Click the wax seal or envelope in the hero section to see the invitation card glide forward right above the envelope pocket border, and watch the carousel below scroll endlessly without any interruption!
