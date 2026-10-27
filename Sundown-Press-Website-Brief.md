## WEBSITE WORKFLOW & BUILD BRIEF

Current status: nothing has been built yet. No domain has been purchased, no hosting is set up, and no

development has started. This document is the planning brief to scope the build from scratch.


## Brand Context

Sundown Press sells tangible and digital memory products — personalized greetings, printed keepsakes, wedding invitations, and photo booth rental for events. The site needs to support both digital delivery (instant, no shipping) and physical fulfillment (printed and shipped) product lines.

## 1. Online Greetings (Digital-only product)

## What it is

Pre-designed greeting templates (birthdays, anniversaries, apologies, etc.) that a customer buys, customizes online, and sends as a shareable link — nothing physical, nothing shipped.

## User flow

- Browse templates by occasion (birthday, anniversary, apology, etc.)

- Pick one pay via the chosen payment gateway

- After payment confirms, customer is dropped into an editor: add/edit text (name, message), upload their own photo(s) into pre-placed photo slots

- Customer finishes editing gets a shareable link to send directly to the recipient (via WhatsApp, etc.)

## Interactivity requirement

This is the product's “wow factor,” not a nice-to-have. When the recipient opens the shareable link, the greeting shouldn't just display — it should invite interaction: tap a balloon and it pops with confetti, tap a gift box and it opens, a cake's candles light up on tap, etc. This is what makes someone screenshot/forward it instead of just reading it once.

## Tips (build side)

- Don't build a custom canvas editor from scratch — look at Fabric.js or Konva.js for drag/drop text and image placement on a template; this is a well-trodden problem

- Payment should gate access to the editor — confirm payment success via the gateway's webhook, not just the frontend callback

- The shareable link needs a public, read-only rendered page — once sent, the recipient should just view it beautifully, not edit it

- Store each finished greeting with a unique link/ID so it can be viewed anytime without re-triggering payment

## Tips for the animation/interactivity layer

- For pre-made animated elements (confetti bursts, floating balloons, sparkle effects), Lottie (After Effects animations exported as lightweight JSON, played via lottie-web) is the standard tool — light on mobile performance

- For simple one-off effects like a confetti burst on tap, a small dedicated library (e.g. canvas-confetti) is enough

- For custom interactive animations (a balloon that visibly pops, a box that opens), look at Rive — built specifically for state-based, tappable interactive animations


- Keep each template's interactive elements to a small, reusable set (“tap-to-pop,” “tap-to-reveal,” “tap-to-sparkle”) rather than fully custom animation per template

- Test on actual mid-range Android phones, not just a laptop browser — animation-heavy pages are where web products quietly feel laggy for a big chunk of Indian mobile users

## 2. Offline Greetings (Physical, printed & shipped)

## What it is

Pre-designed printable products — photo albums, birthday/anniversary greeting sheets, custom playing cards with uploaded photos, and similar creative printables — customized online, then printed (on a Canon G570) and shipped to the customer.

## User flow

- Browse printable templates (albums, cards, playing-card-style photo prints, etc.)

- Customer uploads their own photos into template slots, edits basic text (name, age, message, etc.)

- Customer pays and enters shipping address

- Seller side: receives an order with a ready-to-print file (ideally a direct PDF export)

- Print, package, and ship

## Tips (build side)

- Key technical requirement: the customer's design must be exportable as a print-ready, high-resolution PDF — browser-canvas output is usually screen resolution, prints need 300 DPI minimum

- Practical approach: save the customer's edits as data (text + photo positions/sizes), then generate the final PDF server-side at full print resolution

- An admin/order dashboard is needed — orders, generated PDFs, shipping addresses, status (Pending Printed Shipped)

- Get clear on PDF generation tooling early — a server-side library that takes positioned text+images and outputs a PDF — this is more backend-engineering than frontend

## 3. Wedding Invitations (Digital, same editor pattern as Sec. 1)

## What it is

Pre-designed wedding invitation templates — customer picks one, pays, and edits event details (names, venue, date, etc.).

## User flow

- Browse invitation templates

- Pay via the chosen payment gateway

- Edit details: couple's names, venue, date/time, any other templated fields

- Get a shareable link (same delivery pattern as Online Greetings)

## Interactivity requirement


Same expectation as Online Greetings — these should not be static pages. Think tasteful, elegant interaction rather than playful: a gentle reveal animation as the page loads, an envelope that opens on tap before showing the invitation, soft floral or light elements that animate in. The tone should feel premium and romantic rather than fun/novelty — a different animation mood than the greeting templates, built using the same technical approach (Lottie/Rive) described in Section 1.

## Tips

- Can likely reuse the same editor and payment system built for Online Greetings — just a different template category, not a separate system. Design the editor to be template-agnostic from the start

- Worth deciding now, even if not built immediately: is a future option to also print physical wedding invitations wanted? If yes, structure the data layer the same way as Offline Greetings from the start

## 4. Photo Booth Rental Page (Not e-commerce — informational/lead-gen)

## What it is

A standalone page showcasing the photo booth rental service — not a checkout flow, a page that gets people to make contact.

## Should include

- Photo booth details & specs (what's included, package options)

- Sample photos/prints from real events

- Customer testimonials

- List of past events/clients (builds credibility)

- A clear contact form or WhatsApp button — this page's whole job is to generate inquiries, not process payments

## Tip

Keep this page simple — it doesn't need a payment gateway or accounts, just needs to load fast, look premium, and make contacting the business effortless.

## . General Build Notes

- Payment: A hosted checkout from a payment gateway (Razorpay, Stripe, Cashfree, PayU, etc.) is the easiest integration to start with — avoid building custom card-handling UI, let the gateway's hosted flow handle that

- Accounts: decide early whether customers need an account, or if guest checkout + email/link-based access is enough — guest flow is simpler and probably sufficient for all four product types

- Shared infrastructure: Online Greetings, Offline Greetings, and Wedding Invitations all share the same core shape — template customize pay deliver (digital link or print+ship). Building this as one flexible system will save significant development time

- Scope check-in: this is a genuinely large build from zero — worth agreeing on a phased order (Online Greetings first since it's digital-only and simplest, then Offline Greetings once the PDF


- pipeline is proven, then Wedding Invitations reusing that system, Photo Booth page last since it's just a marketing page)

- Nothing exists yet: domain registration, hosting, and the development environment all still need to be set up before any of the above can begin
