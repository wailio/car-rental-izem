# Aurum Drive — Design System & Architecture Specification

## 1. Aesthetic Direction: "Night Drive"
- **Mood**: Nocturnal, tactile, unhurried.
- **Visual Thesis**: Dark warm surfaces reminiscent of luxury automobile cabins at night (`#0B0A09`), with champagne gold (`#C2A56B`) applied with precision like instrument clusters, needles, and headlight beams.
- **Differentiation Anchor**: Physical automotive gestures — cars gliding in smoothly from the lateral canvas with deceleration and settling suspension, instrument dial arcs, lane markings, and an interactive gold cursor tracker.
- **DFII Score**: 16/19 (Aesthetic Impact: 5, Context Fit: 5, Feasibility: 4, Performance Safety: 4, Consistency Risk: 2) -> Excellent.

---

## 2. Color Palette & Token Definitions (WCAG AA Compliant)

| Token | CSS Variable | Hex / RGBA | Usage |
|---|---|---|---|
| Deep Surface | `--bg` | `#0B0A09` | Page root canvas, obsidian warm tone |
| Frame Surface | `--surface-1` | `#121110` | Inset rounded containers, structural sections |
| Card Surface | `--surface-2` | `#181715` | Default card background, elevated components |
| Raised Surface | `--surface-3` | `#201E1B` | Hover states, active inputs, dropdowns |
| Champagne Gold | `--gold` | `#C2A56B` | Primary metallic accent (sampled from LimoDrive references) |
| Luminous Gold | `--gold-bright` | `#DCC48E` | Interactive hover glow, headlight flare accents |
| Burnished Gold | `--gold-deep` | `#8E7544` | Pressed states, active borders |
| Crisp Ivory | `--ivory` | `#F3EEE4` | Primary high-contrast text |
| Muted Ivory | `--ivory-dim` | `#B9B2A3` | Secondary text, specifications, descriptions |
| Subdued Ivory | `--ivory-mute` | `#8A8478` | Tertiary labels, helper texts |
| Gold Hairline | `--line` | `rgba(194, 165, 107, 0.18)` | Card borders, delicate frames |
| Neutral Hairline | `--line-soft` | `rgba(255, 255, 255, 0.07)` | Secondary dividers, grid markers |
| Success Muted | `--ok` | `#6FAE8B` | Positive verification, availability |
| Warning Muted | `--err` | `#D0705F` | Validation warning, booked dates |

---

## 3. Typography Hierarchy
- **Display Serif**: Cormorant Garamond (`500`, `600`) & Playfair Display for grand headings with tabular and lining figures.
- **Body & Controls**: Inter / Hanken Grotesk sans-serif for crystal clarity, navigation, inputs, and dense telemetry data.
- **Fluid Scale**:
  - `Hero H1`: `clamp(2.75rem, 6vw, 6.5rem)` (line-height: 1.05)
  - `Section H2`: `clamp(2rem, 3.8vw, 4rem)` (line-height: 1.15)
  - `Subhead H3`: `clamp(1.25rem, 2vw, 2rem)`
  - `Body`: `1rem` to `1.0625rem` (16–17px), line-height: 1.6
  - `Eyebrow Pill`: `0.75rem` (12px), uppercase tracking `0.15em`

---

## 4. Radii & Spatial Rhythms
- `--r-xs`: `6px` (badges, micro tags)
- `--r-sm`: `10px` (inputs, select fields, pill tabs)
- `--r-md`: `16px` (cards, floating summaries)
- `--r-lg`: `28px` (cinematic inset rounded frames)
- `--r-pill`: `9999px` (action buttons, CTA chips)

---

## 5. Motion Tokens
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-out-quart`: `cubic-bezier(0.25, 1, 0.5, 1)`
- `--ease-in-out`: `cubic-bezier(0.76, 0, 0.24, 1)`
- GSAP ticker synchronized with Lenis smooth scrolling.
- Reduced motion fallback via media query `@media (prefers-reduced-motion: reduce)`.
