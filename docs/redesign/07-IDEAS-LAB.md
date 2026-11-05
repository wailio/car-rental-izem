# 07. Ideas Lab and Experiments

Good-feeling interfaces are **tuned**, not guessed. This file gives you the creative ideas, a method to test them against each other, and a scoring rubric so decisions are made with evidence and are written down.

---

## 1. The lab

- Route group `/lab` (development only: gated by `NEXT_PUBLIC_LAB=1`, `noindex`, excluded from the production build).
- One page per idea, one URL per variant: `/lab/hero-car/a`, `/lab/hero-car/b`, `/lab/hero-car/c`.
- Every experiment page has: the isolated variant on **real content** (real headline, real car cut-out, real tokens), **sliders** for duration, ease, stagger, distance, a **slow-motion** control, and a **record** note (what to capture).
- Experiments live in `/lab` so they never pollute production code. The winner is **ported** into the site, then **re-tested in context** (a variant that wins alone can fail inside a busy page).

## 2. The experiment protocol

1. **Hypothesis** in one sentence ("A car that arrives with a ghost trail feels more physical than a plain slide").
2. **2 to 3 variants** (include a deliberately simple one).
3. **Build minimal** versions, same content, same data.
4. **Record**: desktop and mobile emulation, at 1x and at 0.25x speed. Save to `reports/lab/<idea>/`.
5. **Measure**: frame times (10 s, 4x CPU throttle), long tasks, CLS, bytes added.
6. **Score** with the rubric below. Gates can disqualify a variant.
7. **Decide**, then write it in `DECISIONS.md`: variants tried, scores, winner, why, what was rejected.
8. **Port, then re-test in context** (full page, mobile, reduced motion, slow network).

### Scoring rubric (each 0 to 5)

| Criterion | Weight | Question |
|---|---|---|
| **Smoothness** | x3 | 60 fps, no jank, no layout shift, instant feedback? **Gate: below 4 is disqualified.** |
| **Brand fit** | x2 | Does it say "arrivée, calme, vivant" and the real company (practical, warm, premium in feel)? |
| **Physicality** | x2 | Does it feel like it has weight and light, with anticipation and settle? |
| **Calm** | x2 | Is it restrained? Does it leave room to breathe? |
| **Clarity** | x2 | Does it help the task (find, choose, book) or at least not hinder it? |
| **Maintainability** | x1 | Simple enough for the client's future edits? |

Maximum 60. Accessibility is a **pass or fail gate** (keyboard, reduced motion, contrast, no seizure risks, no motion that cannot be turned off).

---

## 3. Idea catalogue

**Priority**: MUST (core of the "alive" feeling), SHOULD (strong value), COULD (only if time and assets allow).
**Needs**: what the client must supply for it to be real.

### 3.1 Arrival and light
| ID | Idea | What the visitor feels | How | Priority | Variants to test |
|---|---|---|---|---|---|
| I-01 | **Arrival hero**: the car slides in from the side, settles, headlights come on | "Someone is waiting for me" | S1 in `05` | MUST | (A) slide, ghost trail, settle, lights; (B) emerges from behind a light sweep mask, no ghost; (C) scroll-driven arrival |
| I-02 | **Algiers live clock** chip | "This is real and local" | `Intl` clock in `Africa/Algiers`, client-only, hydration-safe | MUST | with or without the emerald dot |
| I-03 | **Runway dashes and edge lights** | direction, arrival | `05` section 8 | MUST | dashes only, or dashes plus sequenced dots |
| I-04 | **Headlight cone with dust motes** | depth, atmosphere | 12 CSS-only motes in a clipped cone | SHOULD | motes on or off, 6 or 12 |
| I-05 | **Cursor spotlight** on dark sections and cards | the dark room reacts | CSS variables, rAF-throttled | SHOULD | radius 200, 240, 320 px; opacity 8 or 12% |
| I-06 | **Day-part light**: hero tone shifts with Algiers time | "it is alive, it knows the hour" | two hero grades, crossfade by local hour | COULD | on or off. Needs: two hero images |

### 3.2 Numbers and feedback
| ID | Idea | Feeling | How | Priority | Variants |
|---|---|---|---|---|---|
| I-07 | **Odometer numerals** for prices and totals | the car is counting | digit strips, right-to-left stagger | MUST | 700 ms or 900 ms; stagger 30 or 50 ms |
| I-08 | **Instrument-cluster sweep preloader** | "ignition" | gauge sweep, monogram draw, wipe up | SHOULD | with or without; measure the LCP delta; skip logic |
| I-09 | **Gauge scroll progress** | position awareness | ring with arc in the scroll-to-top button | SHOULD | ring only, or ring plus ticks |
| I-10 | **Rolling day count** in the date picker | instant feedback | odometer on "3 jours" and the total | SHOULD | with or without a gold underline pulse |

### 3.3 Cars in motion
| ID | Idea | Feeling | How | Priority | Variants |
|---|---|---|---|---|---|
| I-11 | **Category stage**: the car swaps sideways | precision, physical | S3 | MUST | stage vs the original card rail |
| I-12 | **Spotlight cards** | the card is lit by you | S4 | MUST | border glow only, or glow plus inner light |
| I-13 | **Alternating sideways entries** for cards | rhythm, direction | S4 | MUST | 18 vw, 24 vw, 30 vw |
| I-14 | **Velocity skew** on the rail | the page has momentum | S4 | SHOULD | 3 degrees or 5 degrees. Disable if it causes any discomfort |
| I-15 | **Road scrub**: a car drives down the lane line | storytelling | S5 | MUST | (A) top-down vertical, (B) side-view horizontal |
| I-16 | **Two cars meet** in the CTA band | closure | S9 | SHOULD | one car or two |
| I-17 | **Line-art draw-on** on the vehicle page | craft | stroke-dashoffset | MUST | draw then photo, or photo then draw |
| I-18 | **Shared-element** card to hero | continuity | manual FLIP, S7 | MUST | manual FLIP vs View Transitions |
| I-19 | **Exterior and interior drag-reveal** | exploration | clip-path slider between two photos | COULD | Needs: matching exterior and interior photos |
| I-20 | **360° viewer** | ownership | image sequence | COULD | Needs: a real 24-frame capture. Do not fake it. |

### 3.4 Text and rhythm
| ID | Idea | Feeling | How | Priority | Variants |
|---|---|---|---|---|---|
| I-21 | **Word-mask headlines** | weight, editorial | `SplitWords`, CSS | MUST | 60, 70, 90 ms stagger |
| I-22 | **Hand-drawn gold underline** on a key phrase | human touch | SVG stroke draw | SHOULD | underline, italic, highlight sweep, none; max 5 per site |
| I-23 | **Statement that fills with scroll** | a calm pause | S12 | SHOULD | with or without |
| I-24 | **Stacking section curtains** (rounded sections slide over each other) | depth | sticky stacking | COULD | desktop only; test on 4x CPU throttle |
| I-25 | **Giant outline wordmark** footer | brand | S11 | SHOULD | cursor mask vs static |
| I-26 | **Hover image preview** in the services list | discovery | follow-cursor image | SHOULD | image size 240 or 320 px |

### 3.5 Booking and trust
| ID | Idea | Feeling | How | Priority | Needs |
|---|---|---|---|---|---|
| I-27 | **Boarding-pass confirmation** | "it is real, I am booked" | S8 | MUST | none |
| I-28 | **WhatsApp-first CTAs** with prefilled messages (car and dates) | the local way to book | one helper | MUST | confirmed number |
| I-29 | **TikTok strip** with real clips | proof, life | four phone frames, in-view autoplay | SHOULD | the client's video files and permission |
| I-30 | **Real proof marquee**: screenshots of real reviews | trust | slow marquee, pause on hover | SHOULD | real screenshots with permission |
| I-31 | **Approximate euro display** toggle | clarity for visitors from abroad | a "≈" line with a disclaimer | COULD | **ask the client first**; avoid exchange-rate claims they cannot honour |
| I-32 | **Arabic and RTL** | inclusion | i18n dictionary, logical CSS properties | COULD (later) | translations |
| I-33 | **"Comment on se retrouve"** mini-flow (Vous atterrissez, On vous appelle, Clés en main) | the promise made concrete | 3 steps inside the Pourquoi section | SHOULD | the real handover process |
| I-34 | **Time-aware greeting** ("Bonne soirée") | a human touch | client-side hour | COULD | none |

### 3.6 Navigation and mobile
| ID | Idea | Feeling | How | Priority |
|---|---|---|---|---|
| I-35 | **Sliding nav indicator** | polish | Flip | SHOULD |
| I-36 | **Circular menu reveal** | delight, flow | clip-path circle from the button | SHOULD |
| I-37 | **Bottom-sheet filters and date picker** with spring physics | native feel | drag handle, `touch-action`, velocity release | MUST (mobile) |
| I-38 | **Sticky price bar** on the vehicle page | thumb reach | bottom bar with price and CTA | MUST (mobile) |
| I-39 | **Haptic tick** on key actions | physical | `navigator.vibrate(8)` where supported | COULD |

### 3.7 Delight and polish
| ID | Idea | Feeling | How | Priority |
|---|---|---|---|---|
| I-40 | **404 car drives off** | humour with restraint | short animation | SHOULD |
| I-41 | **Button sheen and arrow swap** | quality in the details | `04` | MUST |
| I-42 | **Logo click blinks the headlights** once | a secret handshake | tiny animation | COULD |

---

## 4. Experiments to run (in this order)

| # | Experiment | Phase | Pass criteria |
|---|---|---|---|
| E-1 | **Type duel** (5 candidates, `04` section 3) | 2 | Winner scores highest on hero, price block and form, with correct French and tabular numerals |
| E-2 | **Palette duel** (cool night vs warm black) | 2 | The photos and the gold feel harmonious; contrast passes |
| E-3 | **Button hover variants** (sheen, arrow swap, magnetic strength 0.15 vs 0.25) | 2 | Feels premium on a 60 Hz and a 120 Hz screen, no jitter |
| E-4 | **Cursor ring** (ring only vs ring plus dot; lag 0.35 vs 0.45 vs 0.6 s) | 2 | Responsive without feeling detached; no distraction on text |
| E-5 | **Hero storyboards** (three) | 0 and 3 | The chosen one passes smoothness and is judged "alive" by the person at checkpoint A |
| E-6 | **Hero car entry** (A, B, C) | 3 | Highest score; LCP unaffected |
| E-7 | **Category stage vs card rail** | 3 | Stage wins on physicality and clarity, or falls back if assets are missing |
| E-8 | **Fleet layout** (grid vs rail) | 3 | Clarity and physicality, mobile native scroll intact |
| E-9 | **Road scrub** (vertical vs horizontal) | 3 | Steps stay readable on mobile |
| E-10 | **Preloader on or off** | 2 | Keeps it only if the LCP delta is zero and it feels like ignition, not a delay |
| E-11 | **Page transition** (sweep vs crossfade) | 4 | Under 800 ms, no scroll bugs on back and forward |
| E-12 | **Shared element** (manual FLIP vs View Transitions) | 4 | Smooth on mobile, correct fallback |

---

## 5. The delight budget

Each page gets **one memorable moment**, everything else stays quiet.

| Page | The one memorable moment |
|---|---|
| Home | the arrival hero (S1) |
| Fleet | the cards sliding in and the spotlight |
| Vehicle | the line-art draw and the shared-element arrival |
| Reservation | the odometer total and the step fill |
| Confirmation | the boarding pass printing |
| Services, About, Contact | one subtle reveal each |
| 404 | the car driving off |

---

## 6. Ideas rejected on purpose (do not add)

- Heavy **WebGL or 3D scenes** (cost on mid-range Android, hard to maintain).
- **Sound** or autoplay audio.
- **Scroll hijacking** (long pinned sequences, scroll that fights the user).
- **Long preloaders** (more than about 1.1 s).
- **Confetti**, bouncing icons, rainbow gradients.
- **Parallax on everything**, **3D tilt on mobile**.
- **Infinite marquee of fake logos** or fake partner badges.
- **Chatbots** without a real backend.
- **Dark patterns**: fake "3 people viewing now", fake scarcity, fake countdowns, fake review counts.
- Anything that **claims** something the company has not confirmed.

---

## 7. Dependencies on the client (so the ideas are real, not faked)

| Needs | Unlocks |
|---|---|
| Car cut-out photos (front three-quarter) | I-01, I-11, I-13, I-16 |
| Real multi-angle photos per car | I-17 (line art can be drawn without), I-18, vehicle gallery, I-19 |
| Hero loop footage or arrivals photo | I-01, I-04, hero storyboards |
| TikTok clips and permission | I-29, video section |
| Real review screenshots | I-30, Témoignages |
| Real handover process | I-33 |
| Confirmed numbers, hours, address | trust strip, footer, contact |
