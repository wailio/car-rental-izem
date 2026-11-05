# 01. Master Plan (step by step)

Read `00-START-HERE.md` first. This plan is the spine. Every phase has **steps**, an **evidence list**, and a **gate** (pass or fail). Do not start the next phase until the gate passes.

**Checkpoint types**
- **STOP**: write the report, then wait for the person's approval. There are exactly three: **A**, **D**, **F**.
- **REPORT**: write the report and continue without waiting.

**Evidence pack** (what "done" means for any section, page or component). Save under `docs/redesign/reports/<name>/`:
1. Screenshots at **1440, 1024, 768, 390 and 320 px** (`desktop.png`, `laptop.png`, `tablet.png`, `mobile.png`, `xs.png`), plus hover, focus, pressed, loading and error states where they exist.
2. A **screen recording of 10 to 20 s** of the motion (scroll plus hover plus click).
3. `perf.md`: LCP, CLS, INP (or interaction latency), TBT, and "percent of frames over 20 ms" during a 10 s scroll, measured with 4x CPU throttle and Slow 4G.
4. `notes.md`: what changed, which variants were tested, which won and why, what remains.
5. The output of `npx impeccable detect` for the changed files.
Use Antigravity Artifacts for screenshots and recordings when available.

---

## Phase 0. Prepare and audit (read-only for design; no visual changes)

| Step | Do | Output |
|---|---|---|
| 0.1 | `git tag pre-redesign`, create branch `redesign/alive`. | tag and branch |
| 0.2 | Verify skills are loaded (section 4 of `00`). | note in `PROGRESS.md` |
| 0.3 | Read all pack files. Write `UNDERSTANDING.md` (maximum 12 bullets: goal, concept, constraints, risks, your plan). | file |
| 0.4 | Run the site locally. With the browser subagent, capture the **baseline**: screenshots of every route at 5 viewports, scroll and hover recordings, a Performance trace (desktop, then mobile emulation with 4x CPU throttle and Slow 4G), a Lighthouse run, and `npx impeccable detect src/`. Run the grep checks in `02`. | `reports/baseline/` |
| 0.5 | Write `AUDIT.md` with the template in `02`: verified findings, confirmed or rejected root-cause hypotheses (with evidence), baseline aliveness score. | file |
| 0.6 | Research: build `MOODBOARD.md` with **at least 20 references**, each with a captured frame, the **technique** to learn, what to steal, what to skip (list of sources in `04` section 10). | file |
| 0.7 | Sketch three storyboards for the hero (frame by frame), as described in `05` section 5. Pick one for the lab. | `reports/storyboards/` |

**Gate 0**: `AUDIT.md` complete with evidence, `MOODBOARD.md` has 20 or more entries, baseline numbers recorded.

---

## Phase 1. Truth and content cleanup (fast wins, shippable on its own)

The biggest "AI slop" signals are not CSS. They are false claims, mixed languages, template names, mismatched images and broken links. Fix them first.

| Step | Do |
|---|---|
| 1.1 | Create the **single source of truth**: `src/content/site-facts.ts` (company facts with a status per fact), `fleet.ts`, `faq.ts`, `categories.ts`. All pages read from these. See `03` for the register and schema. |
| 1.2 | Fix every verified finding F-01 to F-30 in `02` (dates, WhatsApp link, contradictions, English leftovers, fake testimonials, hotlinked stock images, metadata, accessibility names, formats). |
| 1.3 | Rewrite all copy in French using the copy deck in `03`. Unverified claims are hidden or neutral. |
| 1.4 | Make `/vehicules` and `/reserver/modele/[id]` **server-rendered** with layout-matched skeletons (no "Chargement..." text). Per-page metadata and JSON-LD. |
| 1.5 | Write `ASSETS-TODO.md` (shot list, see `04` section 9) and `CLIENT-QUESTIONS.md` (see `03` section 5). |
| 1.6 | Add a content QA script (`scripts/content-qa.mjs`) that fails the build if it finds banned words, English leftovers, template names, hard-coded dates, or non-HTTPS social links (rules in `08`). |

**Gate 1**: content QA script passes, all links return 200 or the right external target, no English strings left, facts register status visible in code. **REPORT checkpoint B.**

---

## Phase 2. Foundations (design system and motion engine)

| Step | Do |
|---|---|
| 2.1 | **Tokens**: colour, type scale, spacing, radii, elevation, motion tokens as CSS variables (see `04`). One file. |
| 2.2 | **Type duel and palette duel** in the lab (`/lab/type`, `/lab/color`): test the candidates in `04` on the real hero, a vehicle card and a form. Score with the rubric in `07`. Log the decision. |
| 2.3 | **Components** in `/lab/components`: buttons (all variants and states), links, inputs, chips, cards, accordion, tabs, toggle, tooltip, toast, skeleton. Every state designed, none left to browser defaults. |
| 2.4 | **Motion engine** (see `05`): provider (Lenis plus GSAP on fine pointer and no reduced motion), motion tokens, reveal system with 6 presets, cursor, magnetic helper, page transition, odometer component, reduced-motion fallbacks. A playground at `/lab/motion` with live sliders for duration, ease and stagger. |
| 2.5 | **Global shell**: grain and vignette overlays, header (all behaviours), footer, mobile action bar, scroll gauge, first-visit instrument-sweep preloader. |

**Gate 2**: every component has all states, the motion playground works with no long tasks over 50 ms, `impeccable detect` is clean on `src/components` and `src/styles`. **STOP checkpoint A** (before Phase 3): show the palette and type decision, the component sheet, the motion playground recording, and the three hero storyboards. Wait for approval.

---

## Phase 3. Home page (section by section)

Order matches the live structure. For each section follow the **section loop** in `08` section 2 and build the signature moments with variants in `/lab` first (see `07`).

| # | Section | Signature moment |
|---|---|---|
| 3.1 | Hero "Arrivée" | car enters from the side, headlights on, runway dashes, Algiers clock, cursor parallax |
| 3.2 | Trust strip (replaces fake stats) | hairlines draw, icons draw, verified claims only |
| 3.3 | Choisissez votre catégorie | category selector stage, car swaps sideways |
| 3.4 | Nos prestations | editorial list with image preview following the cursor |
| 3.5 | La flotte signature | spotlight cards, sideways entries, velocity skew rail |
| 3.6 | Pourquoi choisir DZ Rent Car | overlapping image collage, rotating sticker, four true reasons |
| 3.7 | Vidéo | frame expands on scroll, play halo, lightbox, TikTok strip variant |
| 3.8 | Comment réserver | scrubbed road with a car driving along it |
| 3.9 | Témoignages | real proof only, or the section is replaced (rules in `06`) |
| 3.10 | FAQ and the 3 features | smooth accordion, real answers, FAQ schema |
| 3.11 | CTA band | two headlights, runway leading to the button |
| 3.12 | Footer | tread texture, big outline wordmark, TikTok link |

**Gate 3 (per section)**: evidence pack complete, section passes the aliveness checklist in `02`, accessibility checks pass. **STOP checkpoint D** after 3.1 (Hero) and 3.5 (Fleet): these two are the most visible. Show them, get approval on the direction, then do the rest.

---

## Phase 4. Fleet and vehicle pages

| Step | Do |
|---|---|
| 4.1 | `/vehicules`: SSR, sticky date bar, filters (desktop sidebar, mobile bottom sheet), URL-synced state, sorting, availability states, skeletons, empty state. |
| 4.2 | `/vehicules/[slug]`: gallery and lightbox, line-art draw-on, price table, conditions, sticky booking card, similar vehicles, JSON-LD. |
| 4.3 | **Shared-element transition** from fleet card image to the vehicle hero (see `05` section 7). |

**Gate 4**: evidence packs, transition runs at 60 fps, back and forward navigation works, no scroll-position bugs.

---

## Phase 5. Reservation flow and confirmation

| Step | Do |
|---|---|
| 5.1 | Rebuild the 3-step flow visually (summary card, conditions banner, stepper) keeping the same fields and the same logic. |
| 5.2 | Live eligibility check (age, licence seniority) with helpful alternatives, validation, Algerian phone formatting, progress saved in `sessionStorage`, double-submit guard. |
| 5.3 | **Boarding-pass confirmation** page with "printing" animation and a status timeline. |
| 5.4 | Date and price logic with unit tests (day-count rule, Africa/Algiers, edge cases listed in `08`). |

**Gate 5**: form test matrix in `08` passes, confirmation animation verified, WhatsApp fallback works.

---

## Phase 6. Remaining pages

Services, About, FAQ, Contact, legal pages, 404. See `06`. Only verified claims. **Gate 6**: evidence packs, content QA passes.

---

## Phase 7. Hardening

Performance budgets, accessibility (axe plus keyboard plus screen reader smoke test), SEO (metadata, JSON-LD, sitemap, robots, canonical), basic security (honeypot, rate limiting, input validation, no secrets in the client). Details in `08`.

**Gate 7**: Lighthouse mobile at least 90 performance and 100 accessibility, best practices and SEO on Home, Fleet and Vehicle; LCP at most 2.5 s on Slow 4G emulation; CLS at most 0.02.

---

## Phase 8. Full QA, human test, polish, freeze

| Step | Do |
|---|---|
| 8.1 | Run the full QA matrix in `08` (viewports, browsers, states, reduced motion, slow network). |
| 8.2 | **Human test**: the person shows the site to 5 people on phones using the script in `08` section 9. Collect results in `reports/human-test.md`. |
| 8.3 | Using the impeccable skill: `critique` on every page, then `polish` and `typeset`. Fix every finding or justify in writing. |
| 8.4 | Fresh-eyes pass: stop for a while, then re-read every page as a first-time visitor. "Remove one accessory" from each section. |
| 8.5 | Re-score aliveness (target at least 42 out of 50). |

**STOP checkpoint F**: show the before and after, the scorecard, the human test results, and the list of open client questions. Wait for approval.

---

## Phase 9. Handover

`README.md` (how to run, build, deploy), `docs/redesign/CONTENT-GUIDE.md` (how the client changes prices, cars, photos, FAQ, in plain language), `DECISIONS.md` final, `CLIENT-QUESTIONS.md` final, the motion spec with recordings, a short "how to keep it alive" guide (rules for adding new sections without breaking the system).

---

## Rough effort split (for pacing, not deadlines)

Phase 0: 10%. Phase 1: 10%. Phase 2: 20%. Phase 3: 30%. Phases 4 and 5: 16%. Phase 6: 4%. Phases 7 and 8: 10%.

## Risks and how to handle them

| Risk | Handling |
|---|---|
| Over-animating, which makes the site heavy and tiring | Gates on performance and the "one bold thing per section" rule. Remove before adding. |
| Missing real photos make the site look generic again | Ask for the shot list early (Phase 1). Use consistent grading and cutouts. Never mix mismatched stock. |
| Unverified claims creep back in | The content QA script and the facts register. |
| Lenis or GSAP conflicts with Next.js navigation | Single provider, cleanup on route change, `ScrollTrigger.refresh()` after layout changes, tested back and forward. |
| Mobile looks static because effects were removed | Keep the signature sideways car entries and reveals on mobile, remove only cursor, tilt and heavy parallax. Test on a real mid-range Android. |
| The agent loses the thread in a long session | Re-read `AGENTS.md` and `PROGRESS.md` at the start of every working session. |
