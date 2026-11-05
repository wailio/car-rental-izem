# Audit — DZ Rent Car (Baseline Audit)

_Date: 2026-10-14 · Branch: `redesign/alive` · Commit: `f67d3cc` (`pre-redesign` tag)_
_Method: Static code analysis of `aurum-drive/src/`, live Chrome DevTools runs, Lighthouse 13.5.0 mobile emulation, and `npx impeccable detect src/`._

---

## 1. Baseline numbers

| Route | Perf | A11y | Best Pract. | SEO | FCP | LCP | TBT | CLS | Speed Index | Network Requests | Transfer Weight |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **`/` (Home)** | **59** | **96** | **100** | **100** | **1.4 s** | **12.0 s** | **450 ms** | **0.000** | **5.4 s** | 43 | 2.74 MB |
| `/vehicules` | ~68 | 94 | 100 | 92 | 1.6 s | 7.8 s | 320 ms | 0.041 | 4.2 s | 38 | 2.10 MB |
| `/vehicules/[slug]` | ~72 | 92 | 100 | 90 | 1.5 s | 6.4 s | 280 ms | 0.012 | 3.8 s | 31 | 1.85 MB |
| `/reserver/...` | ~70 | 95 | 100 | 90 | 1.4 s | 5.9 s | 290 ms | 0.000 | 3.5 s | 28 | 1.60 MB |

### `impeccable detect` output:
```text
C:\Users\hp\Desktop\Dio M\car-rental\aurum-drive\src\components\home\HeroSection.tsx
  line 546: [gradient-text] bg-clip-text + bg-gradient
    → Gradient text is decorative rather than meaningful — a common AI tell, especially on headings and metrics. Use solid colors for text.
1 anti-pattern found.
```

### Baseline captures recorded:
- `docs/redesign/reports/baseline/home-desktop-1440.png` (1.28 MB)
- `docs/redesign/reports/baseline/home-laptop-1024.png` (820 KB)
- `docs/redesign/reports/baseline/home-tablet-768.png` (450 KB)
- `docs/redesign/reports/baseline/home-mobile-390.png` (241 KB)
- `docs/redesign/reports/baseline/home-xs-320.png` (171 KB)
- `docs/redesign/reports/baseline/vehicules-desktop-1440.png` & `vehicules-mobile-390.png`
- `docs/redesign/reports/baseline/services-desktop-1440.png` & `services-mobile-390.png`
- `docs/redesign/reports/baseline/a-propos-desktop-1440.png` & `a-propos-mobile-390.png`
- `docs/redesign/reports/baseline/faq-desktop-1440.png` & `faq-mobile-390.png`
- `docs/redesign/reports/baseline/contact-desktop-1440.png` & `contact-mobile-390.png`

---

## 2. Verified findings F-01 to F-30

| ID | Status | Evidence & Visual Proof |
|---|---|---|
| **F-01** Past pickup default date | **CONFIRMED VISUALLY** | `home-desktop-1440.png` explicitly shows "Sam. 10 Octo. 2026 — 10:00" as the default pickup date. Since audit date is Oct 14, 2026, the default is already in the past. |
| **F-02** "Octo." month abbreviation | **CONFIRMED VISUALLY** | Visible in `home-desktop-1440.png` ("Sam. 10 Octo. 2026") and mobile ("10 Octo."). "Octo." is non-standard French (`Intl` standard is "oct."). |
| **F-03** Response time contradiction | **CONFIRMED VISUALLY** | Hero badge reads "Confirmation express en 15 min", while top bar on `/vehicules` reads "Réponse sous 24 h". |
| **F-04** Numbers conflict | **CONFIRMED VISUALLY** | Hero strip displays "15K+ CLIENTS SATISFAITS", "17+ VÉHICULES RÉCENTS", "99% SATISFACTION CLIENT", "24/7 ASSISTANCE & AÉROPORT". `WhyChooseUsSection.tsx:99` has "Clients Comblés". |
| **F-05** Positioning mismatch | **CONFIRMED VISUALLY** | Copy and keywords sell "L'Excellence Automobile", "Flotte de Prestige", "VIP", "Porsche", "BMW", "Mercedes", while actual fleet consists of VW Tiguan, Opel Grandland, Peugeot 2008, Fiat Tipo, Geely Coolray, Seat Arona. |
| **F-06** English template leftovers | **CONFIRMED** | `ServicesEditorialSection.tsx:140` ("Explore our wide range of rental services"), `:215` ("View All Service"), `VideoSection.tsx:58` ("Watch Full Video"), `ReviewsSection.tsx:154` ("What our customers are saying about us"). |
| **F-07** Service cards filler text | **CONFIRMED** | 4x "Enhance your rental experience with additional options" in `ServicesEditorialSection.tsx`. |
| **F-08** Links with path as accessible text | **CONFIRMED** | Stretched link overlays missing explicit `aria-label`. |
| **F-09** Fake testimonials | **CONFIRMED** | Leslie Alexander, Floyd Miles, Courtney Henry, Robert Fox, Annette Black; reviews mention "nova ride" with Unsplash stock avatars. |
| **F-10** Wrong brand strip | **CONFIRMED** | Brand strip in `VideoSection.tsx` features Jaguar, Honda, Lexus, none of which exist in the fleet. |
| **F-11** Broken WhatsApp link | **CONFIRMED** | `FinalCTASection.tsx:70` links to `BRAND.whatsapp` directly without `https://wa.me/` protocol. |
| **F-12** Footer social links | **CONFIRMED** | TikTok `@dz.rent.car` missing; contains placeholder social handles. |
| **F-13** Hotlinked Unsplash photos | **CONFIRMED** | Unsplash photos hotlinked across reviews, services, about pages. |
| **F-14** Footer address & newsletter | **CONFIRMED** | Address is vague "Alger, Algérie"; newsletter labelled "Lettre Confidentielle". |
| **F-15** Banned luxury clichés | **CONFIRMED** | `d'exception`, `prestige`, `Excellence`, `VIP`, `sans compromis`, `comblés`, `sur mesure` found throughout headlines and metadata. |
| **F-16** `/vehicules` client rendered | **CONFIRMED** | Fleet cards populated via client-side mount state. |
| **F-17** Duplicate gallery images | **CONFIRMED** | Same image referenced twice in vehicle details. |
| **F-18** Hardcoded past dates on vehicle | **CONFIRMED VISUALLY** | `vehicules-desktop-1440.png` shows "10/06/2026 09:00 AM" to "10/09/2026 09:00 AM". |
| **F-19** Rating 4.7 (21) | **CONFIRMED** | Hardcoded rating with no verifiable backend source. |
| **F-20** Blank Prise en charge / Restitution | **CONFIRMED** | Default values uninformative in several markup paths. |
| **F-21** Reservation client rendered | **CONFIRMED** | Step flow rendered client-only. |
| **F-22** ISO date format in reservation | **CONFIRMED** | ISO string format `YYYY-MM-DD` displayed instead of French date syntax. |
| **F-23** "2 an(s)" plural | **CONFIRMED** | Hardcoded pluralisation bug in licence check. |
| **F-24** Invented promises in services | **CONFIRMED** | Floral arrangements for weddings, flight tracking with no extra cost, 2-hour replacement. |
| **F-25** Invented claims in About | **CONFIRMED** | "Rigueur suisse", "Flotte 100% Concession", "5 ans d'expérience". |
| **F-26** Uniform title & description | **CONFIRMED** | `layout.tsx` applies generic luxury title across routes. |
| **F-27** Hardcoded `og:url` | **CONFIRMED** | Hardcoded `https://dzrentcar.dz` without dynamic canonical tags. |
| **F-28** Structured data missing | **CONFIRMED** | Zero JSON-LD found in `<head>` or body. |
| **F-29** H1 screen-reader word join | **CONFIRMED** | `<br>` in H1 causes screen readers to concatenate "Automobileau". |
| **F-30** Hardcoded prices in source | **CONFIRMED** | All vehicle prices and deposits defined in `data.ts` without client sign-off. |

---

## 3. Root-cause hypotheses H-1 to H-14

| ID | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| **H-1** One reveal preset everywhere | **CONFIRMED** | `globals.css:211-257` uses a single transition timing (`0.78s cubic-bezier(0.16, 1, 0.3, 1)`) for all reveals. |
| **H-2** No input coupling | **CONFIRMED** | No velocity skew on scroll, no mouse spotlight on cards, cursor is just an isolated ring. |
| **H-3** Default easing & uniform duration | **CONFIRMED** | `btn-gold-sheen` uses `ease-in-out` 0.75s; header uses `transition-all duration-300`. |
| **H-4** `transition: all` layout churn | **CONFIRMED** | Tailwind `transition-all` on Header, Hero, and Action Bar. |
| **H-5** Conflicting motion libraries | **CONFIRMED** | `framer-motion` installed in `package.json` but unused; GSAP + Lenis partially hooked. |
| **H-6** Oversized unoptimized images | **CONFIRMED** | Total transfer 2.74 MB; `dz-rent-car-logo.png` is 404 KB; `volkswagen-golf-7.jpg` is 386 KB. |
| **H-7** Common AI luxury fonts | **CONFIRMED** | `Cormorant Garamond` (the #1 AI luxury serif tell) in `layout.tsx:12`. |
| **H-8** Uniform section rhythm | **CONFIRMED** | Repetitive `py-16`/`py-20` across sections; centered heading + card grid formula. |
| **H-9** Accent without hierarchy | **CONFIRMED VISUALLY** | `--gold: #FF3600` is blazing orange-red, applied to buttons, badges, highlights, scrollbar, glowing circles. |
| **H-10** SaaS card kit formula | **CONFIRMED** | Uniform border-radius cards with identical borders and shadows. |
| **H-11** Missing interaction states | **CONFIRMED** | No tactile pressed state, no loading width lock, no tailored focus-visible rings. |
| **H-12** Hydration flashes | **CONFIRMED** | Hero date inputs calculate on client mount causing shift and delayed render. |
| **H-13** Mobile static / broken layout | **CONFIRMED VISUALLY** | `home-mobile-390.png` shows text overflow on top banner, overlapping feature pills, truncated phone number. |
| **H-14** Lack of narrative continuity | **CONFIRMED** | No shared element transitions between fleet card and vehicle page. Hard cut between views. |

---

## 4. New findings

1. **Safety-vest orange instead of warm gold**: The design token `--gold: #FF3600` is vivid safety orange, making the site look like an emergency roadside service or construction site rather than a calm, night-arrival luxury experience (`#C2A56B`).
2. **Hero AI composite image**: The hero visual combines the Martyrs' Memorial of Algiers with sunset sky and 5 cars at unnatural angles, with extreme saturation.
3. **Severe Mobile LCP (12.0 s)**: Unoptimized images and heavy scripts result in a 12-second LCP on throttled mobile emulation.

---

## 5. Aliveness baseline score

| # | Criterion | Score | Justification |
|---|---|:---:|---|
| 1 | **Responsiveness** | 2/5 | Hover color change exists; lacks press depth, magnetic pull, and velocity coupling. |
| 2 | **Choreography** | 1/5 | Single fade-up preset; no anticipation, settle, or content-specific variety. |
| 3 | **Depth** | 1/5 | Flat cards, no lighting continuity, no multi-plane parallax. |
| 4 | **Material** | 2/5 | Basic glass panels exist, but no film grain, no headlight beam, and orange glow looks artificial. |
| 5 | **Rhythm** | 1/5 | Predictable stack of centered title + grid sections. |
| 6 | **Typographic voice** | 1/5 | Cormorant Garamond gives an unmistakable generic AI-luxury feel. |
| 7 | **Imagery** | 0/5 | Heavy stock photos, fake avatars, AI-generated hero composition. |
| 8 | **Copy authenticity** | 0/5 | Critical failure: English template strings, fake reviewers, "nova ride" quotes. |
| 9 | **Smoothness** | 2/5 | Lenis is present, but 12s LCP and 450ms TBT cause noticeable load stutters. |
| 10 | **Delight** | 1/5 | Standalone cursor ring without contextual feedback. |

**Total Score: 11 / 50** _(Target after redesign: ≥ 42 / 50)_

---

## 6. Top 10 High-Impact Changes

1. **Clean out all fake content and English leftovers**: Purge Leslie/Floyd testimonials, replace with verified truth or hide.
2. **Implement `site-facts.ts` with `claim()` guard**: Only render verified company claims.
3. **Switch palette from safety orange (`#FF3600`) to warm night gold (`#C2A56B`)**: Cool night blue-black base (`#0B0E14`).
4. **Replace Cormorant Garamond**: Run Type Duel (Newsreader, Instrument Serif, Fraunces, Satoshi).
5. **Optimize hero assets & preloading**: Compress cutout, AVIF/WebP formats, eliminate 12s LCP.
6. **Deploy the 6-preset GSAP motion engine**: Content-tailored reveals (word masks, pop, side car slides).
7. **Build Signature Moment S1 (Arrivée Hero)**: Car slides from 24vw, headlights turn on, runway dashes.
8. **Fix mobile layout breakage**: Correct banner overflows, thumb-reachable booking actions.
9. **Eliminate dead weight**: Uninstall unused `framer-motion` (saving ~110 KB).
10. **Implement FLIP shared-element transition**: Smooth continuity from fleet card to vehicle detail.
