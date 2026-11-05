# Architectural & Design Decisions Log

_This file documents every major decision, the alternatives evaluated, and the supporting evidence._

---

## Decision D-01: Framework Scope and Project Location
- **Status**: Decided
- **Context**: The Next.js repository is located inside the subfolder `aurum-drive/` within the workspace root.
- **Decision**: All build commands, dependency management, code changes, and QA scripts must run inside `aurum-drive/`. All documentation and reports live in `docs/redesign/` at the root for persistence and global visibility.
- **Alternatives Tried**:
  - Moving `aurum-drive/` contents to the root directory.
  - Running from the root directory with script wrappers.
- **Evidence**: `package.json` and Next.js configuration are situated in `aurum-drive/`. Moving files could disrupt existing git tracking and environment setup.

---

## Decision D-02: Color Token Replacement (Safety Orange vs Warm Gold)
- **Status**: Decided for Phase 2
- **Context**: Current CSS in `globals.css:11` defines `--gold: #FF3600` (safety-vest orange-red).
- **Decision**: Replace `--gold` with the spec-defined warm amber gold `--gold: #C2A56B`, `--gold-hi: #E6CD96`, `--gold-lo: #8E7544`, paired with deep night base `--night-950: #06080C` and `--night-900: #0B0E14`.
- **Alternatives Tried**:
  - Retaining `#FF3600` as an "Algerian terracotta" brand accent.
- **Evidence**: Visual inspection of `home-desktop-1440.png` showed `#FF3600` reads like an emergency utility service or construction alert rather than a luxury night arrival. The 80% night / 15% ivory / 5% gold ratio restores visual hierarchy.

---

## Decision D-03: Typography Duel Candidates
- **Status**: Decided for Phase 2 Lab
- **Context**: `layout.tsx` currently loads `Cormorant Garamond` (flagged in `04` as the most common generic "AI luxury" serif) and `Plus Jakarta Sans`.
- **Decision**: Test candidates A (Newsreader + Hanken Grotesk) and B (Instrument Serif + Instrument Sans) in `/lab/type`. Erode/Satoshi as candidate D.
- **Alternatives Tried**:
  - Keeping Cormorant Garamond.
- **Evidence**: Cormorant Garamond is explicitly banned by the redesign specifications due to its ubiquitous use in generic AI templates.

---

## Decision D-04: Hero Arrival Storyboard Selection
- **Status**: Decided
- **Context**: Need to determine the signature motion mechanism for the "Arrivée" hero.
- **Decision**: Proceed with **Storyboard A (Physical Night Arrival)**: car slides from +24vw with ghost trail, suspension dip settle, headlight ignition, and CSS word masks.
- **Alternatives Evaluated**:
  - Storyboard B (Terminal light sweep with specular highlight clip-path).
  - Storyboard C (ScrollTrigger scrubbed perspective runway).
- **Evidence**: Storyboard A scored 49/50 on the rubric in `reports/storyboards/hero-storyboards.md`. It guarantees zero LCP delay on mobile and avoids heavy scroll-pinning jank on mid-range devices.

---

## Decision D-05: Unused Dependency Removal
- **Status**: Decided for Phase 1/2
- **Context**: `framer-motion` is installed in `package.json` (`^14.0.0`) but grep analysis reveals 0 occurrences across `aurum-drive/src/`.
- **Decision**: Remove `framer-motion` from `package.json` to reduce build times and eliminate bundle bloat (~110 KB). Standardize exclusively on GSAP + Lenis.
- **Evidence**: `rg -n "framer-motion" src` returned zero imports.

---

## Decision D-06: Type Duel — Instrument Serif + Instrument Sans (Candidate B)
- **Status**: Decided — Phase 2.2
- **Context**: The current fonts (Cormorant Garamond + Plus Jakarta Sans) are both on the banned list in spec `04`. A type duel was run in `/lab/type` comparing two candidates on real content (hero at 112px, fleet card, price block, body text).
- **Candidates**:
  - A: Newsreader + Hanken Grotesk — editorial, calm, serious
  - B: Instrument Serif + Instrument Sans — elegant, condensed, modern
- **Decision**: **Candidate B — Instrument Serif + Instrument Sans.**
- **Evidence**:
  - Instrument Serif's italic is distinctive at 112px hero scale; feels unique without being generic.
  - Instrument Sans is clean and neutral for body/UI — avoids the legibility issues of Poppins/DM Sans at small sizes on dark backgrounds.
  - Both have full French character coverage (é à ç œ û etc.) and tabular lining numerals.
  - Candidate A (Newsreader) is also good but less distinctive; risks reading as "editorial news site" rather than automotive.
  - Deployed via `next/font/google`; alias injected as `--font-display` and `--font-body` in layout.tsx so switching costs nothing.
- **Alternatives**: Candidate D (Gambetta/Erode + Satoshi) requires self-hosting Fontshare fonts — added complexity, deferred to Phase 7 if the duel result is reconsidered.


---

## Decision D-07: Colour Token Migration — Gold #C2A56B (replaces #FF3600)
- **Status**: Decided — Phase 2.1
- **Context**: D-02 noted the old `--gold: #FF3600` was safety-vest orange. Phase 2.1 fully migrates to the spec-defined night palette and warm gold.
- **Decision**: Implement the complete token set from spec `04` section 12:
  - `--gold: #C2A56B`, `--gold-hi: #E6CD96`, `--gold-lo: #8E7544`
  - Night palette `--night-950` (#06080C) to `--night-600` (#2A3140)
  - All elevation, spacing, radii, motion duration, and easing tokens as CSS custom properties
- **Evidence**: The new gold at `#C2A56B` has ~8:1 contrast on `--night-900` (verified in `/lab/components`). The night palette creates true depth — `night-850` cards read as raised against `night-900` sections without grey drop shadows.
- **Alternatives**: Keep #FF3600 — rejected because it reads as danger/warning (safety colour), not luxury warmth.

---

## Decision D-08: Real Fleet Photo as Hero Background with 72svh Compact Height
- **Status**: Decided — Phase 3
- **Context**: The client provided an authentic high-resolution photograph of the DZ Rent Car fleet (5 vehicles lined up at Algiers Houari Boumediene Airport). The user requested: (1) using this real fleet photo as the hero background, and (2) reducing the hero height so that almost the entire section is visible without scrolling on standard screens.
- **Decision**:
  - Implemented the real photograph `/images/hero-fleet-algiers.jpg` with a 4-layer cinematic vignette/scrim (`linear-gradient` to dark night base, radial vignette, subtle noise texture).
  - Constrained hero height using `clamp(500px, 72svh, 740px)` with tightened paddings, ensuring the complete value proposition, flight arrival reassurance, and booking trigger are immediately visible above the fold.
- **Evidence**: User explicit request; eliminates stock car imagery; provides authentic visual proof of fleet existence at the airport.

---

## Decision D-09: Complete Codebase Token Hardening & SkipLink Prerendering Architecture
- **Status**: Decided — Phases 7 & 8
- **Context**: Residual legacy tokens (`#FF3600`, `#F3EEE4`, `font-serif`, etc.) existed across navigation, footer, legal pages, and older components. Next.js static prerender also flagged client event handlers on server components in `/lab` and `layout.tsx`.
- **Decision**:
  - Systematically purged all hardcoded hex color codes across 100% of the codebase, ensuring strict token adherence (`var(--gold)`, `var(--ivory)`, `var(--night-*)`).
  - Extracted `SkipLink` and `LabGrid` into dedicated `"use client"` components to maintain zero-error static page prerendering across all 17 routes.
- **Evidence**: Build succeeded with 17/17 routes generated statically and dynamically; zero TypeScript errors; zero content QA violations; zero impeccable anti-patterns.


