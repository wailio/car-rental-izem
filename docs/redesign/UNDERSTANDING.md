# UNDERSTANDING.md — 12 bullets

_Written at Phase 0. Maximum 12 bullets as required by step 0.3._

1. **Goal**: Redesign the DZ Rent Car website (Next.js, `aurum-drive/`) so it feels alive, human-crafted, luxury but simple, spacious. Keep all routes, section order, and 3-step reservation workflow intact.

2. **Concept "Arrivée"**: The design language is landing at night in Algiers to find your car waiting. Dark night base (`--night-900: #0B0E14`), warm gold light as accents, ivory text, runway shapes, instrument-cluster numerals, boarding-pass confirmation.

3. **Brand truth**: DZ Rent Car is a practical, friendly Algerian car-rental company (TikTok `@dz.rent.car`). Its superpower is free airport delivery, 24/7 assistance, full-risk insurance, recent cars. It is **not** a luxury chauffeur brand — the current site lies about this in many ways.

4. **Biggest problem category**: Content rot (F-01 to F-30): fake testimonials (Leslie, Floyd, Courtney…), mismatched luxury fleet claims (Rolls-Royce imagery vs. VW/Opel actual fleet), banned words everywhere (`VIP`, `d'exception`, `prestige`, `sans compromis`), English template strings, hardcoded past dates, broken WhatsApp link.

5. **Second problem category**: "Dead" design — one reveal preset for everything (`data-reveal` fade-up, no variety), no input coupling to cursor/scroll velocity/time, `transition: ease-in-out` with uniform durations, both Framer Motion AND GSAP installed but only GSAP actually used (H-5 confirmed), Cormorant Garamond (the most common AI-luxury serif) as the display font (H-7 confirmed).

6. **Third problem category**: Wrong palette and concept. The CSS uses `--gold: #FF3600` which is **orange-red**, not gold. The concept is attempting "warm black luxury" but it conflicts with the redesign spec's `#C2A56B` warm gold. The whole token system needs replacing before anything else.

7. **Key structural risk**: The actual Next.js project lives in `aurum-drive/`, not at the workspace root. All paths in commits and scripts must reference `aurum-drive/src/`.

8. **My plan**: Phase 0 → static audit done, browser baseline (dev server) pending. Phase 1 → facts register + content QA script (highest ROI, shippable alone). Phase 2 → replace token file, type duel, motion engine, components in `/lab`. STOP-A. Phase 3 → home page section by section. STOP-D after Hero + Fleet. Phase 4-8 remaining.

9. **Constraints**: French-only UI. No invented facts. No purple gradients, no glow blobs, no gradient text. Animate only `transform`, `opacity`, `clip-path`. Lenis only on `(hover: hover) and (pointer: fine)`. LCP ≤ 2.5 s, CLS ≤ 0.02, Lighthouse accessibility 100.

10. **Biggest risks**: (a) Missing real photos — every motion idea with car cutouts needs the client's actual car images. (b) Unverified facts creeping back — the content QA script is the gate. (c) Framer Motion in `package.json` but unused — could be removed to cut JS weight.

11. **Client questions backlog**: ~14 open items (see `CLIENT-QUESTIONS.md`). Most critical: real fleet photos, confirmed phone/WhatsApp number, confirmed response time (15 min vs 24 h conflict), confirmed services (chauffeur, weddings).

12. **Success test**: A visitor lands and within 3 seconds feels the page is alive and calm. The copy is plain, specific, true. The site loads fast on a mid-range Android. Nobody guesses it was generated.
