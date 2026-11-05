# Antigravity Brief: Dark Luxury Car-Rental Website

> **Read this whole file before you write a single line of code.**
> It is long on purpose. Everything the client said is in here, organised so you can work through it element by element.
> Screenshots are in `/references/` (`ref-01` to `ref-08`). Every URL listed below is a source of ideas to study in a real browser.

---

## 0. How you must work (non-negotiable)

1. **Take all the time you need.** Quality matters far more than speed. Do not rush to a "finished" site. Build one element, look at it, test it, compare it against the reference, fix it, and only then move on.
2. **Work in small loops** (section 18 has the exact loop). After every section: screenshot at 1440 / 1024 / 768 / 390 / 320 px, compare with the reference screenshot and with the sections you already built, then critique your own work like a senior art director.
3. **Look at the real references.** Open each URL in section 3 in a browser, scroll slowly, hover everything, click everything, and watch how things move. Use DevTools (Elements, Network, Performance) to learn timings, easings and which library drives each animation. Do not guess from a still image.
4. **If a reference site blocks your browser or fetch tool** (some demo sites refuse automated access), do not fight it. Use the screenshots in `/references/`, research the technique from other sources, and add the question to `docs/CLIENT-QUESTIONS.md` (for example: "please record a 10 s screen capture of the hero animation on Rentgo").
5. **Take ideas, never copy.** Do not copy code, text, images, icons or fonts files from the reference sites (theme demo assets are licensed to the theme buyers). Do not hotlink their images. Re-create the *idea* in your own way and make it better. Never submit forms on live third-party sites.
6. **Make it look human-designed.** Section 19 lists the "AI slop" tells to avoid. The client has said this explicitly: *not AI slop*. Treat that as the top quality bar.
7. **Be creative.** The references are a floor, not a ceiling. Where something can be made more refined, more surprising or smoother, do it, as long as it stays luxury, simple and spacious.
8. **Keep the project's memory in files**: `docs/DESIGN.md` (tokens and decisions), `docs/MOODBOARD.md`, `docs/PROGRESS.md` (what is done, what is next), `docs/ASSETS-TODO.md` (every placeholder image or text), `docs/CLIENT-QUESTIONS.md` (open questions). Update them as you go.

---

## 1. The project in one paragraph

A **car-rental company website** with a **dark, luxury, simple, spacious** look that feels **rich** and **smooth**. Visitors browse the fleet, open a vehicle, and send a **reservation request** through a clean 3-step flow (no online payment; the agency calls back and accepts or refuses in writing). The site must feel like a hand-crafted, creative UI design with refined interactions and animations: elements that **pop out** as you scroll, **cars that slide in from the sides**, a **cursor ring that follows the mouse** on desktop, and a mobile experience that is just as carefully designed, including very small screens.

**Working brand name:** `Aurum Drive` (placeholder; keep it in one config file so it is a one-line swap). Logo: create a simple wordmark placeholder; the client will supply the real one.

**Market and language assumption** (confirm in `CLIENT-QUESTIONS.md`): Algeria. Default UI language **French**, currency **DA** formatted like `18 000,00 DA`, dates like `06/10/2026 09:00`, phone and WhatsApp CTAs prominent. Build everything **i18n-ready** (French default, English and Arabic addable, RTL-safe using CSS logical properties) so language is never hard-coded.

---

## 2. Creative direction: "Night Drive"

The whole site feels like a **night drive**: near-black warm surfaces, **champagne gold used like instrument-cluster light and headlights**, thin lines like **lane markings**, and light that sweeps across surfaces like a passing car.

Design vocabulary comes from the subject itself, not from a generic template: tachometer arcs, lane dashes, tyre-tread chevrons, steering-wheel circles, number plates, stitched leather, brushed metal, headlight flares, motion streaks.

**Spend the boldness in one place.** The memorable thing is the **motion of the cars** (they drive in from the side, settle, and their headlights come on). Everything around it stays quiet, disciplined and spacious. Cut any decoration that does not earn its place. Before finishing a section, take one accessory off.

Mood in three words: **nocturnal, tactile, unhurried**.

---

## 3. References: exactly what to take from each

Screenshot filenames are in `/references/`. If you only received the images in the chat, they are in this order: 1 video section, 2 footer, 3 FAQ, 4 cursor ring, 5 hero, 6 booking flow, 7 vehicle page, 8 "why choose us".

| Ref | Source | What to take | How to improve it for this project |
|---|---|---|---|
| `ref-01` | LimoDrive, https://limodrive-new.wpthemeverse.com/royal-ride-vehicles/ | **Video section**: large inset rounded frame, dark overlay over a car-in-motion shot, small gold outlined pill label ("Luxury in motion"), serif headline with a gold underlined phrase, gold circular play button with a translucent halo ring, a thin hairline, then a row of white monochrome brand logos. Gold circular "scroll to top" button bottom-right. | Place it on the **home page** (section 10, item 7). Add a scroll-driven "frame expands" transition, a pulsing halo, a lightbox player, and make the brand row a slow marquee on mobile. |
| `ref-03` | LimoDrive, same URL | **FAQ section**: left column with outlined pill label, serif heading with a gold underlined phrase and a gold "View all FAQs" button; right column accordion of rounded cards with numbered questions and a plus/minus icon; the open item has a solid gold header. Under it, a hairline and three line-icon features (Elite Fleet, Flexible Booking, VIP Experience). | Convert from cream to dark surfaces. **Write real answers** (in the screenshot the answer under Q5 does not answer Q5, so do not copy that content). Smooth height animation, one open at a time, full keyboard support. |
| `ref-04` | LimoDrive, same URL | **Mouse-follower shape**: a small gold ring (about 24 px, about 4 px stroke) that trails the pointer on desktop. | Full spec in section 8: eases behind the pointer, grows and shows labels on cars, video and carousels, desktop (fine pointer) only. |
| `ref-05` | Rentgo, https://demo.awaikenthemes.com/rentgo/home-version-2/ | **First section**: full-bleed cinematic car photo in an inset rounded frame, transparent navigation (logo, links with dropdown carets, pill CTA), small pill tag, very large headline, short paragraph, two buttons that each have a circular arrow chip, and a **glass form card** on the right. | Dark luxury restyle. Make the card the **real booking entry** (pickup date/time, return date/time, location) that leads to the fleet with the dates in the URL, instead of a "send message" form. Do not copy the theme-seller chrome ("Buy Now", discount banner). |
| `ref-02` | Rentgo, same URL | **Footer**: near-black with a subtle tyre-tread chevron texture and a soft top spotlight, rounded top corners; four columns (brand + short text + newsletter pill input with a circular arrow button, Quick Links with accent bullets, Services, Contact with icon circles); hairline; copyright, outlined circular social icons, legal links. | Gold instead of the template's amber. Keep the structure, refine the spacing, add a large cropped outline wordmark at the bottom as an optional flourish. Fix the template typo ("Phone Numer"). |
| **All animations** | Rentgo, same URL | The **"pop out" reveal animations**: every element eases into view as you scroll (soft rise, slight scale-up, fade, staggered), text, images, cards, counters. The client loves how clean and smooth they are. | Study the exact timing and easing in DevTools, then build your own reveal system (section 7) and apply it consistently to **all** elements. Add variety (sideways, masks, scale) so it never feels like one repeated effect. |
| `ref-06` | LOVEHA, https://loveha.dz/reserver/modele/25?pickup_at=2026-10-06T09%3A00&return_at=2026-10-09T09%3A00 | **The reservation workflow, exactly.** Click a car, land on "Votre demande de réservation" with a summary card, conditions banner, 3-step stepper and short forms. Full detail in section 13. | Same workflow and same fields, much better visual and motion design, plus live eligibility checks and a clear confirmation screen. |
| `ref-07` | LuxeDrive, https://luxedrive.qodeinteractive.com/vehicle/bmw-m-3-coupe/ | **Vehicle page**: big gallery with thumbnails, a faint line-art drawing of the car, title, star rating, spec chips, extras, a prices block with large numerals. | Section 12. Make the line art draw itself, make the gallery a real lightbox, add a sticky booking card. In the screenshot the photos do not match the car title and "Leather" is misspelt; do not reproduce those flaws. |
| `ref-08` | No URL given; same visual language as LimoDrive (check that theme's home page first) | **"Why choose us"**: tall rounded image overlapped by a smaller image, a gold stat badge ("10K Happy Customer" with an avatar stack), and four outlined feature cards with gold circular icons. | Section 10, item 6. Dark cards, animated counter, overlapping images with parallax. |

**Palette note from the screenshots:** the gold used across the LimoDrive-style references is exactly `#C2A56B`. Rentgo's amber (`#F5B754`) is **not** used here.

---

## 4. Research you must do yourself

Do real research before designing. Write the results in `docs/MOODBOARD.md` (at least 15 entries, each with "what I take" and "what I deliberately do not take").

- **Pinterest**: search "dark luxury car rental website", "car rental website UI dark", "chauffeur service website gold black", "automotive website design", "premium vehicle booking UI", "car rental mobile app dark UI", "car detail page UI".
- **Design galleries**: Awwwards (Automotive category and Site of the Day), Godly, Dribbble, Behance, Land-book, SiteInspire, Mobbin (for mobile booking flows).
- **Real brands with excellent web design** (study layout, imagery, motion, restraint): Rolls-Royce Motor Cars, Bentley, Aston Martin, Porsche, Lamborghini, Polestar, Lucid, Sixt, Turo, Blacklane.
- **More rental websites**, luxury and mainstream: look at how they handle date pickers, availability, pricing display, filters and empty states.
- Look specifically for: scroll-driven car animations, cars entering from the side, SVG line-art vehicles, number-plate details, dark photographic grading, and elegant mobile menus.

Then choose, combine and improve. The result should look like a **studio's original design**, not a mash-up.

---

## 5. Design system (tokens)

Put all of this in CSS custom properties and document it in `docs/DESIGN.md`. Test every text/background pair for **WCAG AA contrast (4.5:1 body, 3:1 large text)**.

### 5.1 Colour (dark theme)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0A09` | page background (warm black) |
| `--surface-1` | `#121110` | framed sections, footer |
| `--surface-2` | `#181715` | cards |
| `--surface-3` | `#201E1B` | raised cards, inputs, hover |
| `--line` | `rgba(194,165,107,.18)` | gold hairlines, card borders |
| `--line-soft` | `rgba(255,255,255,.07)` | neutral dividers |
| `--gold` | `#C2A56B` | accent (sampled from the references) |
| `--gold-bright` | `#DCC48E` | hover, highlights, glow |
| `--gold-deep` | `#8E7544` | pressed state, subtle fills |
| `--ivory` | `#F3EEE4` | primary text |
| `--ivory-dim` | `#B9B2A3` | secondary text |
| `--ivory-mute` | `#8A8478` | tertiary text (verify contrast) |
| `--ok` / `--err` | muted green `#6FAE8B` / muted red `#D0705F` | status, never neon |

Gold is the **only** accent. No gradients as decoration (no purple, blue or neon). The only allowed gradients are: a soft gold spotlight (radial, low opacity), image vignettes for text legibility, and a gold sheen that sweeps across buttons on hover.

### 5.2 Typography

Two families, clearly distinct.

- **Display: a refined high-contrast serif.** The references use a Cormorant-style serif. Start from **Cormorant Garamond** (weights 500 to 600 for large sizes only, because hairlines vanish on dark at small sizes), but **build a quick type specimen with 3 pairings on the real hero** (for example Cormorant Garamond + Hanken Grotesk, Instrument Serif + Instrument Sans, Newsreader + Manrope) and pick the best-looking. Document the choice.
- **Body/UI: a clean neutral grotesk** at 16 to 17 px, line-height 1.6, max line length about 65 characters.
- Prices, stats and dates use **lining tabular figures**.
- Fluid scale with `clamp()`: H1 about 44 to 104 px (line-height 1.02, tracking −0.02em), H2 about 32 to 64 px, H3 about 22 to 32 px.
- **Headline accent phrase** (the gold underlined phrase in the references): keep it, it is part of the look, but use it on the **5 or so most important headlines only**, vary the treatment (underline, italic serif, gold colour), and draw the underline in with a slightly imperfect hand-drawn SVG stroke so it feels crafted.
- **Small pill labels** (outlined gold, letter-spaced caps, with a dot): use them as the references do, but at most **one per section**, and only when they carry meaning.
- **Numbered markers** only where the content is really a sequence (How it works, FAQ).

### 5.3 Layout and space (the "spacious" part)

- 12-column grid, content max-width about 1360 px, outer gutter `clamp(20px, 4vw, 64px)`.
- Generous vertical rhythm: section padding `clamp(88px, 12vw, 180px)`. When unsure, **add space, not elements**.
- Use **inset rounded frames** (as in `ref-01` and `ref-05`): hero and video sit inside a rounded container with a margin around it.
- **Asymmetry on purpose**: offset images, overlapping layers, text columns that do not all align to the same edges. No endless rows of identical cards.
- Radii express hierarchy: `--r-xs 6px` (chips), `--r-sm 10px` (inputs), `--r-md 16px` (cards), `--r-lg 28px` (frames), `--r-pill 999px` (buttons). Not one radius for everything.
- Depth on dark: 1px top inner highlight (`rgba(255,255,255,.06)`), hairline borders, large soft black ambient shadows under floating cards, a faint gold glow only on the single focused element. No generic grey drop shadows.

### 5.4 Texture and imagery

- Static film grain overlay at 3% (a tiny tiled noise, not animated, so it costs nothing).
- Subtle **tyre-tread chevron pattern** at 3 to 4% on the footer and the final CTA band (from `ref-02`).
- Soft radial gold spotlight at the top of the footer (also `ref-02`).
- Photography: dark, cinematic, consistent grading (low-key, warm highlights, deep blacks). Images get a vignette so text sits on them cleanly. Full-bleed cars should feel photographed at dusk or night.

### 5.5 Components to design (all states: default, hover, focus-visible, active, disabled, loading, error)

- **Primary button**: gold pill with dark text and a circular arrow chip (as in `ref-05`); hover: gold sheen sweeps across, the chip rotates 45° and slides. **Secondary**: gold outline. **Text link**: underline that wipes in.
- **Pill label**, **chip**, **badge**.
- **Inputs**: dark, hairline border, floating labels, gold focus ring, plain-language inline errors. Custom date-time range picker (not the browser's native `mm/dd/yyyy` look on desktop; bottom-sheet calendar on mobile).
- **Cards**: fleet card, category card, feature card, review card, service row.
- **Accordion**, **stepper** (with progress bars), **tabs**, **gallery + lightbox**, **modal/dialog** (focus trap), **toast**, **skeleton loaders**, **empty states**.
- **Icons**: one consistent set, 1.5 px line weight, drawn on the same grid. No emoji as icons.

---

## 6. Line and shape language ("multiple shapes and lines")

The client wants several decorative shapes and lines, including on mobile. Create **one coherent family** drawn from automotive vocabulary, all in thin gold strokes (1 px, 10 to 25% opacity unless it is the focus):

| Shape | Description | Where |
|---|---|---|
| **Hairlines** | 1 px gold rules | dividers between sections, inside cards |
| **Lane dashes** | dashed horizontal or vertical lines like road markings; dash offset slowly moves | connecting steps, section transitions |
| **Dial arcs** | concentric partial circles with tick marks, like a tachometer | behind stat counters, hero corner, CTA band; rotate slowly with scroll |
| **Tread chevrons** | repeating zig-zag pattern | footer, CTA band |
| **Orbit dot** | a tiny gold dot travelling around an outlined circle | play button halo, loaders |
| **Registration marks** | small `+` crosses at section corners | frame corners, grid intersections |
| **Viewfinder corners** | four small corner brackets | around gallery images on hover |
| **Rotating text badge** | circular text ("RÉPONSE SOUS 24 H · AUCUN PAIEMENT EN LIGNE ·") around a small arrow, slowly rotating | overlapping a hero or video frame corner |
| **Outline giant text** | very large stroke-only word at 5 to 8% opacity | behind at most two sections |

Rules: every shape has a **job** (guide the eye, connect, frame). Maximum **two shapes per viewport**. Never reduce text legibility. No blobs, no soft gradient orbs, no random circles. On mobile keep the same shapes but **smaller, simpler and fewer** so small screens still feel designed rather than empty or crowded.

---

## 7. Motion system

Motion is the heart of this brief. Aim for **really smooth, high-end, human-directed** animation, never random.

### 7.1 Foundations

- **Libraries**: GSAP (ScrollTrigger, SplitText, MotionPath, Flip; check the installed version's docs) + **Lenis** for smooth scrolling (synced to the GSAP ticker). Use CSS for simple hover states.
- **Easing tokens**: `--ease-out-expo: cubic-bezier(.16,1,.3,1)` (reveals), `--ease-out-quart: cubic-bezier(.25,1,.5,1)` (hovers), `--ease-in-out: cubic-bezier(.76,0,.24,1)` (transitions, wipes). Use `back.out(1.4)` sparingly for the "pop".
- **Durations**: micro 150 to 250 ms, standard 500 to 700 ms, reveal 800 to 1100 ms, hero 1200 to 1600 ms.
- **Performance**: animate only `transform`, `opacity` and `clip-path`. No animated blur on large areas, no layout-triggering properties. `will-change` only while animating. Kill ScrollTriggers on route change. Pause offscreen video. Target 60 fps on a mid-range Android phone.
- **Accessibility**: respect `prefers-reduced-motion` (replace movement with simple fades, disable Lenis, cursor, parallax and looping animations).

### 7.2 The "pop out" reveal system (inspired by Rentgo, made better)

Build **one reusable system** driven by data attributes (for example `data-reveal="pop"`) and apply it to **all elements**. Presets:

- `pop`: rise about 40 px + scale 0.95 → 1 + fade, slight overshoot. Used for cards, buttons, images.
- `rise`: rise 24 px + fade. Used for paragraphs and small items.
- `left` / `right`: slide in from the side with a soft ease. Alternate in lists and rows.
- `mask-lines`: headings split into lines, each line slides up from behind a mask.
- `image-wipe`: clip-path inset wipe with the inner image scaling 1.15 → 1.
- `draw`: SVG stroke draw-on (underlines, line art, road paths).
- `count`: numbers count up with tabular figures.
- Stagger groups by 80 to 120 ms. Trigger around 85% of the viewport, once.
- **Rule:** the system is consistent, but **no section should feel like the same fade-up as the one before**. Vary direction and preset by content.

### 7.3 Signature moments: cars that pop out from the side

These are what the client asked for ("crazy smooth car animations, popping out sideways"). Build all of them and tune them until they feel physical:

1. **Hero car entry.** The car slides in from off-canvas right with a long decelerating ease, a brief motion-blur streak trailing behind (a faded duplicate layer or light streak lines), a tiny suspension settle (a 0.6° rock), then the **headlights flick on** (a gold glow fades in). Plays once after the page loads.
2. **Drive-by on scroll.** In the "How it works" section a car silhouette travels along an SVG road path (dashed lane line) as you scroll (ScrollTrigger scrub + MotionPath), wheels rotating, with the step cards lighting up as it passes each stop.
3. **Fleet cards from the sides.** Cards alternate entering from left and right with a slight rotation and overshoot, settling with a soft shadow growing under the wheels.
4. **Final CTA band.** Two cars slide in from opposite sides and stop facing each other, headlights flashing once, with the CTA between them.
5. **Vehicle page.** The line-art drawing of the car draws itself (stroke draw-on), then the photo fades in behind it. The gallery's main image wipes in from the side.
6. **Page transitions.** A gold light sweep (clip-path wipe) crosses the screen like a car passing, under 700 ms, content swaps behind it.
7. **Fleet carousel.** Draggable with inertia; cards skew slightly with scroll velocity and relax when stopped.
8. **Loader (first visit per session only, max 1.2 s).** A wheel/ring draws and spins into the logo. Skip it for returning visitors.

### 7.4 Micro-interactions

- Magnetic buttons (pull toward the cursor by up to 8 to 12 px, desktop only).
- Card image zoom 1.06 over 900 ms, subtle 3D tilt (max 4 to 6°, desktop only) on fleet cards.
- Link underline wipes, icon nudges, input labels float, accordion height eases.
- Header: transparent over the hero, turns into a blurred dark bar with a hairline after scrolling; hides on scroll down, returns on scroll up.
- Services list: hovering a row makes a preview image follow the cursor.
- Scroll progress ring inside the gold scroll-to-top button (`ref-01`, bottom right).

---

## 8. The mouse-follower ring (desktop only)

- Visible only when `(hover: hover) and (pointer: fine)`. Never on touch.
- A **gold ring about 24 px, about 4 px stroke, transparent centre** (`ref-04`). Follows the pointer with a soft lag (GSAP `quickTo`, duration about 0.45 s, `power3`). The native cursor stays visible.
- **States:** over links and buttons the ring scales to about 1.7 and gets a faint gold fill. Over car images and the gallery it grows to about 84 px and shows the label **"Voir"**. Over the video it shows **"Lecture"**. Over draggable carousels it shows **"Glisser"** with small arrows. On press it shrinks to 0.85. Over text inputs it fades out. It fades out when the pointer leaves the window.
- Keep it above everything (`pointer-events: none`, high z-index) and make sure it never causes layout shift or jank.


---

## 9. Site map and routes

| Route | Page |
|---|---|
| `/` | Home |
| `/vehicules` | Fleet (accepts `?pickup_at=YYYY-MM-DDTHH:mm&return_at=...&category=...`) |
| `/vehicules/[slug]` | Vehicle page |
| `/reserver/modele/[id]?pickup_at=...&return_at=...` | 3-step reservation request (same URL pattern as LOVEHA) |
| `/reserver/confirmation/[ref]` | Confirmation and request status |
| `/services` | Services (chauffeur, airport transfer, long term, events, corporate) |
| `/a-propos` | About |
| `/avis` | Reviews (optional dedicated page, reviews also appear on Home) |
| `/faq` | Full FAQ (the Home section links to it) |
| `/contact` | Contact (agency address, map, phone, WhatsApp, form) |
| `/mentions-legales`, `/conditions`, `/confidentialite` | Legal |
| `/404` | Designed 404 (a car driving off the edge of the screen) |
| `/admin` | **Phase 2**: staff dashboard (see section 16) |

If you think an extra page or section would make the site better (for example a "Journal" or a "Destinations" page), research it, propose it in `docs/PROGRESS.md`, and build it only if it fits the luxury-simple-spacious direction.

---

## 10. Home page, section by section

Build and finish **one section at a time** in this order. Each section needs desktop, tablet, mobile, motion, and a side-by-side comparison with its reference.

**0. Header**
- Optional slim top bar with real, useful information ("Réponse sous 24 h · Aucun paiement en ligne"), not a promo banner.
- Logo, links (Accueil, Véhicules with a refined dropdown showing categories, Services, À propos, Contact), phone/WhatsApp, a primary pill "Réserver". Behaviour in section 7.4. Mobile: full-screen overlay menu with large serif links revealed line by line and gold hairlines.

**1. Hero** (`ref-05`)
- Inset rounded frame, full-bleed dark cinematic car image or looping video (muted, poster, lazy), vignette for legibility.
- Left: small pill label, a very large serif headline, one short paragraph, two buttons (primary "Réserver un véhicule", secondary "Voir la flotte").
- Right: **glass booking card** "Réservez votre véhicule" with: pickup agency/location, pickup date and time, return date and time, optional category. Submit "Voir les véhicules disponibles" goes to `/vehicules` with `pickup_at` and `return_at` in the URL.
- Headline candidates (placeholders; write better ones if you can): "Chaque trajet, en première classe." / "Conduisez ce que vous méritez." / "La route, autrement."
- The hero car **slides in from the side** (section 7.3, moment 1). A rotating text badge overlaps the frame corner.

**2. Categories**: "Choisissez votre catégorie"
- A horizontal rail (draggable with inertia) of 5 to 6 categories (Économique, Compacte, Berline, SUV, Premium, Utilitaire/Minibus; adjust to the client's fleet). Each card: car image entering from the side, "à partir de X DA / jour", and the category conditions (minimum age, licence seniority) as small, calm details, because the booking flow depends on them.

**3. Featured fleet**
- 6 to 8 vehicles in a **non-uniform grid** (varied card sizes), with filter tabs by category. Card: large image, name, 3 to 4 spec chips (seats, gearbox, fuel, doors), price per day, "Réserver" link. Hover reveals more specs. Cards pop in alternately from left and right.

**4. Why choose us** (`ref-08`)
- Left: tall rounded image overlapped by a smaller image with parallax offset, plus a gold badge with an animated counter and avatar stack ("Clients satisfaits"; **use the real number**).
- Right: pill label, headline with a gold accent phrase, four outlined cards with gold circular icons: **Tarifs transparents**, **Flotte entretenue**, **Véhicules premium**, **Locations flexibles** (or equivalents that match the client's real strengths).

**5. Video section** (`ref-01`)
- Inset rounded frame over a dark car-in-motion video poster. Pill label ("Le luxe en mouvement"), serif headline with gold accent ("Chaque trajet en première classe"), gold circular play button with a pulsing halo ring and the cursor label "Lecture". Hairline, then the row of brand logos in white monochrome (**only brands the company really offers**; slow marquee on mobile).
- Scroll behaviour: the frame **expands** from inset to almost full-bleed as it reaches the centre of the viewport (scrubbed radius and inset), the poster has gentle parallax.
- Click opens a **lightbox player** (focus trap, ESC to close, keyboard accessible, `youtube-nocookie` embed or self-hosted MP4/WebM, pauses when closed).
- Scroll-to-top button: gold circle with arrow and a progress ring, fixed bottom-right.

**6. How it works** (a real sequence, so numbers are allowed)
1. Choisissez un véhicule et vos dates.
2. Envoyez votre demande (3 minutes, sans paiement).
3. L'agence vous appelle et confirme par écrit sous 24 h.
4. Retirez le véhicule et prenez la route (pièce d'identité + permis; caution restituée au retour).
- A dashed **lane line** connects the steps; a **car drives along it on scroll** (section 7.3, moment 2).

**7. Services**
- Editorial list of 5 large serif rows (Location avec chauffeur, Transferts aéroport, Longue durée, Mariages et événements, Entreprises). Hovering a row: a preview image follows the cursor, the row line draws in gold, a small arrow appears. On mobile each row expands on tap.

**8. Reviews**
- One large featured quote with big quotation marks and a star row, plus a vertical list of other reviewers to switch between (mobile: swipeable cards). Optional overall rating summary. **Placeholders must be clearly flagged and replaced by real reviews.**

**9. Numbers**
- A quiet strip of 3 to 4 counters (fleet size, customers, years, agencies) with dial arcs behind. **Real numbers only.**

**10. FAQ** (`ref-03`)
- Left (sticky on desktop): pill label, headline "Tout ce qu'il faut savoir avant de rouler" with a gold accent phrase, gold "Toutes les questions" button.
- Right: accordion (one open at a time, smooth height, `+` turns into `−`, open item header is solid gold with dark text, body in ivory-dim).
- Starter questions, with **real answers** (the client will confirm): documents required; booking for events and weddings; hourly, daily, weekly and monthly rentals; what happens if the car breaks down; modifying or extending a booking; caution (deposit) and when it is returned; minimum age and licence seniority.
- Under it, a hairline and three line-icon features: **Flotte d'exception**, **Réservation flexible**, **Expérience VIP**.

**11. Final CTA band**
- Tyre-tread texture, gold spotlight, headline "Prêt à prendre la route ?", primary CTA, WhatsApp link. Two cars slide in from opposite sides and stop facing each other (section 7.3, moment 4).

**12. Footer** (`ref-02`)
- Four columns: brand + short text + newsletter (pill input with a circular arrow button); Liens rapides; Services; Contact (icon circles for phone, WhatsApp, e-mail, address, opening hours). Hairline. Bottom row: copyright, outlined circular social icons, legal links. Tyre-tread chevron texture, top spotlight, rounded top corners, optional giant cropped outline wordmark.

**Global**: cursor ring (desktop), scroll progress, scroll-to-top, and on mobile a **sticky bottom action bar** (Réserver · Appeler · WhatsApp) that hides on scroll down.

---

## 11. Fleet page (`/vehicules`)

- Top: compact **sticky date bar** (pickup, return, location) that always reflects the URL parameters; changing it updates results without a full reload.
- Filters: category, brand, seats, gearbox, fuel, price range, "available for my dates". Desktop: left sidebar. Mobile: **bottom-sheet filters** with an applied-filters chip row.
- Sort: price, popularity, category.
- Cards show: image, name, category, 3 to 4 chips, **price per day and estimated total for the chosen period** (as LOVEHA does), availability state ("Disponible" / "Indisponible pour ces dates" with an "Autres dates" suggestion), and "Réserver" which goes to `/reserver/modele/[id]` with the dates preserved.
- Skeleton loaders, a designed empty state ("Aucun véhicule pour ces dates. Essayez ces alternatives"), and an animated results count.

---

## 12. Vehicle page (`/vehicules/[slug]`, based on `ref-07`)

Keep the strong structure of the reference, fix its flaws, and add craft.

- **Left**: large gallery, main image plus thumbnail row (3 to 5). Click opens a **fullscreen lightbox** with swipe, keyboard arrows and pinch zoom. Viewfinder corner marks appear on hover. The cursor shows "Voir".
- **Right** (sticky on desktop):
  - A **faint line-art drawing of the car** (SVG, ideally of the real body type) that **draws itself** on entry.
  - Name (serif), star rating (only if real reviews exist), spec chips from real data (places, boîte, carburant, portes, climatisation, Wi-Fi, etc.).
  - "Équipements" short paragraph with a "see all" expander.
  - **Prices block** with large tabular numerals: per day, per week, per month (degressive), and per hour only if the company offers it. Show **caution (deposit)** and the **conditions of the category** (minimum age, licence seniority).
  - Mini availability calendar, then a primary CTA **"Réserver ce véhicule"** (carries the dates) and a WhatsApp link.
- Below: spec grid (power, 0 to 100 km/h, consumption, boot volume, doors), features with icons, "About this model" paragraph, **similar vehicles** carousel, FAQ snippet.
- Entry animation: image wipes in from the side, line art draws, chips pop in staggered.
- Mobile: gallery is a swipeable carousel with dots; the booking card collapses into a sticky bottom bar with price and CTA.

---

## 13. The reservation flow (follow LOVEHA's workflow exactly)

Source: `ref-06` and https://loveha.dz/reserver/modele/25?pickup_at=2026-10-06T09%3A00&return_at=2026-10-09T09%3A00.
Open it in a browser and walk through all three steps (**without submitting a real request**). The text content of that page was read for this brief, so the fields below are accurate.

**Entry.** Clicking "Réserver" on any car opens `/reserver/modele/[id]` with `pickup_at` and `return_at` in the URL. The link "← Changer de véhicule ou de dates" goes back to the fleet with the same dates.

**Header block**: title "Votre demande de réservation".

**Summary card** (warm tint on LOVEHA; on our dark theme a gold-tinted surface):
- Vehicle image and **Modèle** (name), **Catégorie** (for example Économique), **Période** (`06/10/2026 09:00 → 09/10/2026 09:00` and `3 jours`), **Total estimé** (`18 000,00 DA`) with `+ caution` amount underneath.
- Rental days logic from the reference: exactly 72 h = 3 days = 3 × 6 000 DA. Use 24-hour blocks (`ceil(hours / 24)`) and confirm any edge cases in `CLIENT-QUESTIONS.md`.

**Conditions banner** (per category): "Conditions pour cette catégorie : âge minimum 25 ans · ancienneté du permis 2 ans".

**Stepper**: three steps with a labelled circle and a progress bar segment under each: **1 Vos coordonnées, 2 Votre permis, 3 Départ et envoi**.

**Step 1: Vos coordonnées**
- Nom et prénom *
- Téléphone * (hint: "L'agence vous appelle pour confirmer l'heure du départ.")
- E-mail * (hint: "L'acceptation ou le refus vous y parvient par écrit.")
- Button: **Continuer →**

**Step 2: Votre permis**
- Date de délivrance du permis * (hint: "Ancienneté minimale exigée : 2 ans." using the category value)
- Date de naissance * (hint: "Chaque catégorie a son âge minimum.")
- Numéro du permis (facultatif)
- Buttons: **← Précédent** / **Continuer →**

**Step 3: Départ et envoi**
- "Départ et retour : Agence principale" with the agency address (if several agencies, a selector).
- "Véhicule réservé : [model]. Ce modèle précis vous est réservé."
- Un mot pour l'agence (facultatif), a textarea.
- Checkbox: "Je confirme l'exactitude de ces informations et j'accepte d'être contacté par téléphone et par e-mail au sujet de cette demande."
- A hidden **honeypot** field (anti-spam, invisible to humans).
- Buttons: **← Précédent** / **Envoyer ma demande**
- Reassurance line under the button: "Aucun paiement en ligne. Rien n'est débité maintenant."

**What to improve (without changing the workflow):**
- Dark luxury styling, large comfortable inputs, floating labels, a custom date picker.
- Validation per step with plain-language inline errors that say what to fix.
- **Live eligibility check**: compute age and licence seniority against the category; if the visitor is not eligible, explain clearly and **suggest eligible categories** instead of a dead end.
- Smooth step transitions (content slides sideways, the progress segment fills, the summary total does not jump).
- Keep progress in `sessionStorage` so a refresh does not lose the form; guard against double submit; disable the button and show a loading state.
- On mobile, the summary collapses into a compact sticky bar (vehicle, dates, total).
- **Confirmation page** `/reserver/confirmation/[ref]`: reference number, recap, and a 4-point status timeline (Demande reçue → Étude par l'agence → Réponse écrite par e-mail → Retrait du véhicule), "add to calendar", WhatsApp link. Send a confirmation e-mail to the visitor and a notification to the agency.
- Footer of this flow stays minimal: agency phone, WhatsApp, "Conditions essentielles" (licence years, valid ID, deposit returned at the end of the rental). Also keep the floating WhatsApp/phone shortcuts that LOVEHA has.

Formats: currency `18 000,00 DA` (use `Intl` with `fr-DZ` or equivalent), dates `dd/mm/yyyy hh:mm`, Algiers time zone unless the client says otherwise.

---

## 14. Other pages (design them with the same system)

- **Services**: the editorial service list expanded into five full sections, each with imagery, a short paragraph, key conditions and a CTA.
- **À propos**: the story and values in a calm, editorial layout, a stats strip, a team or agency photo section (placeholder flagged), and a map or address block.
- **Avis**: aggregated rating and a masonry of reviews.
- **FAQ**: full accordion grouped by theme with a search field.
- **Contact**: agency card(s) with address, hours, phone, WhatsApp, a map, and a short form with the same input styling as the booking flow.
- **Legal pages**: readable typography, sticky table of contents on desktop.
- **404**: a car drives off the edge of the page, a clear link back home.

---

## 15. Mobile and very small screens

The client explicitly asked for a carefully adapted mobile view, including **extra-small** devices.

- Design **mobile-first**, then enhance. Test at **320, 360, 390, 430, 768, 1024, 1280, 1440, 1920** px. **No horizontal scroll at 320 px.**
- Use `dvh` (not `vh`), respect safe-area insets, touch targets at least 44 × 44 px, no information that only appears on hover.
- Hero: stacked layout. The headline scales with `clamp()`; the booking card becomes a full-width card below the headline (or a "Réserver" button that opens a bottom sheet with the date picker).
- Menus: full-screen overlay with staggered large serif links. Filters: bottom sheets. Date picker: full-screen calendar sheet.
- Fleet and categories: horizontal **snap-scroll carousels with a visible peek** of the next card. Footer columns become accordions.
- **Sticky bottom action bar** (Réserver · Appeler · WhatsApp) that hides on scroll down and returns on scroll up.
- Keep the **line and shape language** on mobile (section 6), smaller and simpler so small screens still feel designed.
- Motion on mobile: keep the pop-out reveals and the sideways car entries (they are the signature), but remove the cursor ring, magnetic and tilt effects, Lenis smoothing and heavy parallax. Reduce simultaneous animations. Test on a mid-range phone.
- Typography on 320 px: headlines must not break awkwardly; check long French words.

---

## 16. Tech, data, performance, accessibility, SEO

**Stack (justify your final choice in `docs/DESIGN.md`)**: a modern framework that **pre-renders** fleet and vehicle pages for SEO and works well on **Cloudflare Pages** (for example Astro with React islands, or Next.js if it deploys cleanly), TypeScript, CSS variables (Tailwind is fine if the tokens stay in CSS variables), GSAP + Lenis, React Hook Form + Zod for forms.

**Data layer**: start with a typed data layer and seed JSON (vehicles, categories with minimum age, licence seniority and deposit, agencies, FAQ, reviews). Make the layer swappable so **Phase 2** can plug in **Supabase**:
- tables: `categories`, `vehicles`, `vehicle_images`, `agencies`, `reservation_requests`, `reviews`, `faqs`;
- `reservation_requests` holds contact, licence date, birth date, optional licence number, vehicle, dates, agency, note, status (`nouvelle`, `acceptée`, `refusée`), decision reason, timestamps;
- an admin view to list requests, accept or refuse with a reason (which triggers the written e-mail), block dates, and edit the fleet and prices.
- E-mail sending through a transactional provider (Resend or similar) from a server function.
- Row-level security: the public can only insert requests, never read them.

**Performance targets**: LCP under 2.5 s on 4G mid-range, CLS under 0.05, INP under 200 ms. Self-host and subset fonts with `font-display: swap`, preload the display font. Images in AVIF/WebP with `srcset`, explicit dimensions, lazy loading below the fold, hero image prioritised. Load GSAP plugins only where used. Lazy-load video.

**Accessibility (WCAG AA)**: semantic HTML, visible `:focus-visible` rings in gold, keyboard-operable accordion, menu, dialog and gallery, labelled form fields with errors tied to inputs, meaningful alt text, `prefers-reduced-motion` honoured, colour never the only signal.

**SEO**: unique titles and descriptions, Open Graph images, sitemap and robots, canonical URLs, `hreflang` when languages exist, JSON-LD (`AutoRental`/`LocalBusiness`, `FAQPage`, `BreadcrumbList`, and vehicle `Product` data).

---

## 17. Content and assets

- **Real copy, no lorem ipsum.** Short, specific, plain verbs, sentence case. Buttons say exactly what happens ("Envoyer ma demande", not "Submit"). Errors explain how to fix the problem and never apologise vaguely.
- French first; keep all strings in dictionaries.
- Anything the client must supply is marked `TODO:CLIENT` in the UI source and listed in `docs/ASSETS-TODO.md`: logo, brand name, real fleet list and photos, prices, categories and their conditions, deposit amounts, agencies and hours, phone, WhatsApp, e-mail, social links, real reviews, real counters, video.
- **Images**: use properly licensed stock (Unsplash or Pexels) or images you can generate, with a consistent dark cinematic grade. Keep a manifest with source and licence. Never use the reference sites' images. Make sure the photo matches the car named on the card (the reference vehicle page mixed them up).
- Brand logos in the video strip only if the company actually rents those brands.

---

## 18. Workflow, phases and definition of done

**The loop for every section and component**
1. Study the reference (screenshot and live site) and write a 5-line micro-spec in `docs/DESIGN.md`.
2. Build desktop (1440). 3. Build tablet (768). 4. Build mobile (390, then 320).
5. Add motion; check it at 60 fps; check reduced motion.
6. Screenshot all breakpoints; compare **side by side** with the reference and with already-built sections for consistency.
7. Critique like a senior designer: spacing, alignment, hierarchy, contrast, rhythm. Remove one accessory.
8. Fix, re-test, update `docs/PROGRESS.md`, commit. Only then continue.

**Phases**
- **Phase 0, research**: study every reference, do the research in section 4, write `MOODBOARD.md`, run the type specimen, decide the stack and write `DESIGN.md`.
- **Phase 1, foundations**: tokens, base components, reveal system, Lenis, cursor ring, header, footer, page transitions.
- **Phase 2, home page**: sections 1 to 12 in order.
- **Phase 3, fleet and vehicle pages.**
- **Phase 4, reservation flow and confirmation.**
- **Phase 5, remaining pages and 404.**
- **Phase 6, QA**: Lighthouse (performance, accessibility, SEO), keyboard-only pass, screen-reader spot check, Chrome, Safari and Firefox, real-device or emulated phones from 320 px, slow network, reduced motion, and a full read-through of the copy.
- **Phase 7 (when approved), backend**: Supabase, admin dashboard, e-mails.

**Definition of done**
- Every section matches or beats its reference, in dark luxury style, on all breakpoints.
- Pop-out reveals are applied across all elements, with variety and no jank.
- The cars slide in from the sides, as specified, and feel physical.
- The cursor ring behaves as specified on desktop and is absent on touch.
- The reservation flow follows LOVEHA's workflow, with validation and a confirmation page.
- Lighthouse 90+ in all categories on the home page and vehicle page.
- No horizontal scroll at 320 px. No console errors. No layout shift.
- Nobody could tell it came from a template or a prompt.

---

## 19. Anti-"AI slop" checklist (review before calling anything done)

- [ ] No generic purple, blue or neon gradients, glowing blobs or random orbs.
- [ ] No grid of identical rounded cards repeated down the page; hierarchy and variety exist.
- [ ] Not every heading has an eyebrow label, a gold word and a number; each device is used where it carries meaning.
- [ ] Not every section fades up the same way; direction and preset vary by content.
- [ ] One radius is not applied to everything; radii follow hierarchy.
- [ ] No emoji icons; icons share one grid and stroke weight.
- [ ] No lorem ipsum, no vague marketing filler ("elevate your journey"); copy is specific and short.
- [ ] No stock-photo mismatches (right car, right name); consistent photo grade.
- [ ] No theme-seller chrome copied from references ("Buy Now" buttons, discount banners, template typos).
- [ ] Spacing is generous and deliberate; sections breathe.
- [ ] Decorative shapes have a job and belong to one family.
- [ ] Interactions feel physical: easing, weight, overshoot, settle.
- [ ] The page still looks good with animations turned off.

---

## Appendix A: motion recipes (adapt to the installed library versions)

```js
// Cursor ring (desktop, fine pointer only)
const ring = document.querySelector('.cursor');
const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
/* .cursor { position: fixed; top: 0; left: 0; width: 24px; height: 24px;
   margin: -12px 0 0 -12px; border: 4px solid var(--gold); border-radius: 50%;
   pointer-events: none; z-index: 9999; } */

// Pop reveal
gsap.utils.toArray('[data-reveal="pop"]').forEach(el => {
  gsap.from(el, {
    y: 40, scale: 0.95, autoAlpha: 0, duration: 1, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
  });
});

// Hero car enters from the side, settles, headlights on
const tl = gsap.timeline({ delay: 0.3 });
tl.fromTo('.hero-car', { xPercent: 60, autoAlpha: 0 },
                       { xPercent: 0, autoAlpha: 1, duration: 1.6, ease: 'expo.out' })
  .to('.hero-car', { rotation: -0.6, y: 3, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.2')
  .to('.hero-headlights', { autoAlpha: 1, duration: 0.4 }, '-=0.1');

// Car drives along an SVG road on scroll
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
gsap.to('.road-car', {
  motionPath: { path: '#road', align: '#road', autoRotate: true, alignOrigin: [0.5, 0.5] },
  ease: 'none',
  scrollTrigger: { trigger: '.how', start: 'top 70%', end: 'bottom 30%', scrub: 0.6 }
});
```

---

## Appendix B: questions to log in `docs/CLIENT-QUESTIONS.md` (then continue with flagged placeholders)

1. Brand name, logo, preferred language(s), and whether the market is Algeria (French, DA).
2. Fleet list with photos, categories, daily prices, degressive tiers, deposits, minimum age and licence seniority per category.
3. Agencies: addresses, opening hours, phone, WhatsApp, e-mail, delivery or chauffeur service availability.
4. Rental-day rule for edge cases (for example 25 h) and extras offered (child seat, second driver, GPS).
5. Real reviews, real counters, brand video or footage.
6. Whether hourly rentals and chauffeur-driven rentals are offered.
7. Hosting target (Cloudflare Pages assumed) and e-mail provider for request notifications.
