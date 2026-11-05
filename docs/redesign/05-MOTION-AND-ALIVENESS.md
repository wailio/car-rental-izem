# 05. Motion and Aliveness

This is the file that decides whether the site feels **alive** or **dead**. Read it with `04` open next to it. Use the **gsap-*** skills and **emil-design-eng** while implementing, and use `/lab/motion` to tune everything with sliders before committing numbers.

---

## 1. The eight laws of "alive"

1. **Everything answers.** Every interactive element reacts within 100 ms (hover, press, focus), with tuned easing. No state change snaps.
2. **Motion has intent.** Anticipation, action, settle. Overlap and stagger. Elements arrive from where they belong and leave toward where they go.
3. **Physics, not tweens.** Springs and momentum for anything dragged, pulled or thrown. Animations are **interruptible** (they continue from the current state, never restart).
4. **Coupling.** The page responds to **pointer position, scroll position and velocity, time and touch**. A page that only reacts to "entered the viewport" is dead after one second.
5. **Continuity.** No hard cuts. Shared elements travel between pages (card image to vehicle hero). Page changes feel like moving through one space.
6. **Contrast of tempo.** Calm sections and punchy moments alternate. Silence is part of the choreography. One bold motion per section, quiet elsewhere.
7. **Light and material move.** Headlight glows breathe, a sheen crosses a button, a spotlight follows the cursor, grain is static. The light is alive, not just the boxes.
8. **Never at the cost of speed.** 60 fps, no layout shift, no hydration flash, instant feedback. Jank is the opposite of alive.

---

## 2. Motion tokens (single source: `src/lib/motion-tokens.ts` and the CSS variables in `04`)

| Token | Value | Use |
|---|---|---|
| `press` | 100 ms | pressed feedback |
| `hover` | 220 ms | hover transitions |
| `ui` | 300 ms | menus, tooltips, toggles, tabs |
| `panel` | 480 ms | sheets, accordions, drawers |
| `reveal` | 800 to 1000 ms | scroll reveals |
| `hero` | 1.4 to 2.2 s (whole timeline) | first-load choreography |
| `scrub` | scroll-bound, `scrub: 0.6 to 1` | scrubbed moments |

**Easings**

| Name | CSS | GSAP | Use |
|---|---|---|---|
| out-expo | `cubic-bezier(.16,1,.3,1)` | `expo.out` | hero, reveals, cars arriving |
| out-strong | `cubic-bezier(.23,1,.32,1)` | `power4.out` | hover, UI feedback |
| in-out-strong | `cubic-bezier(.77,0,.175,1)` | `expo.inOut` or `power3.inOut` | wipes, morphs, on-screen movement |
| drawer | `cubic-bezier(.32,.72,0,1)` | custom | sheets and accordions |
| spring | n/a | `elastic.out(1,.5)` (rare) or `quickTo` | magnetic return, drag release |

**Rules**
- **Never `ease-in` for entrances. Never the CSS default `ease`. `linear` only for marquees, idle loops and scrub.**
- **Entrances start from `scale(.95)` and opacity 0, never from `scale(0)`.**
- **Exit is faster than enter** (about 60 to 70% of the enter duration).
- **Overlap**: start the next animation when the previous is about 60 to 70% done.
- **Stagger**: items 60 to 90 ms, cards 80 to 120 ms, words 25 to 40 ms.
- **Distances**: rise 24 to 40 px, side slide 60 px for UI, **18 to 28 vw for cars**.
- **Frequent actions lose their animation**: typing, repeated filter toggles, keyboard navigation answer instantly.
- Emil Kowalski's "under 300 ms" rule applies to **interaction feedback** (hover, press, menus, tooltips). Scroll reveals and brand moments are ambient and do not block input, so they may run 600 to 1200 ms.
- Animate **only** `transform`, `opacity` and `clip-path` (and small `filter` values). Never `width`, `height`, `top`, `left`, `margin`, never `transition: all`. For shadows, animate the **opacity of a pseudo-element** that holds the shadow.

---

## 3. Engine architecture (Next.js App Router)

```text
src/
  lib/motion-tokens.ts        durations, eases, staggers, distances (single source)
  lib/motion/presets.ts       reveal presets (section 4)
  components/motion/
    MotionProvider.tsx        registers GSAP plugins once, Lenis (fine pointer only), cleanup
    Reveal.tsx                <Reveal preset="pop" delay={0.1}> wrapper
    SplitWords.tsx            server-rendered word masks (section 4.3)
    Cursor.tsx                dynamic import, fine pointer only
    Magnetic.tsx              magnetic helper
    Odometer.tsx              rolling digits
    TransitionLink.tsx        page transition link
    Preloader.tsx             instrument sweep (first visit only)
  app/lab/...                 playground and variants (dev only, noindex)
```

- GSAP code runs **only in client components**, inside `useGSAP` (from `@gsap/react`) with a `scope`, so cleanup is automatic.
- Use `gsap.matchMedia()` for every responsive or reduced-motion branch.
- **One provider, one ticker.** Lenis drives the GSAP ticker. No second scroll library.
- After route changes or late layout shifts (images, fonts), call `ScrollTrigger.refresh()`.
- Lenis **only** when `(hover: hover) and (pointer: fine)` and `prefers-reduced-motion: no-preference`. Touch devices keep **native scroll**.
- Pause Lenis (`lenis.stop()`) when a modal or sheet is open; mark scrollable modals with `data-lenis-prevent`.

**Provider (starting point)**

```tsx
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); lenis.destroy(); };
    });
    return () => mm.revert();
  }, []);
  return <>{children}</>;
}
```

(Check the installed GSAP and Lenis versions in their docs and the GSAP skills before relying on any snippet.)

---

## 4. The reveal system (replaces the one-preset fade-up)

### 4.1 Presets

```ts
export const REVEAL = {
  rise:   { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out' },
  pop:    { y: 40, scale: 0.95, autoAlpha: 0, duration: 0.9, ease: 'expo.out' },
  left:   { x: -60, autoAlpha: 0, duration: 1.0, ease: 'expo.out' },
  right:  { x: 60,  autoAlpha: 0, duration: 1.0, ease: 'expo.out' },
  side:   { xPercent: 24, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, // cars, in vw terms via a variable
  wipe:   { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, // images, with inner scale 1.15 to 1
  draw:   { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'expo.out' }, // lines
} as const;
```

### 4.2 Which preset for which content (variety map)

| Content | Preset |
|---|---|
| Small labels, captions | `rise` |
| **Headlines** | **word masks** (4.3) |
| Paragraphs | `rise` (lead paragraphs: line stagger) |
| Cards in a grid or rail | `pop` stagger, or alternating `left` / `right` |
| **Cars** | `side`, with ghost trail and settle (section 5) |
| Images | `wipe` with the inner image scaling 1.15 to 1 |
| Hairlines and dividers | `draw` |
| Icons | stroke `draw` |
| Numbers and prices | `Odometer` roll |
| Buttons | `pop`, after the text (+0.2 s) |

A section may use at most **three** presets. No two consecutive sections open the same way.

### 4.3 Headlines: server-rendered word masks (no waiting for JS)

Split words in React so the markup is ready before hydration and the animation starts at first paint (important for LCP, because the headline is often the LCP element).

```tsx
export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span aria-hidden className="word-mask">
            <span className="word" style={{ ['--i' as string]: i }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
```

```css
.word-mask{ display:inline-block; overflow:hidden; vertical-align:top; padding-bottom:.1em; }
.word{ display:inline-block; transform:translateY(110%);
  animation: word-in 1s var(--ease-out-expo) forwards;
  animation-delay: calc(var(--i) * 70ms + var(--base-delay, 120ms)); }
@keyframes word-in{ to{ transform:translateY(0) } }
@media (prefers-reduced-motion: reduce){ .word{ transform:none; animation:none } }
```

For below-the-fold headlines, trigger the same animation when the heading enters the viewport by adding a class from an `IntersectionObserver` (or use GSAP `SplitText` with `mask: 'lines'` and `autoSplit: true`; check the SplitText docs of the installed version).

### 4.4 Safe visibility (no invisible content, ever)

- `html.js` class added by a tiny inline script in `<head>`. CSS hides revealables **only** under `.js` (`.js [data-reveal]{opacity:0}`), and `<noscript>` shows everything.
- **Hero content is never hidden waiting for JS.** It is visible in the server HTML and animated by CSS.
- Failsafe: if ScrollTriggers have not initialised after 4 s, add `reveal-failsafe` to `<html>` and show everything.
- Triggers use `once: true`. Never hide something again after it has appeared.

---

## 5. Signature moments (build each with variants in `/lab` first)

Each has a **timeline**, **mobile rule**, **reduced-motion rule** and **acceptance test**.

### S1. Hero "Arrivée" (the first impression)

| t (s) | What happens |
|---|---|
| 0.0 | Background image or video visible immediately (scale 1.12, slightly dim). Starts a slow settle to 1.04 over 2.4 s, then a 28 s ken-burns drift. |
| 0.10 | Header drops in (y -24 to 0, fade, 0.8 s). |
| 0.12+ | **H1 words rise** from their masks, 70 ms apart (CSS, starts at first paint). |
| 0.5 | Sub-text rises (0.8 s). |
| 0.6 to 2.1 | **The car arrives**: from 24 vw off to the right to its place, 1.5 s `expo.out`, with a **ghost trail** (two faded copies lagging 60 ms and 120 ms at 25% and 12% opacity, removed after arrival). |
| 1.7 | **Settle**: a 0.5° rock and a 3 px dip, 0.5 s. |
| 1.9 | **Headlights on**: warm glow sprite fades in (0.4 s), the cone sweeps forward (clip-path wipe), dust motes brighten. |
| 0.7 | Primary and secondary buttons pop (stagger 80 ms). |
| 1.0 | Booking bar slides up (y 40 to 0) and its fields stagger (60 ms). |
| 1.4 | Runway dashes begin their idle drift; "Alger · {HH:MM}" chip fades in. |
| scroll | Scrubbed exit: car drifts right (+10 vw) and scales to 1.06, background parallax -8%, text rises and fades. |
| pointer | Desktop parallax with lerp 0.08: background ±6 px, car ±14 px, light glow ±22 px, foreground dashes ±30 px. |

- **Mobile**: no pointer parallax, no ghost trail beyond one copy, car arrives with a shorter distance (12 vw), poster image instead of video on slow connections.
- **Reduced motion**: everything visible at once, a 300 ms fade, headlights simply on.
- **Acceptance**: LCP at most 2.0 s on Slow 4G emulation, whole timeline at most 2.2 s, zero layout shift, 60 fps (at most 3% of frames over 20 ms), the headlight moment is clearly visible in the recording.

### S2. First-visit preloader and odometer numerals

- **Instrument sweep** (first visit per session only, at most 1.1 s): an SVG gauge ring appears, the needle sweeps from -120° to +120° (0.55 s `power2.inOut`) and back to idle (0.35 s with a hint of overshoot) while the DZ monogram draws at the centre. The overlay then wipes up (`clip-path`, 0.5 s) revealing the hero. Content loads **beneath** it, so it never delays LCP. Skip it if hydration happens after 1.2 s, on reduced motion, on repeat visits in the same session, and on slow connections.
- **Odometer** (`Odometer.tsx`): each digit is a column with a strip of 0 to 9; animate the strip with `yPercent: -10 * digit`, `power3.out`, 0.9 s, staggered right to left by 40 ms. `aria-label` carries the final value ("30 000 DA"); columns are `aria-hidden`. Use it for every price change (dates, category, filter) and any real counter.

### S3. Category stage: the car swaps sideways

- Selector pills with a **sliding gold indicator** (Flip, 0.5 s `power3.inOut`).
- Selecting a category: current car exits **left** (`x: -12vw`, opacity 0, 0.45 s, `power3.in` is acceptable here because it is an exit) while a few **speed streaks** flash (0.25 s). The new car enters from the **right** (`x: 14vw` to 0, 0.9 s `expo.out`) and settles. Name and "À partir de" swap with word masks (50 ms stagger). The price rolls with the odometer.
- **Interruptible**: use `overwrite: 'auto'`; rapid clicks continue from the current state.
- **Keyboard**: `role="tablist"`, arrow keys move the selection. **Mobile**: pills scroll horizontally with snap, the stage stacks, swap distance 8 vw.

### S4. Fleet: spotlight cards, sideways entries, velocity rail

- **Entrance**: cards alternate `left` / `right` with `pop`, stagger 100 ms. The car in each card slides in from the card's own edge, then the cast shadow grows.
- **Spotlight border** following the cursor (CSS variables `--mx`, `--my`, section 9).
- **Hover** (fine pointer): the card lifts 6 px, the car slides forward 14 px and scales 1.04, the light plate brightens, the arrow swaps.
- **Velocity skew** on the rail: cards skew up to 5° with scroll velocity and relax when scrolling stops.
- **Lab variants**: (A) asymmetric 3-by-2 grid; (B) draggable rail with inertia. Mobile always uses native scroll-snap.

### S5. Comment réserver: the road scrub

- A vertical **lane line** (dashed) runs beside the four steps. A top-down **car** travels along it as you scroll (`scrub: 0.8`), headlights lighting the line ahead.
- As the car passes a step: the step goes from 40% to 100% opacity, its number turns gold, its hairline draws, the car does a tiny **brake dip** (3 px) and the headlights flash once.
- Desktop: the left column (title, counter "02 / 04") is sticky. Mobile: no pin, a smaller car, the line draws with scroll.
- Variant B in the lab: a horizontal runway with a side-view car.

### S6. Video: the frame expands

- The video frame starts **inset** (margins about 3 vw, radius 32 px) and, scrubbed with the scroll, expands to nearly full-bleed (radius 12 px), the poster parallaxes (yPercent -8 to 8), the overlay lightens (0.55 to 0.35), the text rises at 40% progress.
- **Play button**: gold circle, an **orbiting dot** on an outlined ring (6 s linear), a **pulse ring** (scale 1 to 1.5, opacity .5 to 0, 2.4 s), only while in view. Cursor label "Lecture".
- Click: the frame **expands to a lightbox** with Flip, video starts, `Esc` or a close button reverses it, focus is trapped, the video pauses on close.
- **TikTok strip variant** (if the footage is vertical): four phone-frame clips with a staggered vertical offset; each autoplays muted when in view, pauses when off-screen (`IntersectionObserver`), uses a poster, `playsInline`, `preload="none"`.

### S7. Fleet card to vehicle page: shared element + line art

Navigation continuity with a **manual FLIP** (robust across App Router routes):
1. On card click, store `{ slug, rect: img.getBoundingClientRect(), src }` in `sessionStorage`.
2. On the vehicle page, before first paint, position the hero image at the stored rect (`x`, `y`, `scaleX`, `scaleY`, `transformOrigin: 'top left'`), then animate to identity (0.9 s `expo.out`).
3. Other content rises in after 0.3 s (stagger). The line-art SVG **draws** (`stroke-dashoffset`, 1.2 s), the photo fades in behind it.
4. If no stored rect exists (direct visit, back navigation), run the standard entry (image wipe from the side).
Evaluate the View Transitions API and any React or Next.js `ViewTransition` support in the installed version as an alternative; keep the manual FLIP as the fallback.

### S8. Boarding-pass confirmation

- The pass **prints in**: `clip-path: inset(0 0 100% 0)` to `inset(0)` over 0.9 s (`power2.out`) with a 40 px drop; the stub slides out slightly.
- The reference code **scrambles then settles** (0.8 s). A **check ring draws** (stroke). Status timeline dots light one by one (150 ms stagger). A **gold glint** sweeps once across the pass. Runway dashes run under it.
- Buttons: "Partager sur WhatsApp", "Ajouter au calendrier (.ics)".
- **Reduced motion**: pass visible immediately.

### S9. CTA band: two cars, one button

Two cut-outs slide in from opposite sides and stop facing each other, **headlights flash once**, runway dashes lead to the button, the button pops. Triggered once at 70% viewport. If there is only one cut-out, use one car and the headlight flash.

### S10. Page transitions (at most 800 ms in total)

A skewed, gold-tinted **light-sweep panel** crosses left to right (0.45 s `power3.inOut`), covering the page. The route changes at about 50%. The new page reveals as the panel exits (0.45 s). Back and forward use no overlay (instant). If navigation takes longer, the panel holds with a thin runway progress line. Reduced motion: a 150 ms crossfade.

### S11. Footer wordmark that lights up

A giant outline wordmark ("DZ RENT CAR", `-webkit-text-stroke` in gold at 25% opacity, transparent fill) and a radial gold mask that follows the cursor (`--mx`, `--my`) revealing a filled version.

### S12. Statement that fills with scroll (optional, between sections)

A quiet section with one sentence ("Vous atterrissez. On s'occupe du reste.") whose words go from `--ivory-mute` to `--ivory` as you scroll (`scrub`, stagger on words). Cheap, calm, effective.

---

## 6. Micro-interactions catalogue

| Element | Behaviour |
|---|---|
| Link | underline wipes in via `background-size` (220 ms out-strong); arrow nudges 4 px |
| Primary button | sheen, arrow swap, magnetic, press scale .97 (section 6 of `04`) |
| Card | lift 6 px (spring), spotlight border, image scale 1.04 over 700 ms, arrow swap |
| Nav | active indicator slides between items (Flip, 450 ms) |
| Accordion | `grid-template-rows: 0fr to 1fr` in 480 ms with the drawer curve, plus and minus morph 220 ms |
| Menu (mobile) | circular clip-path expansion from the button (600 ms in-out), links rise 60 ms apart |
| Toggle | thumb spring 260 ms |
| Select or listbox | scale from .96 and fade (180 ms) from the trigger |
| Tooltip | delay on first open, instant after |
| Date picker | month slide 320 ms, range fill grows between the two days, day count rolls |
| Gallery lightbox | Flip from the thumbnail |
| Toast | rises 12 px and fades in 240 ms, leaves in 160 ms |
| Skeleton | slow gold-tinted shimmer (opacity only, 1.6 s) |
| Focus ring | appears instantly, never animated away (accessibility) |

---

## 7. The cursor (desktop, fine pointer only)

- A gold ring **24 px, 3 to 4 px stroke**, transparent centre (matches `ref-04`), follows with a lag (`quickTo`, 0.45 s, `power3`). Native cursor stays visible. Variant to test: ring plus a 4 px centre dot.
- **States** via `data-cursor` on elements: `link` (scale 1.7, faint gold fill), `view` (84 px, label "Voir"), `play` (84 px, label "Lecture"), `drag` (84 px, label "Glisser" with arrows), `hide` (over inputs and text areas). Press: scale .85. Leaves the window: fades.
- Event delegation (`pointerover` on `document`, `closest('[data-cursor]')`). `pointer-events: none`, very high z-index, never causes layout.
- **Spotlight**: sections or cards with `data-spotlight` update `--mx` and `--my`; the radial gold glow is 8 to 12% opacity and 240 px wide.

```ts
const ring = document.querySelector<HTMLElement>('.cursor')!;
const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
document.addEventListener('pointerover', (e) => {
  const el = (e.target as HTMLElement).closest('[data-cursor]');
  ring.dataset.state = el?.getAttribute('data-cursor') ?? 'default';
  ring.dataset.label = el?.getAttribute('data-cursor-label') ?? '';
});
```

---

## 8. Idle life (the layer that keeps the page breathing)

Calm, tiny, cheap:

| Idle behaviour | Spec |
|---|---|
| Hero ken-burns | scale 1.04 to 1.10, 28 s, `sine.inOut`, yoyo |
| Runway drift | transform loop, 3.4 s linear, width of one dash cycle |
| Edge lights | sequenced opacity flash, 1.6 s loop |
| Headlight breathing | opacity .85 to 1, 3.2 s |
| Gauge needle | random ±1.5° every 2 to 4 s |
| Light-cone dust | 12 CSS-only motes floating (opacity and transform), no canvas |

**Rules**: at most **two idle behaviours per viewport**. Gate every loop with `IntersectionObserver` (run only in view). Pause when `document.hidden`. None under reduced motion or `saveData`.

```css
.runway{ position:relative; height:2px; overflow:hidden;
  mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent); }
.runway::before{ content:''; position:absolute; top:0; bottom:0; left:0; right:-84px;
  background:repeating-linear-gradient(90deg,var(--gold-hi) 0 28px,transparent 28px 84px);
  animation:runway 3.4s linear infinite; will-change:transform; }
@keyframes runway{ to{ transform:translateX(-84px) } }
```

---

## 9. Reusable recipes

**Magnetic button**

```ts
const strength = 0.25;
const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
el.addEventListener('pointermove', (e) => {
  const r = el.getBoundingClientRect();
  xTo((e.clientX - (r.left + r.width / 2)) * strength);
  yTo((e.clientY - (r.top + r.height / 2)) * strength);
});
el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
```

**Spotlight border (CSS)**

```css
.card{ position:relative; --mx:50%; --my:50%; }
.card::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
  background:radial-gradient(240px circle at var(--mx) var(--my), rgba(230,205,150,.55), transparent 60%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0; transition:opacity 300ms var(--ease-out-strong); }
.card:hover::before{ opacity:1; }
```

```ts
// update CSS variables with delegation, throttled by rAF
let raf = 0;
grid.addEventListener('pointermove', (e) => {
  const card = (e.target as HTMLElement).closest<HTMLElement>('.card'); if (!card) return;
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});
```

**Hero car timeline (after hydration)**

```ts
const tl = gsap.timeline({ delay: 0.6, defaults: { ease: 'expo.out' } });
tl.fromTo('.hero-car',   { xPercent: 24, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.5 })
  .fromTo('.hero-ghost', { xPercent: 24, autoAlpha: 0.25 }, { xPercent: 0, autoAlpha: 0, duration: 1.5, stagger: 0.06 }, 0)
  .to('.hero-car', { rotation: -0.5, y: 3, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.2')
  .to('.hero-headlights', { autoAlpha: 1, duration: 0.4 }, '-=0.1')
  .fromTo('.hero-cone', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7 }, '<');
```

**Road scrub (Comment réserver)**

```ts
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
gsap.to('.road-car', {
  motionPath: { path: '#lane', align: '#lane', autoRotate: true, alignOrigin: [0.5, 0.5] },
  ease: 'none',
  scrollTrigger: { trigger: '.how', start: 'top 70%', end: 'bottom 30%', scrub: 0.8 },
});
```

**Velocity skew**

```ts
const skewTo = gsap.quickTo('.fleet-card', 'skewX', { duration: 0.4, ease: 'power3' });
ScrollTrigger.create({
  trigger: '.fleet-rail',
  onUpdate: (self) => skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -400)),
});
ScrollTrigger.addEventListener('scrollEnd', () => skewTo(0));
```

**Manual FLIP between routes**

```ts
// fleet card click
sessionStorage.setItem('flip', JSON.stringify({ slug, rect: img.getBoundingClientRect().toJSON(), src: img.currentSrc }));

// vehicle page, before paint
const s = JSON.parse(sessionStorage.getItem('flip') ?? 'null');
if (s?.slug === slug) {
  const r = hero.getBoundingClientRect();
  gsap.set(hero, { x: s.rect.left - r.left, y: s.rect.top - r.top,
    scaleX: s.rect.width / r.width, scaleY: s.rect.height / r.height, transformOrigin: 'top left' });
  gsap.to(hero, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.9, ease: 'expo.out' });
  sessionStorage.removeItem('flip');
}
```

**Scrub text fill**

```ts
const split = SplitText.create('.statement', { type: 'words' });
gsap.fromTo(split.words, { color: 'var(--ivory-mute)' }, {
  color: 'var(--ivory)', stagger: 0.1, ease: 'none',
  scrollTrigger: { trigger: '.statement', start: 'top 75%', end: 'bottom 40%', scrub: 0.6 },
});
```

**Odometer digit**

```ts
// strip contains digits 0..9 stacked (each 1em tall)
gsap.to(strip, { yPercent: -10 * digit, duration: 0.9, ease: 'power3.out', delay: i * 0.04 });
```

---

## 10. Mobile motion policy

Keep what makes it alive: **reveals, the sideways car entries, the preloader (shortened), odometer, press feedback, bottom-sheet physics**.
Remove: **cursor, magnetic, tilt, spotlight, pointer parallax, heavy scrubbed pins, ghost trails (keep one), Lenis**.
Also: shorter distances (about 60% of desktop), fewer simultaneous animations, native scroll, `touch-action` set correctly on draggables, test on a mid-range Android with 4x CPU throttle, never exceed the frame budget.

## 11. Reduced motion and data saver

| Normal | `prefers-reduced-motion: reduce` |
|---|---|
| Reveals (rise, pop, side) | 200 to 300 ms opacity fade only |
| Cars arriving | appear in place, headlights on |
| Parallax, ken-burns, idle loops | off |
| Lenis, cursor, spotlight, magnetic | off |
| Preloader | skipped |
| Page transition | 150 ms crossfade |
| Odometer | instant |
| Road scrub | static, steps highlighted via `IntersectionObserver` |

`saveData` or slow connection: poster instead of video, no particles, no heavy loops.

## 12. Performance rules for motion

- Only `transform`, `opacity`, `clip-path`, tiny `filter`. No animated `box-shadow` (use a pseudo-element's opacity), no animated `backdrop-filter`.
- `will-change: transform` only while animating (GSAP `force3D` handles most cases). Clean up after.
- Use `ScrollTrigger.batch` for lists. Avoid pinning on mobile. `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Decode images before animating them (`img.decode()`), reserve space (width, height, aspect-ratio) so triggers measure correctly. Call `ScrollTrigger.refresh()` after fonts and images settle.
- `content-visibility: auto` with `contain-intrinsic-size` for heavy below-fold sections (refresh triggers afterwards).
- Fewer than about 60 concurrently animating elements. Gate loops with `IntersectionObserver`.
- Read then write the DOM (no layout thrash inside tickers).
- Measure with 4x and 6x CPU throttle. Target at most 3% of frames over 20 ms during a 10 s scroll.

## 13. Debugging and tuning tools

- **`/lab/motion`**: a playground that exposes duration, ease, stagger and distance sliders for each preset, and a **slow-motion** control (`gsap.globalTimeline.timeScale(0.25)`) to inspect at quarter speed.
- **`?motion=debug`**: overlay with FPS, long-task count, active ScrollTrigger count, and ScrollTrigger `markers`.
- Frame-time check (paste in the console, then scroll for about 10 s):

```js
(() => { const d = []; let last = performance.now();
  function f(t) { d.push(t - last); last = t;
    if (d.length < 600) requestAnimationFrame(f);
    else { const bad = d.filter(x => x > 20).length;
      console.table({ frames: d.length, over20ms: bad, pct: (bad / d.length * 100).toFixed(1) + '%', worst: Math.max(...d).toFixed(1) + 'ms' }); } }
  requestAnimationFrame(f); })();
```

## 14. Failure modes to test for

- Flash of invisible content (reveal hides, JS late). Fix with section 4.4.
- Double triggers after route changes (kill and recreate in `useGSAP` cleanup).
- ScrollTrigger measured before images load (reserve space, refresh).
- Lenis plus anchor links or modals (`lenis.scrollTo`, `lenis.stop()`).
- Stuck hover states after fast in-and-out (interruptible tweens, `overwrite: 'auto'`).
- Hydration mismatch from random values or dates computed on the server (compute on the client).
- Memory leaks from event listeners (remove on cleanup) and from idle loops that never pause.
- Reduced-motion users seeing nothing (every reveal has a visible fallback).
