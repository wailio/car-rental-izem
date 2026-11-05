# 04. Art Direction and Design System

This file defines how the site looks. It is a **direction with decisions to test**, not a list to obey blindly. Where it says "duel", you build the candidates in `/lab`, compare them on the real content, score them with the rubric in `07`, and log the winner in `DECISIONS.md`.

---

## 1. Concept: "Arrivée"

You land in Algiers at night. The airport glass glows, the apron is quiet, the runway lights fade behind you. Outside the doors, a car is waiting with its headlights on. Everything is ready. Nothing shouts.

That scene gives the site its logic:

| Element | Meaning | Where it shows up |
|---|---|---|
| **Cool deep night** (blue-black) | calm, space, the sky behind the airport | page and section backgrounds |
| **Warm gold light** | headlights, runway lights, terminal glow | accents, light sweeps, key buttons, line work |
| **Ivory text** | clean signage on a dark wall | headlines and body |
| **Runway lines and edge lights** | arrival, direction, approach | dividers, loaders, connectors, the CTA band |
| **Instrument-cluster gauges and odometer digits** | the car coming alive | preloader, price numerals, scroll gauge |
| **Boarding-pass ticket** | "your trip is confirmed" | reservation confirmation |

**One light source rule.** All highlights, shadows and glows agree on the same warm key light (headlights and terminal glow, from the upper left or from the car's front). A site feels "real" when its light is consistent.

**First three seconds**: a dark, wide, quiet frame. A car slides in from the side and its headlights come on. A fine gold line moves along the bottom like runway dashes. The headline appears line by line with weight. The cursor leaves a soft ring. Nothing is loud, everything is alive.

---

## 2. Colour

### Tokens (copy into `src/styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--night-950` | `#06080C` | page base, deepest areas, footer |
| `--night-900` | `#0B0E14` | default section background |
| `--night-850` | `#10141C` | cards, panels |
| `--night-800` | `#161B25` | inputs, raised surfaces |
| `--night-700` | `#1E2430` | hover surfaces |
| `--night-600` | `#2A3140` | strong borders, disabled |
| `--ivory` | `#F4EFE6` | primary text |
| `--ivory-dim` | `#B5B0A5` | secondary text |
| `--ivory-mute` | `#8B8A86` | tertiary text, placeholders (check contrast) |
| `--gold` | `#C2A56B` | accent (kept from the existing direction) |
| `--gold-hi` | `#E6CD96` | hover, highlights, light sweeps |
| `--gold-lo` | `#8E7544` | pressed, fills at low opacity |
| `--headlight` | `#FFF1D0` | the brightest light only (headlight core, glints) |
| `--ok` | `#2FA37A` | "Disponible", "Confirmée" (muted emerald) |
| `--err` | `#E5675A` | errors (muted red) |
| `--warn` | `#E3B04B` | warnings |
| `--line` | `rgba(255,255,255,.08)` | hairlines |
| `--line-gold` | `rgba(194,165,107,.28)` | gold hairlines |

Approximate contrast on `--night-900` (verify in the browser): ivory about 16:1, ivory-dim about 9:1, ivory-mute about 5.6:1, gold about 8:1, dark text on gold about 8:1, ok about 6:1, err about 6:1.

### Rules
- **Ratio**: about 80% night surfaces, 15% ivory (text), 5% gold. Gold is **light**, not paint. If gold is everywhere, nothing is highlighted.
- **One hot element per viewport**: the primary button or the one key detail glows gold. Everything else is ivory or a gold hairline.
- **Allowed gradients** (only these): (1) a soft radial warm glow behind a light source, (2) vignettes and scrims for text over photos, (3) the gold button's gentle vertical sheen, (4) a gold sweep that crosses a surface on hover. No purple, no blue-purple, no rainbow, no gradient text on headlines.
- **Dark mode only.** No light theme.
- **Palette duel** (`/lab/color`): compare the **cool night** above with a **warm black** variant (`#0B0A09` base, same gold) on the real hero photo. Pick the one where the photos and the gold feel most harmonious. Log it.

---

## 3. Typography

### The duel (do not default to common AI picks)

**Avoid** (they read as generic): Inter, Roboto, Arial, system fonts, Space Grotesk, Poppins, DM Sans, DM Serif Display, Playfair Display, Montserrat, and **Cormorant Garamond** (the most common "AI luxury" serif, very likely what the current site uses).

Build these candidates on the real hero, a fleet card, a vehicle price block, and the reservation form, at desktop and mobile:

| Candidate | Display | Body and UI | Feel |
|---|---|---|---|
| A | **Newsreader** (variable, optical size) | **Hanken Grotesk** | editorial, calm, serious |
| B | **Instrument Serif** (regular and italic) | **Instrument Sans** | elegant, condensed, modern |
| C | **Fraunces** (soft, optical size, wonk off) | **Geist** | warm, human, a little quirky |
| D | **Gambetta** or **Erode** (Fontshare, self-hosted) | **Satoshi** or **General Sans** (Fontshare) | designer feel, distinctive |
| E | **All sans**: Satoshi or General Sans, large, weight 500, tracking -0.03em | same | "quiet aviation signage" |

**Selection criteria**: complete French and Latin-extended coverage (é è ê à â ç œ ù û ô î ï), **tabular lining numerals** (prices, dates), a good weight range, optical sizes for display, still legible at 16 px on dark, renders beautifully at 112 px, woff2 subset at most about 70 KB per weight, web licence clear, a sensible Arabic partner for later (for example IBM Plex Sans Arabic, Noto Naskh Arabic or Readex Pro).

**Dark-mode tips**: hairline serifs vanish at small sizes, so use the display serif only at 28 px and above. Light text on dark looks slightly heavier, so you can run body at 400 rather than 500.

### Scale (fluid)

```css
--fs-hero:    clamp(2.75rem, 1.2rem + 6.2vw, 7rem);    /* 44 to 112 px */
--fs-display: clamp(2.25rem, 1.1rem + 4.2vw, 5rem);
--fs-h2:      clamp(2rem, 1.1rem + 3.4vw, 4.25rem);
--fs-h3:      clamp(1.375rem, 1rem + 1.2vw, 2rem);
--fs-lead:    clamp(1.125rem, 1.02rem + .5vw, 1.375rem);
--fs-body:    clamp(1rem, .96rem + .2vw, 1.125rem);
--fs-small:   .875rem;
--fs-micro:   .75rem;
```

| Role | Line height | Tracking | Notes |
|---|---|---|---|
| Hero | 1.0 | -0.025em | the biggest thing on the page, huge contrast with body |
| H2 | 1.06 | -0.02em | one or two lines, never three |
| Body | 1.65 | 0 | measure 60 to 68 characters |
| Small | 1.5 | +0.01em | |
| Micro label | 1.2 | +0.14em, caps | **only** pill labels and status chips; never as a default under every heading |

### Voice in type
- **Scale contrast is the secret**: a hero at 100 px next to 16 px body feels designed. A heading at 32 px next to 18 px body feels templated.
- **Headline treatments vary by section**: line-mask reveal (default), one **accent phrase** with a hand-drawn gold underline (use on 4 or 5 key headlines only), an italic word, or plain. Do not give every heading the same recipe.
- **Hand-drawn underline**: an SVG path with a slight irregularity, stroke gold 2 px, round caps, drawn with `stroke-dashoffset`. Example path: `M2 10 C 40 2, 90 14, 140 6 S 220 8, 258 4` (scale to the phrase width). Make two or three variants and alternate.
- **Numerals**: prices, dates, counters use tabular lining figures. Prices are a design element: large, calm, aligned.
- **Loading**: `next/font` with subsets, `display: swap`, a metric-matched fallback (`size-adjust`, `ascent-override`) so text does not shift. Preload the display font file.

---

## 4. Space, grid and rhythm ("spacious" is a feature)

```css
--s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 32px;
--s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px; --s-11: 176px;
--gutter: clamp(20px, 4vw, 64px);
--container: 1320px;
--section-y-lg: clamp(120px, 16vw, 240px);
--section-y-md: clamp(88px, 12vw, 176px);
--section-y-sm: clamp(56px, 8vw, 112px);
```

**Rhythm is what stops a page feeling like a stack of blocks.** Give each home section a **tempo**:

| Section | Tempo | Layout idea |
|---|---|---|
| Hero | tall, dense with light | inset frame, huge headline, car bleeding out of the frame |
| Trust strip | compact | five columns separated by hairlines, one line each |
| Catégories | medium, immersive | selector row plus a large stage |
| Prestations | airy list | big serif rows with lots of space |
| Flotte | dense but organised | asymmetric cards or a rail |
| Pourquoi | asymmetric | overlapping images off-centre, text column offset |
| Vidéo | full-bleed | the frame expands, minimal text |
| Comment réserver | tall, scrubbed | sticky left title, right steps, road line |
| Témoignages | quiet | one large quote, lots of black |
| FAQ | two columns | sticky left, accordion right |
| CTA | full-bleed, centred | two cars, runway, one button |
| Footer | dense, textured | tread pattern, giant outline wordmark |

**Space rules**
- Alternate **dense and airy**. After a busy section, give a quiet one.
- Alternate **inset frames** (rounded, with margin) and **full-bleed** sections.
- **Break the centre line.** Not every section is a centred heading above a grid. Offset columns, hang headings to the left, let images overlap.
- Use negative space as a designed element: a section may contain only a headline and a button.
- **Never** reuse the same vertical padding for all sections. Use `-sm`, `-md`, `-lg` deliberately.

### Mobile
Same system, tighter: gutter 20 px, section padding `-sm` or `-md`, hero text first then the car, bottom action bar, thumb-reachable controls (primary actions in the lower 40% of the screen).

---

## 5. Shape, depth, light and material

### Radii (hierarchy, not one value)
`--r-xs 6` (chips, small tags) · `--r-sm 10` · `--r-input 14` · `--r-md 16` · `--r-card 20` · `--r-lg 28` (frames) · `--r-xl 32` (hero and video frames) · `--r-pill 999` (buttons, pills). Media inside a card uses the card radius minus its padding.

### Elevation (dark mode uses light edges and deep ambient shadows, not grey drop shadows)

```css
--elev-1: 0 0 0 1px rgba(255,255,255,.06);
--elev-2: 0 1px 0 rgba(255,255,255,.06) inset, 0 12px 32px -14px rgba(0,0,0,.65);
--elev-3: 0 1px 0 rgba(255,255,255,.08) inset, 0 28px 60px -24px rgba(0,0,0,.75),
          0 0 0 1px rgba(194,165,107,.10);
--glow-gold: 0 10px 40px -10px rgba(194,165,107,.45);
```

### Glass (use sparingly: hero booking bar, header on scroll, menu overlay, lightbox chrome)
`background: rgba(16,20,28,.55); backdrop-filter: blur(18px) saturate(1.2); border: 1px solid rgba(255,255,255,.10); box-shadow: var(--elev-3);` plus a faint noise layer. Provide a solid fallback (`rgba(16,20,28,.92)`) where `backdrop-filter` is unsupported. **Never animate blur** and keep glass areas small (it is expensive).

### Light
Build three lights, all **pre-rendered as gradient sprites or CSS radial gradients**, animated only with opacity and transform:
1. **Headlight cone and bloom** in the hero and the CTA band (warm, `mix-blend-mode: screen`).
2. **Terminal glow**: a faint warm radial at the top of dark sections (the footer spotlight in the reference).
3. **Cursor spotlight** on desktop: a 240 px radial gold glow at 8 to 12% opacity that follows the pointer inside cards and sections.

### Material
- **Film grain**: static noise tile at 3 to 4% opacity over the whole page (no animation, so it is free).
- **Vignette** on photographs for legibility.
- **Tyre-tread chevron** pattern at 3 to 4% on the footer and the CTA band.
- **Edge highlight**: a 1 px top inner highlight on raised surfaces.

### The "runway" line and shape language
All thin, gold or ivory, 1 px, low opacity unless focused. **Maximum two shapes per viewport; every shape has a job.**

| Shape | Job | Where |
|---|---|---|
| **Runway centreline dashes** (28 x 2 px, gap 56 px) | separate, lead the eye, show motion | hero bottom, CTA band, loaders; slow idle drift |
| **Edge-light dots** (5 px, spaced 48 px, sequenced flash like approach lights) | direction, arrival | hero bottom, CTA band (sparingly) |
| **Dial arcs** with ticks | gauge and numbers | behind counters and the scroll gauge |
| **Lane line** (dashed, vertical) | connect steps | Comment réserver |
| **Boarding-pass notches and perforation** | confirmed ticket | confirmation page |
| **Registration crosses** (12 px plus) | frame and grid corners | rare, on frames |
| **Rotating text badge** (SVG text on a circle, 96 px) | a single sticker: "Livraison gratuite à l'aéroport" | once, on the Pourquoi collage |
| **Hairlines** | structure | dividers, card borders |

No blobs, no soft gradient orbs, no random circles.

---

## 6. Buttons (the part people touch most)

### Variants
| Variant | Look | Use |
|---|---|---|
| **Primary "Key"** | gold pill with a gentle vertical sheen, dark label, a **circular dark arrow chip** inside on the right | one per viewport: "Voir les voitures disponibles", "Envoyer ma demande", "Réserver" |
| **Secondary** | transparent, 1 px ivory border at 18%, ivory label | "Écrire sur WhatsApp", "Voir la flotte" |
| **Tertiary (text link)** | label with an underline that wipes in, an arrow that nudges 4 px | "Toutes les questions", "Voir tous les services" |
| **WhatsApp** | secondary style with the WhatsApp glyph in a small muted-green circle (never a neon green fill) | everywhere WhatsApp appears |
| **Icon button** | 44 px round, hairline border, fills on hover | close, play, next, previous |
| **Pills / chips** | 999 radius, small, hairline | filters, categories, specs |

### Primary specification
- Height **56 px** desktop, **52 px** mobile. Minimum width 168 px. Label 16 px, weight 600, sentence case.
- Padding start 28 px, end 9 px (the chip sits inside, 38 px).
- Fill: vertical gradient `#D8BF88` to `#C2A56B` to `#B39559`; 1 px top inner highlight; soft gold glow beneath.
- **Hover** (fine pointer only): a diagonal **sheen** crosses once (700 ms), the arrow in the chip **swaps** (the current arrow exits right, a new one enters from the left, 320 ms), the glow strengthens. The button is **magnetic** within 80 px (strength about 0.25).
- **Pressed**: `scale(.97)` in 100 ms.
- **Focus-visible**: 2 px ivory outline, 4 px offset. Always visible, never removed.
- **Loading**: the chip becomes a thin spinning ring, label changes to "Envoi en cours…", **width stays fixed** (no jump).
- **Disabled**: 40% opacity, no sheen, no magnet, `aria-disabled`.
- **Touch**: no hover effects, minimum 44 px target, pressed feedback is the only animation.

```css
.btn-key{
  --h: 56px; --chip: 38px;
  position: relative; display: inline-flex; align-items: center; gap: 14px;
  height: var(--h); padding-inline: 28px 9px; border-radius: var(--r-pill);
  background: linear-gradient(180deg, #D8BF88 0%, var(--gold) 55%, #B39559 100%);
  color: #0A0C10; font: 600 1rem/1 var(--font-body);
  box-shadow: 0 1px 0 rgba(255,255,255,.35) inset, var(--glow-gold);
  overflow: hidden; isolation: isolate;
  transition: transform var(--dur-press) var(--ease-out-strong),
              box-shadow var(--dur-hover) var(--ease-out-strong);
}
.btn-key::before{ /* sheen */
  content: ""; position: absolute; inset: 0; z-index: -1;
  transform: translateX(-120%) skewX(-20deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transition: transform 700ms var(--ease-out-strong);
}
.btn-key:hover::before{ transform: translateX(120%) skewX(-20deg); }
.btn-key:active{ transform: scale(.97); }
.btn-key:focus-visible{ outline: 2px solid var(--ivory); outline-offset: 4px; }
.btn-key .chip{ width: var(--chip); height: var(--chip); border-radius: 50%;
  background: #0A0C10; display: grid; place-items: center; overflow: hidden; }
@media (hover: none), (prefers-reduced-motion: reduce){ .btn-key::before{ display: none; } }
```

### Mobile action bar (sticky, bottom)
Three equal-weight actions: **Appeler**, **WhatsApp**, **Réserver** (gold, wider). 64 px tall plus safe-area inset, glass, hides on scroll down, returns on scroll up. On a vehicle page the primary shows the price: "30 000 DA / j · Réserver".

---

## 7. Forms and inputs

- **Fields**: 56 px high, radius 14, `--night-800` fill, 1 px `--line` border, **floating label** (13 px when focused or filled), caret gold.
- **Focus**: border gold and a 4 px halo `rgba(194,165,107,.14)`, transition 220 ms.
- **Error**: border `--err`, icon, message under the field in plain language (see `03` microcopy). Success: a subtle check.
- **Phone**: Algerian formatting `0555 12 34 56`, numeric keypad on mobile, accepts `+213` and `0`, validates `^(?:0|\+?213)\s?[567]\d{8}$`.
- **Date and time**: a **custom range calendar** (two months on desktop, a full-screen sheet on mobile), not the native `mm/dd/yyyy` input. Time in 30-minute steps. Quick chips: "Ce week-end", "1 semaine", "1 mois". The range shows the **number of days** live. Past days disabled.
- **Booking bar** (hero): five fields in one glass row: Prise en charge (default: Aéroport d'Alger Houari Boumediene), Retour ("Même lieu" toggle), Départ, Retour, Submit. On mobile it becomes a stacked card or a bottom sheet.
- **Stepper** (reservation): three labelled steps with a progress segment under each that **fills** as you advance; completed steps get a gold check that draws.
- **Checkbox**: custom, 22 px, gold check that draws.
- **Select**: custom listbox with keyboard support, never the OS default.

---

## 8. Components

| Component | Specification |
|---|---|
| **Header** | 76 px. Wordmark plus monogram, links with a sliding gold indicator between active items, phone, primary "Réserver". Transparent on the hero, turns into glass with a hairline after 40 px, hides on scroll down, returns on scroll up. Mobile: full-screen overlay menu, large display type, links revealed line by line, runway line at the bottom. |
| **Fleet card ("ticket")** | `--night-850`, radius 20, hairline border. Car **cutout** over a soft light plate. Name (display serif), three chips, price in tabular numerals ("30 000 DA / jour"), availability dot (emerald) and the two actions. **Spotlight border** follows the cursor. On hover the car slides forward 14 px, the plate brightens, the arrow swaps. |
| **Category stage** | Selector row of 6 pills with a sliding gold indicator, below a large stage with the category name in display type, "À partir de", three facts with icons (âge minimum, permis, caution), and the car cutout that swaps sideways. |
| **Service row** | Large serif title, one line of text, hairline, arrow. On hover a preview image follows the cursor and the hairline draws in gold. |
| **Review / proof card** | Real screenshot or quote with name initials, source (Google, WhatsApp) and date. No stock faces. |
| **Accordion (FAQ)** | Rounded 16 cards on `--night-850`, number, question, plus and minus morph. Open: gold header with dark text, body in ivory-dim, smooth height (GSAP or `grid-template-rows` 0fr to 1fr), one open at a time, `aria-expanded`, keyboard operable. |
| **Trust item** | Line icon, one line of text, hairline separators, icon draws on reveal. |
| **Odometer numerals** | Digit columns that roll to the value, tabular figures, `aria-label` with the final value. Used for prices and any real counters. |
| **Chip / badge** | 999 radius, 32 px high, hairline border. Status chips use emerald or red text with a 12% tinted fill. |
| **Toast** | Bottom centre, glass, slides up 12 px, 4 s. |
| **Skeleton** | Matches the final layout exactly, a slow gold-tinted shimmer (opacity only). |
| **Footer** | `--night-950`, tread pattern, top spotlight, four columns (brand and TikTok, Liens rapides, Services, Contact), hairline, socials in outlined circles (TikTok first), legal links, a giant **outline wordmark** "DZ RENT CAR" cropped at the bottom that lights up near the cursor. |

---

## 9. Imagery and asset plan

**The photos make or break "alive".** Mismatched stock is the fastest way back to "AI slop". Ask the client for real shoots early (`CLIENT-QUESTIONS.md`), and until then use consistent placeholders clearly marked `PLACEHOLDER` in development.

### Shot list (give this to the client, or to a photographer)
- **Each car** (17 vehicles): front three-quarter (low angle), side, rear three-quarter, dashboard wide, rear seats, boot, plus one **clean cutout shot** (front three-quarter, neutral background, 4000 px wide, soft light).
- **Arrival scenes**: the car waiting at the arrivals curb at night with headlights on, hands passing keys (no faces needed), luggage into the boot.
- **Algiers**: the bay and the Corniche at blue hour, the white city skyline at dusk, a road at golden hour.
- **Video**: an 8 to 12 s horizontal loop (car arriving, headlights on) and 6 to 10 s vertical clips per car (the company's TikTok style) for the video section.

### Grading recipe (one look for everything)
Low-key and cinematic: deep blacks, shadows nudged toward navy, warm highlights (matches the gold), moderate contrast, a touch of desaturation, gentle vignette, consistent white balance. Apply the same grade to every image. A CSS safety net on photos: `filter: contrast(1.05) saturate(.92)` and a bottom scrim `linear-gradient(180deg, transparent 40%, rgba(6,8,12,.75))` under text.

### Cutouts for the sideways car animations
Remove backgrounds (a background-removal tool or model), export **WebP or AVIF with alpha**, trim to the car, and make the **shadow a separate layer** (an elliptical radial gradient under the wheels) so it can scale and fade independently while the car moves. Keep the same camera angle across cars so swaps feel coherent.

### Technical
- **Formats**: AVIF first, WebP fallback. Widths 480, 768, 1080, 1440, 1920, 2560 with accurate `sizes`. LCP image preloaded with `fetchpriority="high"`. No 3840 px requests for small images.
- **Video**: H.264 at most about 3 MB for the hero loop (plus WebM optional), muted, no audio track, `preload="metadata"`, poster WebP at most about 120 KB. On slow or data-saver connections show the poster only.
- **Names**: `cars/{slug}/{angle}.avif`, `cutouts/{slug}.webp`, `scenes/{name}.avif`.
- **Line-art SVGs** per body type (compact, SUV, sedan, utility): clean single-stroke outlines for the vehicle page draw-on animation.
- **Icons**: one family (Phosphor Light or Lucide at 1.5 px), plus a few custom runway icons. No emoji as icons.
- **Logo**: wordmark plus a simple DZ monogram built from two lane strokes. Favicon and OG image from it.

---

## 10. Inspiration sources (study techniques, never copy)

Capture frames into `MOODBOARD.md` with the technique and what you will steal or skip.

| Source | Technique to study |
|---|---|
| Apple product pages (AirPods Pro, iPhone) | scroll-scrubbed storytelling, restraint, type scale |
| Porsche, Bugatti, Lucid, Rivian | cinematic photography, smooth transitions, narrative scroll |
| Locomotive, Obys | type-led choreography, smooth scroll, large editorial type |
| Linear, Vercel, Stripe | spotlight cards, subtle light, motion discipline (technique only) |
| Airbnb, Booking, Skyscanner | search bars, range date pickers, filters, mobile sheets |
| Sixt, Turo, Blacklane, Hertz | rental flows, price display, trust signals |
| Awwwards (Automotive and Travel), Godly, Land-book, SiteInspire, Dribbble, Behance | mood and layout ideas |
| Codrops | tutorials for cursor effects, text reveals, scroll animations |
| GSAP showcase and forum demos | ScrollTrigger and SplitText craft |
| Emil Kowalski, Josh Comeau, Rauno Freiberg, Jhey Tompkins | interaction craft and creative CSS |
| Airport signage and split-flap boards | arrivals visual language |
| Car dashboard start-up animations | the gauge sweep for the preloader |
| **Pinterest** searches | "dark luxury car rental website UI", "airport arrivals board UI", "boarding pass UI design", "split flap display web", "car dashboard gauge UI", "dark editorial layout automotive", "runway lights photography", "Algiers night photography" |

---

## 11. Anti-slop rules (check before every "done")

**Visual**: no purple or blue-purple gradients, no glowing blobs, no gradient text, glass only where specified, no identical rounded cards repeated down the page, no emoji icons, no fake statistics, no mismatched stock.
**Typography**: none of the avoid-list fonts, no all-caps tracked label above every heading, no monospace for small labels (only the arrivals board element), no single typeface for everything.
**Layout**: not every section is "centred heading, sub line, three cards". Break the centre line. Vary padding and tempo.
**Motion**: not every element fades up the same way. No bounce on UI. No parallax on everything. Nothing animates that does not need to.
**Copy**: no "Elevate", "Seamless", triple adjectives, rhetorical contrasts, em-dash chains, banned words (`03`).
**Checks**: run `npx impeccable detect`, the squint test (blur the screenshot, is the hierarchy still clear?), the swap test (if you replace the logo and nobody notices, it is generic), the grayscale test (does it still work without colour?).

---

## 12. Token file (starting point)

```css
:root{
  /* colour */
  --night-950:#06080C; --night-900:#0B0E14; --night-850:#10141C; --night-800:#161B25;
  --night-700:#1E2430; --night-600:#2A3140;
  --ivory:#F4EFE6; --ivory-dim:#B5B0A5; --ivory-mute:#8B8A86;
  --gold:#C2A56B; --gold-hi:#E6CD96; --gold-lo:#8E7544; --headlight:#FFF1D0;
  --ok:#2FA37A; --err:#E5675A; --warn:#E3B04B;
  --line:rgba(255,255,255,.08); --line-gold:rgba(194,165,107,.28);

  /* radii */
  --r-xs:6px; --r-sm:10px; --r-input:14px; --r-md:16px; --r-card:20px;
  --r-lg:28px; --r-xl:32px; --r-pill:999px;

  /* layout */
  --gutter:clamp(20px,4vw,64px); --container:1320px;
  --section-y-lg:clamp(120px,16vw,240px);
  --section-y-md:clamp(88px,12vw,176px);
  --section-y-sm:clamp(56px,8vw,112px);

  /* motion (see 05) */
  --ease-out-expo:cubic-bezier(.16,1,.3,1);
  --ease-out-strong:cubic-bezier(.23,1,.32,1);
  --ease-in-out-strong:cubic-bezier(.77,0,.175,1);
  --ease-drawer:cubic-bezier(.32,.72,0,1);
  --dur-press:100ms; --dur-hover:220ms; --dur-ui:300ms;
  --dur-panel:480ms; --dur-reveal:900ms; --dur-hero:1400ms;
}
```
