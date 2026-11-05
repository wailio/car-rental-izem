/**
 * Motion tokens — single source of truth for all animation values.
 * CSS variables are in globals.css :root. This file mirrors them
 * for use in GSAP and TypeScript code.
 *
 * Rule: only animate transform, opacity, clip-path. Nothing else.
 * Rule: entrances start from scale(.95) + opacity 0, never scale(0).
 * Rule: exits run at 60–70% of entrance duration.
 * Rule: stagger items 60–90 ms, cards 80–120 ms, words 25–40 ms.
 */

// ── Durations (ms) ───────────────────────────────────────────────────────────
export const DUR = {
  press: 0.1,      // 100 ms — pressed feedback
  hover: 0.22,     // 220 ms — hover transitions
  ui: 0.3,         // 300 ms — menus, tooltips, toggles, tabs
  panel: 0.48,     // 480 ms — sheets, accordions, drawers
  reveal: 0.9,     // 900 ms — scroll reveals (800–1000 ms range)
  hero: 1.4,       // 1.4 s  — first-load choreography start
  exit: 0.6,       // 60% of reveal — exits are faster than entrances
} as const;

// ── Easings ──────────────────────────────────────────────────────────────────
// These map to CSS variables in :root for CSS transitions.
// Use the GSAP string form in gsap.to() etc.
export const EASE = {
  outExpo: "expo.out",            // hero, reveals, cars arriving
  outStrong: "power4.out",        // hover, UI feedback
  inOutStrong: "expo.inOut",      // wipes, morphs, on-screen movement
  drawer: "power3.inOut",         // sheets and accordions
  spring: "elastic.out(1, 0.5)", // magnetic return, drag release (rare)
} as const;

// ── Stagger (seconds between items) ──────────────────────────────────────────
export const STAGGER = {
  items: 0.07,   // 70 ms  — list items, inline elements
  cards: 0.1,   // 100 ms — fleet cards
  words: 0.03,  // 30 ms  — split-text word reveals
  chars: 0.015, // 15 ms  — split-text char reveals (rare)
} as const;

// ── Distances (px or vw) ─────────────────────────────────────────────────────
export const DIST = {
  riseY: 32,      // px — default reveal rise
  slideX: 60,     // px — UI element side entrance
  carX: 22,       // vw — car sliding in from the side (18–28 vw)
  hover: 14,      // px — car card lift on hover
  magnetic: 0.25, // strength — magnetic button pull (0–1)
} as const;

// ── Scroll scrub ─────────────────────────────────────────────────────────────
export const SCRUB = {
  default: 0.6,
  smooth: 1,
} as const;
