# 06. Page Specs

**Structure guard.** Keep every route, the home section order, and the 3-step reservation workflow. This file changes how each part **looks, moves, reads and responds**, not what exists. Where a section's presentation changes a lot (categories, services), a fallback that keeps the original layout is given.

Each spec uses: **Intent, Layout, Content, Motion** (refers to the signature moments `S1` to `S12` in `05`), **States, Mobile, Acceptance**. Copy comes from `03`. Tokens and components come from `04`.

---

## 0. Global shell (on every page)

- **Skip link** to `#main`, visible on focus. On route change, move focus to the page `h1` and announce the title.
- **Top info bar** (desktop only, 36 px): "Réponse écrite sous {RESPONSE_TIME}. Aucun paiement en ligne." on the left, phone and WhatsApp on the right. Slides up and away after 40 px of scroll.
- **Header**: see `04` section 8. The phone number is a `tel:` link; on mobile a phone icon button sits next to the menu button.
- **Mobile menu**: full-screen overlay, circular clip-path opening from the button, links in display type revealed line by line, runway line at the bottom, TikTok and WhatsApp at the end.
- **Mobile action bar** (Appeler, WhatsApp, Réserver): on Home, Fleet, Vehicle, Services, About. **Hidden on the reservation steps** (the keyboard needs the space).
- **Scroll gauge** (desktop, bottom-right): a 56 px ring with a progress arc and an up arrow, shown after 600 px, cursor state `link`.
- **Preloader** (S2), **cursor** (section 7 of `05`), **grain and vignette** overlays.
- **Page transitions** (S10).
- **Loading UI**: `loading.tsx` skeletons that match the final layout. The word "Chargement" never appears.
- **Error UI**: friendly error boundary with a retry button and the WhatsApp link.

---

## 1. Home page (`/`)

### H1. Hero "Arrivée"
- **Intent**: land at night, the car is waiting. State the promise in three seconds.
- **Layout (desktop 1440)**: inset frame (margin 16 px, radius 32) at least 100svh and at least 760 px tall. The headline block sits left (cols 1 to 7), the **car cut-out** large on the right bleeding beyond the frame edge, the **glass booking bar** docked at the bottom (full width of the content). A live chip top-left under the header: "Alger · 21:42" with a small emerald dot and "Livraison gratuite à l'aéroport".
- **Background**: a real night or dusk image of the airport arrivals curb or the Algiers bay, or the hero loop video (poster first). Vignette and scrim for legibility. Warm glow sprite behind the car. Runway dashes along the bottom edge of the frame; edge lights as a sparse dotted line above the bar.
- **Content**: label pill, H1 ("Atterrissez. Votre voiture vous attend."), sub, two buttons (primary "Voir les voitures disponibles", secondary "Écrire sur WhatsApp"), booking bar.
- **Booking bar**: Prise en charge (default Aéroport d'Alger Houari Boumediene; other options from data), Retour (toggle "Même lieu"), Départ (date and time), Retour (date and time), submit. Defaults computed on the client in `Africa/Algiers` (tomorrow 10:00 and +3 days, respecting `MIN_LEAD_HOURS`). Submit goes to `/vehicules?pickup_at=...&return_at=...&pickup=airport`. **No "Avec chauffeur" until confirmed.**
- **Motion**: S1 in full. Pointer parallax (desktop). Scrubbed exit.
- **States**: image failure shows a gradient plate with the car cut-out; booking bar shows validation inline.
- **Mobile**: stacked. Pill, H1, sub, CTAs, then the car (cropped to the frame), then a booking **card** whose date field opens a bottom-sheet calendar. No video (poster only), simplified parallax off.
- **Acceptance**: LCP at most 2.0 s (Slow 4G emulation), no CLS, S1 timeline at most 2.2 s, default dates are in the future, the WhatsApp button prefilled correctly.

### H2. Trust strip (replaces the fake statistics)
- **Intent**: the five verified promises, instantly.
- **Layout**: five columns separated by hairlines (desktop), 3 plus 2 at tablet, a 2-column grid at 390 px with the last item spanning. Line icon, one line of text.
- **Content**: from `03` (Livraison et retour gratuits à l'aéroport / Assistance 24h/24, 7j/7 / Assurance tous risques / Voitures récentes, auto ou manuelles / Tarifs clairs, caution restituée).
- **Motion**: hairlines **draw** left to right, icons draw (stroke), items `pop` with 80 ms stagger. Hover: the icon animates once.
- **Rule**: **no numbers** unless they are verified in the facts register. If a real number exists (for example vehicles in the fleet), use the odometer.
- **Acceptance**: every claim reads from `site-facts.ts` with status `verified`.

### H3. Choisissez votre catégorie
- **Intent**: let people self-sort in one glance, with the conditions visible.
- **Layout**: selector pills (one per category) with a sliding gold indicator, and below a **stage**: category name in display type, "À partir de {prix} DA / jour" (odometer), three facts with icons (âge minimum, permis, caution), a CTA "Voir les voitures de cette catégorie" (links to `/vehicules?category=...`), and the **car cut-out** on the right.
- **Motion**: S3 (sideways swap, speed streaks, word-mask text swap, odometer).
- **Fallback (if no per-category cut-outs yet)**: keep the original card rail: a draggable rail with 6 cards, each with a photo, name, "Dès" price and conditions.
- **Mobile**: pills scroll horizontally with snap, the stage stacks (text then car), swap distance 8 vw.
- **Acceptance**: keyboard-operable tablist, interruptible swaps, no layout shift when the text changes (reserve height).

### H4. Nos prestations
- **Intent**: what the company really does, no filler.
- **Layout**: an **editorial list** of 3 to 4 large rows (display serif title, one line of text, hairline, arrow), lots of vertical space.
- **Content**: only verified services (see `03`). Unverified ones are hidden.
- **Motion**: hover (desktop) makes a **preview image follow the cursor** (cursor state `view`), the hairline draws in gold, the arrow nudges. Rows reveal with `rise` and drawn hairlines.
- **Mobile**: each row **expands on tap** to show its text and image. No cursor effects.
- **Fallback**: card grid with real photos, but never 4 identical cards with identical text.
- **Acceptance**: no English strings, each description unique and true.

### H5. La flotte
- **Intent**: show the real cars, beautifully, and make renting one tap away.
- **Layout**: filter tabs (Tous plus categories) and 6 cards. **Lab variants**: (A) asymmetric 3-by-2 grid with varied card sizes, (B) draggable rail. Mobile always uses a snap-scroll rail with a visible peek.
- **Card**: see "Fleet card" in `04`. Price uses tabular numerals and the odometer when the filter changes.
- **Motion**: S4 (alternating sideways entries, spotlight border, hover car slide, velocity skew).
- **Link**: "Voir les {n} véhicules" to `/vehicules`.
- **States**: skeletons that match the card layout, empty-category state.
- **Acceptance**: each card links with an accessible name ("Voir la Volkswagen Tiguan"), no hotlinked images, correct `sizes`.

### H6. Pourquoi choisir DZ Rent Car
- **Intent**: four true reasons, a human feel.
- **Layout**: an **asymmetric collage**: a tall rounded photo and a smaller overlapping photo (parallax offset), a **rotating text badge** ("Livraison gratuite à l'aéroport"), and a text column with four outlined cards (gold icon circle, title, one line).
- **Content**: Livraison gratuite à l'aéroport, Assistance 24h/24 7j/7, Assurance tous risques, Voitures récentes (`03`).
- **Motion**: `wipe` on the photos, `pop` stagger on the cards, badge rotation (20 s linear, in view only).
- **Do not show** a "10K+ clients" badge or an avatar stack of stock faces.
- **Acceptance**: photos are real and show the real cars, the badge is crisp at 96 px.

### H7. Vidéo
- **Intent**: a human, moving moment. Proof that real people hand over real keys.
- **Layout**: S6 (the frame expands). Label "En route", H2 "Voyez comment ça se passe", the play button.
- **Content decision rule**:
  - Horizontal footage exists: the expanding frame with the lightbox.
  - Only vertical (TikTok) footage exists: the **TikTok strip** of four phone-frame clips plus a "Suivez-nous sur TikTok" button.
  - Nothing real exists yet: **remove the section** (do not ship an empty player). Log it in `ASSETS-TODO.md`.
- **Brand strip**: only brands in the real fleet, or remove it.
- **Acceptance**: lightbox is accessible (focus trap, `Esc`, labelled), video pauses on close, the poster loads fast, no autoplay with sound.

### H8. Comment réserver
- **Intent**: reassure and show how little effort it takes.
- **Layout**: sticky left column (title, counter), right column with four steps (numbers 01 to 04 are valid because it is a sequence), a dashed **lane line** and a **car** that drives along it.
- **Content**: from `03`.
- **Motion**: S5.
- **Mobile**: no pin, a smaller car, the line draws with scroll.
- **Acceptance**: steps highlight in sync with the car, no jank, reduced-motion fallback highlights the step in view.

### H9. Témoignages
- **Rule**: **real, permitted reviews only.**
- **Layout**: one large quote with big quotation marks and a star row, plus a list of other reviewers to switch between (mobile: swipeable cards). Proof can also be a **marquee of real screenshots** (WhatsApp, Google, TikTok comments) with names hidden if needed.
- **Fallback**: fewer than 3 real reviews means **hide the section** and use the footer invitation to leave a review on WhatsApp.
- **Motion**: the quote swaps with a word-mask transition, the list indicator slides.
- **Acceptance**: no template names, no stock avatars, every item has a source and a date.

### H10. FAQ and the three features
- **Layout**: left sticky (label, heading, "Toutes les questions" button), right accordion (see `04`). Under it a hairline and three line-icon features.
- **Content**: confirmed answers only (`03`).
- **Motion**: smooth height, icon morph, the open header turns gold. One open at a time.
- **SEO**: `FAQPage` JSON-LD for confirmed answers.
- **Acceptance**: `aria-expanded`, keyboard operable, no layout jump on open.

### H11. CTA band
- **Layout**: full-bleed, tread texture, top spotlight, H2 "Prêt à prendre la route ?", sub, primary and WhatsApp buttons, runway dashes leading to the button, two car cut-outs.
- **Motion**: S9.
- **Acceptance**: buttons never hidden under the cars, mobile shows one car.

### H12. Footer
- **Layout and content**: see `04` and `03`. Four columns, TikTok first among socials, giant outline wordmark (S11), legal links.
- **Acceptance**: all links valid, verified social handles only, address and hours shown only when known.

---

## 2. Fleet page (`/vehicules`)

- **Intent**: find a car for these dates in seconds.
- **Server-render the list** with skeletons (no "Chargement"). Per-page metadata and JSON-LD.
- **Header zone**: H1 "La flotte", result count that **rolls** (odometer), and a **sticky date bar** (pickup place, pickup, return) that mirrors the URL and updates results without a full reload.
- **Filters**: category, brand, seats, gearbox, fuel, price range, and "Disponible pour mes dates" **only if availability data exists** (otherwise hide it). Desktop: left sidebar. Mobile: **bottom sheet** with a drag handle (spring physics) and an applied-filters chip row.
- **Sort**: prix croissant, prix décroissant, catégorie.
- **Cards**: the fleet card (`04`) with the **total for the chosen period** (price × days, odometer) and "Réserver" which carries the dates.
- **Empty state**: "Aucune voiture disponible pour ces dates. Essayez d'autres dates ou écrivez-nous sur WhatsApp." with a gold WhatsApp button.
- **Motion**: S4 entrances, S7 (the card image is the shared element), count rolls.
- **Acceptance**: filters sync with the URL, back and forward restore state and scroll, every card has an accessible name, no CLS.

---

## 3. Vehicle page (`/vehicules/[slug]`)

- **Gallery** (left): main image plus a thumbnail row of **real, distinct** photos (at least 4; with fewer, show them without duplicates and hide the strip when only one). Click opens a **lightbox** (Flip from the thumbnail, swipe, arrow keys, pinch zoom). Cursor `view`. Viewfinder corner marks on hover.
- **Details** (right, sticky on desktop): a **line-art drawing** of the body type that draws itself, the name (display), spec chips from real data, a short "Équipements" paragraph with an expander.
- **Prices**: a block with large tabular numerals: par jour, par semaine, par mois (only if confirmed), the **caution**, and the **conditions of the category** (âge minimum, ancienneté du permis). Remove the unverified rating.
- **Sticky booking card**: pickup place (default airport), dates (prefilled from the URL or the computed defaults, **never hard-coded**), the live **total** (odometer), a primary "Réserver cette voiture" (carries dates) and a WhatsApp button prefilled with the car and the dates. A line: "Livraison et retour gratuits à l'aéroport."
- **Below**: spec grid (puissance, 0 à 100 km/h, consommation, coffre, portes), features with icons, an "À propos de ce modèle" paragraph, a **similar vehicles** rail (same category), a 3-question FAQ snippet.
- **Motion**: S7 entry and line-art draw, chips `pop`, price odometer.
- **Mobile**: swipeable gallery with dots, the booking card becomes a **bottom bar** showing price and the primary button.
- **SEO**: unique title and description, `Product` JSON-LD (offers in DZD), `BreadcrumbList`.
- **Acceptance**: no duplicate images, no hard-coded dates, price and total correct for every day-count edge case, accessible gallery.

---

## 4. Reservation flow (`/reserver/modele/[id]?pickup_at=...&return_at=...`)

**Keep the workflow.** Same URL pattern, same three steps, same fields. Improve everything around it.

**Server-render** the summary and the stepper shell, with a skeleton for the form.

### Summary card (top)
Vehicle photo and name, **Catégorie**, **Période** (`sam. 17 oct. 2026, 10:00 → mar. 20 oct. 2026, 10:00` and "3 jours"), **Total estimé** (odometer, "54 000 DA"), "+ caution {montant} DA". A link "← Changer de véhicule ou de dates" returns to `/vehicules` with the same dates. On mobile it collapses into a **compact sticky bar** after scrolling.

### Conditions banner
"Conditions pour cette catégorie : âge minimum {n} ans · permis depuis {n} an(s)" (correct plural).

### Stepper
Three labelled steps with a progress segment that fills under each.

### Step 1: Vos coordonnées
- Nom et prénom *
- Téléphone * (hint: "L'agence vous appelle pour confirmer l'heure de la remise.")
- E-mail * (hint: "L'acceptation ou le refus vous parvient par écrit.")
- Button "Continuer".

### Step 2: Votre permis
- Date de délivrance du permis * (hint: "Ancienneté minimale exigée : {n} an(s).")
- Date de naissance * (hint: "Chaque catégorie a son âge minimum.")
- Numéro du permis (facultatif)
- Buttons "Précédent" and "Continuer".
- **Live eligibility check** against the category, computed on the **pickup date**: if not eligible, show an inline explanation and **suggest eligible categories** with a link. Never a dead end.

### Step 3: Départ et envoi
- "Prise en charge et retour": the place (airport, with a selector when several), "Véhicule réservé : {modèle}. Ce modèle précis vous est réservé."
- "Un mot pour l'agence" (facultatif).
- Consent checkbox: "Je confirme l'exactitude de ces informations et j'accepte d'être contacté par téléphone et par e-mail au sujet de cette demande."
- Hidden **honeypot** field and a minimum-time check.
- Buttons "Précédent" and **"Envoyer ma demande"**; line below: "Aucun paiement en ligne. Rien n'est débité maintenant."
- **WhatsApp fallback**: "Préférez-vous WhatsApp ? Envoyer ma demande par WhatsApp" (prefilled with the details).

### Behaviour
- Per-step validation with plain-language inline errors. Algerian phone formatting (`0555 12 34 56`). Dates validated (licence date before today, birth date plausible).
- Progress saved in `sessionStorage`; refresh does not lose input. Double-submit guard; loading state keeps button width.
- Step transitions: content slides sideways 24 px with fade (320 ms), the segment fills, the total does not jump.
- Frequent actions (typing, tabbing) are instant.

### Date and price logic (`src/lib/dates.ts`, unit tested)
- `days = max(1, ceil(hours / 24))` with `hours = (return - pickup) / 3_600_000`. Exactly 72 h is 3 days. **Confirm any grace period with the client** and encode it once.
- Time zone `Africa/Algiers` (no daylight saving). Display with `Intl.DateTimeFormat('fr-DZ', ...)` (fallback `fr-FR`).
- Default pickup: tomorrow 10:00 (respect `MIN_LEAD_HOURS`), return +3 days. Past dates disabled.
- Eligibility: `age = fullYears(birthDate, pickupDate)`, `licenceYears = fullYears(licenceDate, pickupDate)`; the birthday on the pickup day counts.

### Types (starting point)

```ts
type Category = { slug: string; name: string; minAge: number; minLicenceYears: number; deposit: number; fromPrice: number };
type Vehicle = { id: number; slug: string; name: string; brand: string; categorySlug: string; year: number;
  gearbox: 'automatique' | 'manuelle'; fuel: 'essence' | 'diesel' | 'hybride'; seats: number; doors: number;
  pricePerDay: number; priceWeek?: number; priceMonth?: number;
  images: { src: string; alt: string; angle: string }[]; cutout?: string; features: string[] };
type ReservationRequest = { vehicleId: number; pickupAt: string; returnAt: string; pickupPlace: string;
  fullName: string; phone: string; email: string; birthDate: string; licenceDate: string; licenceNumber?: string;
  note?: string; consent: true; honeypot: ''; };
```

### Confirmation (`/reserver/confirmation/[ref]`)
- **Boarding pass** (S8): reference (`DZR-YYMMDD-XXXX`), vehicle, place, dates, status. Detailed personal data shown only after entering the **last 4 digits of the phone number** (privacy).
- Status timeline (Demande reçue, Étude par l'agence, Réponse écrite, Remise des clés).
- Buttons: "Partager sur WhatsApp", "Ajouter au calendrier (.ics)", "Retour à l'accueil".
- E-mail to the customer and a notification to the agency.
- Printable layout.

### Acceptance
All cases in the form test matrix in `08`; correct formats; no placeholder text; works with JS slow; accessible errors.

---

## 5. Other pages

### `/services`
Three or four verified services as **editorial sections** (photo, text, key facts, CTA), with a sticky sub-navigation. Only confirmed claims (see `03`). Each ends with a clear action ("Voir les voitures", "Écrire sur WhatsApp"). Remove unverified promises (F-24).

### `/a-propos`
Short and honest: the story in the client's own words (`TODO:CLIENT`), **why the airport delivery exists**, verified numbers only, a real team or agency photo, a map. Remove "rigueur suisse", "100% concession", "conseiller attitré" and any unconfirmed number (F-25). If content is thin, the page stays short and confident.

### `/faq`
Grouped (Réservation, Documents et conditions, Livraison à l'aéroport, Pendant la location, Paiement et caution), a search field, confirmed answers, `FAQPage` JSON-LD, a WhatsApp CTA at the end.

### `/contact`
WhatsApp as the primary card, then phone, e-mail, address and hours (when known), a **static map image** with an "Ouvrir dans Maps" button (no heavy embed), "Comment nous trouver à l'aéroport" (when confirmed), and a short form (nom, téléphone, message) with the same input styling and an animated success state.

### Legal pages
`/mentions-legales`, `/conditions`, `/confidentialite`: content from the client with `TODO:CLIENT` markers, readable typography, a sticky table of contents on desktop.

### `/404`
A designed page: a car drives off the edge of the screen, "Cette page a pris la route. Revenez à l'accueil." and a primary button.

---

## 6. Cross-page rules

- **Same system everywhere**: the same buttons, inputs, motion tokens and spacing.
- **Scroll restoration**: back and forward restore position; list filters restore.
- **No hard cuts**: S10 transitions and S7 shared elements.
- **Every form state** designed: default, focus, filled, error, loading, success.
- **Print**: confirmation page prints cleanly.
- **Never ship**: placeholder text, "TODO" visible to visitors, lorem, English strings, template names, dead links.
