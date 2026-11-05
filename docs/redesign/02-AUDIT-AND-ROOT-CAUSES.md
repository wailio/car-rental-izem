# 02. Audit and Root Causes

## 1. How this audit was produced, and what it could not see

This audit was written on **12 October 2026** by reading the **live HTML and text content** of these pages: `/`, `/vehicules`, `/vehicules/volkswagen-tiguan`, `/reserver/modele/1?...`, `/services`, `/a-propos`. It also used public search snippets of the company's TikTok captions.

**It could not see**: the CSS, the JavaScript, the rendered pixels, the animations, the mobile layout, performance, the `/faq` and `/contact` pages, or the company's TikTok feed (TikTok blocks automated access).

So the findings in section 2 are **verified facts about content, links and structure**. The hypotheses in section 3 are **educated guesses about the visual and motion problems** that **you must confirm or reject with evidence** in Phase 0 by looking at the real thing in the browser. Do not trust this file over your own measurements. Where you disagree, write why in `AUDIT.md`.

---

## 2. Verified findings (content, links, structure)

Severity: **C** critical (breaks trust or function), **H** high, **M** medium, **L** low.

| ID | Where | Finding | Sev | Fix direction |
|---|---|---|---|---|
| F-01 | Home hero | Default dates read "Sam. 10 Octo. 2026 — 10:00" to "Mar. 13 Octo. 2026 — 10:00". On 12 Oct 2026 the pickup default is already in the past. | C | Compute defaults on the client in `Africa/Algiers`: next valid slot (respect `MIN_LEAD_HOURS`), return +3 days. Disable past dates. |
| F-02 | Home hero | Month abbreviation "Octo." is not French. | M | Use `Intl.DateTimeFormat('fr-DZ', ...)`, which gives "oct.". |
| F-03 | Home and global | Contradictions: hero says "Confirmation express en 15 min", top bar and "Comment réserver" say 24 h; About says agency open Monday to Saturday while features say "7j/7". | H | One `RESPONSE_TIME` and one `OPENING_HOURS` in the facts register. Confirm with the client. |
| F-04 | Home and About | Numbers conflict: "15K+ Clients Satisfaits", "10K+ Clients Comblés", "1200+ clients satisfaits"; "17 véhicules"; "99% satisfaction"; "2 agences" while the footer shows one "Agence Principale". | C | Remove or replace by verified numbers. Single source in the facts register. |
| F-05 | Whole site | **Positioning mismatch.** Copy and keywords sell "luxe, prestige, VIP, chauffeur d'élite, Porsche, BMW, Mercedes", with a Rolls-Royce image and luxury logos, but the fleet is VW Tiguan, Opel Grandland, Peugeot 2008, Fiat Tipo, Geely Coolray, Seat Arona. The company's own TikTok describes something different (see `03`). | C | Reposition honestly (see `03` and `04`). Luxury comes from craft and calm, not from claims. |
| F-06 | Home services, video, testimonials | English template leftovers: "Explore our wide range of rental services", "Car Rental With Driver", "Business Car Rental", "Airport Transfer", "Chauffeur Services", "View All Service", "Watch Full Video", "Discover the ease and convenience of renting with Us", "What our customers are saying about us". | H | French only. |
| F-07 | Home services | The four service cards share the same filler text: "Enhance your rental experience with additional options." | H | Write real, specific, verified descriptions or reduce the list. |
| F-08 | Home, fleet cards, services | Several links have visible or accessible text equal to the path (`/services`, `/vehicules/volkswagen-tiguan`). | M | Give stretched-link overlays an `aria-label` (for example "Voir la Volkswagen Tiguan"). |
| F-09 | Home testimonials | Template people (Leslie Alexander, Alis White, Floyd Miles, Courtney Henry, Robert Fox, Annette Black), the same job title "Project Manager" three times, a quote that names "nova ride", Unsplash stock faces. | C | Delete. Replace by **real** proof or hide the section (rules in `06`). Fake reviews are also a legal risk. |
| F-10 | Home video block | Brand strip shows Jaguar, Volkswagen, Honda, Mercedes-Benz, Audi, Lexus. The fleet has VW, Opel, Peugeot, Fiat, Geely, Seat. | H | Show only brands in the real fleet, or remove the strip. |
| F-11 | Home bottom CTA | "WhatsApp Direct" links to `/213555333316` (a relative path on the site, so a 404), while the sticky bar uses the correct `wa.me` link. | C | `https://wa.me/213555333316?text=...` everywhere, from one helper. |
| F-12 | Footer | Social links are `instagram.com/dzrentcar`, `facebook.com/dzrentcar` (unverified) and a bare `x.com`. The company's real TikTok `@dz.rent.car` is missing. | H | Use verified handles only. Add `https://www.tiktok.com/@dz.rent.car`. Remove X unless it exists. |
| F-13 | Home, services, about | Images: Unsplash photos hotlinked (testimonial avatars, services, about), a Rolls-Royce front and a convertible with passengers that do not match the fleet. | H | Self-host real photos of the real cars. Consistent grading. If placeholders are unavoidable, mark them in `ASSETS-TODO.md` and keep them visually consistent. |
| F-14 | Footer | Address is only "Agence Principale, Alger, Algérie", no hours. A newsletter label "Lettre Confidentielle" is odd. | M | Real address or "Livraison à l'aéroport" explanation, hours, map link. Rename or remove the newsletter. |
| F-15 | Whole site | Cliché luxury vocabulary repeats: "d'exception" (many times), "Excellence", "VIP", "prestige", "sans compromis", "rigueur", "palaces". | H | Plain, specific, true copy. Banned word list in `03`. |
| F-16 | `/vehicules` | The fleet page ships only "Chargement de la flotte..." in the server HTML (client-rendered). | H | Server-render the list with layout-matched skeletons. |
| F-17 | Vehicle page | The gallery uses the same image twice (`/cars/volkswagen-tiguan.jpg`, alt "vue 1"). | M | Real multi-angle photos. If only one exists, show one and no thumbnail strip. |
| F-18 | Vehicle page | "Réserver ce véhicule" hard-codes `pickup_at=2026-10-06T09:00&return_at=2026-10-09T09:00` (past, and identical to the LOVEHA reference URL). | C | Use the visitor's chosen dates or the computed defaults. |
| F-19 | Vehicle page | A rating "4.7 (21)" is shown with no source. | H | Remove unless it comes from real reviews. |
| F-20 | Vehicle page | "Prise en charge" and "Restitution" appear without visible values in the markup. | M | Visible defaults (airport) and clear labels. |
| F-21 | `/reserver/modele/[id]` | Client-rendered: server HTML only has "Initialisation de la réservation...". | H | Server-render the summary, skeleton for the form. |
| F-22 | Reservation | Period shown as `2026-10-06 09:00 → 2026-10-09 09:00` (ISO style). | M | `sam. 17 oct. 2026, 10:00 → mar. 20 oct. 2026, 10:00`. |
| F-23 | Reservation | "2 an(s)" and "Prise en charge : Alger" (vague). | M | Proper plural, precise place ("Aéroport d'Alger Houari Boumediene"). |
| F-24 | Services | Specific promises that look invented: name board at arrivals, real-time flight tracking with no extra cost, replacement vehicle within 2 hours, embassies and multinationals, "presse économique à bord", "tenue d'apparat", maintenance exclusively at brand dealerships. | C | Hide or neutralise until the client confirms each one in writing. |
| F-25 | About | Unverified claims: "rigueur suisse", "Flotte 100% Concession", "conseiller attitré", "5 ans d'expérience", "2 agences". | C | Same rule as F-24. |
| F-26 | Global metadata | Same `<title>`, description and Open Graph on every page. Title says "Voitures de Luxe". Keywords include Porsche, BMW, Mercedes. | H | Per-page metadata, honest keywords (see `03`). |
| F-27 | Global metadata | `og:url` is fixed to `https://dzrentcar.dz` (confirm the real domain), Twitter card is `summary`, no OG image. | M | Dynamic canonical, real OG image per page. |
| F-28 | Home and vehicle | No structured data observed. | M | JSON-LD: `AutoRental` or `LocalBusiness`, `FAQPage`, `BreadcrumbList`, `Product` for vehicles. |
| F-29 | Hero | The H1 is split with a line break that leaves no space in the text ("Automobileau Cœur d'Alger"). Screen readers can read it as one word. | L | Use block spans or `&nbsp;`, not a bare `<br>`. |
| F-30 | Global | Category "Dès" prices and fleet prices are plausible but come from the code, not the client. Deposits (for example 80 000 DA for SUV) too. | M | Mark every price and deposit `CONFIRM` in the facts register. |

---

## 3. Why it feels "dead" and "AI slop": root-cause hypotheses to verify

For each one, **find evidence in the code or in DevTools** and mark it Confirmed, Partly, or Rejected in `AUDIT.md`.

| ID | Hypothesis | How to verify |
|---|---|---|
| H-1 | **One reveal preset everywhere** (fade and rise on every block, triggered once). Nothing varies, so nothing feels directed. | Search for `whileInView`, `useInView`, `IntersectionObserver`, `ScrollTrigger`, and count distinct presets. |
| H-2 | **No input coupling**: nothing reacts to the cursor, scroll velocity, idle time or touch beyond a colour change. | Move the pointer over hero, cards, buttons. Scroll fast then stop. Watch for any reaction. |
| H-3 | **Default easing and uniform durations** (`ease`, `ease-in-out`, `0.3s` on everything). | Search `transition: all`, `duration-300`, `ease-in-out`, `cubic-bezier`. |
| H-4 | **`transition: all` and animating layout properties** (width, height, top, left, margin) causing jank. | Search plus Performance trace for layout and paint during hover and reveal. |
| H-5 | **Conflicting or unused motion libraries** (Framer Motion plus GSAP plus CSS). | Check `package.json` and imports. |
| H-6 | **Images**: oversized, no priority on the LCP image, no blur or colour placeholders, layout shift as they load, `w=3840` requested for tiny images. | Network panel (Img filter), Lighthouse "properly size images", CLS. |
| H-7 | **Fonts**: common AI-luxury defaults (Cormorant, Playfair, Inter), no metric-matched fallback so text shifts. | Search `next/font` and `font-family`. Check CLS around text. |
| H-8 | **Rhythm**: the same section padding everywhere, equal-height sections, centred stacks. | Measure section paddings and heights. Squint test (blur the screenshot). |
| H-9 | **Accent without hierarchy**: gold used on everything (borders, icons, buttons, underlines) so nothing stands out. | Count gold usages per viewport in screenshots. |
| H-10 | **SaaS card kit**: identical radius, border and shadow on every card, a grid of equal cards in every section. | Count distinct `border-radius` and `box-shadow` values (`rg -o "rounded-[a-z0-9\[\]-]+" src`). |
| H-11 | **Missing states**: hover is only a colour change, no pressed state, no `:focus-visible`, no loading or empty states, state changes snap instead of transition. | Keyboard-tab through. Click and hold. Throttle network. |
| H-12 | **Hydration flashes and client placeholders** ("Chargement...") that break the illusion of smoothness. | Throttle CPU and network, hard reload, watch the first 3 seconds. |
| H-13 | **Mobile**: animations disabled (so it feels static) or heavy (so it janks), a desktop-only cursor shown on touch. | Mobile emulation with CPU throttle. Real device if possible. |
| H-14 | **No narrative**: sections are independent blocks with no through-line, no continuity between pages (no shared elements, hard cuts). | Click through the whole flow and note every hard cut. |

**Useful searches** (ripgrep; adapt to your shell, PowerShell or bash):

```text
rg -n "transition(-all)?:\s*all" src
rg -n "duration-(150|200|300|500|700)" src
rg -n "ease-in-out|ease-in\b|cubic-bezier" src
rg -n "whileInView|useInView|IntersectionObserver|ScrollTrigger|gsap|framer-motion|motion/react" src package.json
rg -n "will-change|backdrop-filter|filter:\s*blur|blur-" src
rg -n "unsplash" src next.config.*
rg -n "Leslie|Floyd|Courtney|Robert Fox|Annette|Alis White|nova ride|Lorem" src
rg -n "Explore our|Enhance your|Watch Full Video|View All|What our customers|Discover the ease" src
rg -n "pickup_at=20|return_at=20" src
rg -n "wa\.me|213555333316" src
rg -n "d'exception|Excellence|prestige|VIP|sans compromis|rigueur" src
rg -n "\"use client\"|'use client'" src
rg -n "next/font|font-family|Cormorant|Playfair|Inter" src
rg -n "@keyframes" -A6 src
```

---

## 4. Phase 0 audit procedure

1. Run the site locally. Open it with the browser subagent in Chrome.
2. **Capture the baseline**:
   - Screenshots of every route at 1440, 1024, 768, 390 and 320 px.
   - A scroll recording and a hover recording per page (about 20 s each).
   - A **Performance trace** (desktop, then mobile emulation with 4x CPU throttle and Slow 4G) of load plus a 10 s scroll. Note long tasks, layout shifts, frames over 20 ms.
   - A **Lighthouse** run on Home, Fleet, Vehicle, Reservation (mobile).
   - `npx impeccable detect src/` (save the output).
   - Run the searches in section 3.
3. Click through the entire user journey: Home, Fleet, Vehicle, Reservation, back to Home. Note every hard cut, delay, jump, flash, dead zone.
4. Write `AUDIT.md` using the template below.

### `AUDIT.md` template

```markdown
# Audit (date, build hash)
## 1. Baseline numbers
(per route: LCP, CLS, TBT, INP, % frames > 20 ms, JS size, image weight)
## 2. Verified findings F-01..F-30
(Confirmed / already fixed / cannot reproduce, with a screenshot each)
## 3. Hypotheses H-1..H-14
(Confirmed / Partly / Rejected, with evidence: code lines, trace screenshots)
## 4. New findings not listed in 02
(anything you found that the pack did not predict)
## 5. Aliveness baseline score (10 criteria, 0 to 5, with one sentence each)
## 6. Top 10 changes that will move the needle most
## 7. Risks and unknowns
```

---

## 5. Aliveness scorecard (score before and after)

Score each criterion from 0 to 5 using the anchors. **Target after redesign: at least 42 out of 50**, with no criterion below 4.

| # | Criterion | 0 (dead) | 3 (acceptable) | 5 (alive) |
|---|---|---|---|---|
| 1 | **Responsiveness** | Hover is a colour change only | Hover and press states, some easing | Every interactive element answers in under 100 ms with tuned easing; pointer, scroll and touch all couple to something |
| 2 | **Choreography** | Everything appears at once or one preset | Staggered reveals | Sequenced, overlapped, directed motion with anticipation and settle; variety by content |
| 3 | **Depth** | Flat layers | Some parallax | 3 or 4 depth planes, consistent light direction, elevation system, shared-element continuity |
| 4 | **Material** | Flat fills | Some gradients, shadows | Grain, glass with real blur, light and bloom, edge highlights, honest shadows |
| 5 | **Rhythm** | Same section pattern repeated | Some variety | Dense and airy alternate, scale contrast, quiet pauses, asymmetry on purpose |
| 6 | **Typographic voice** | Similar sizes, default feel | Clear hierarchy | Strong scale contrast, expressive display type, comfortable measure, tabular numerals |
| 7 | **Imagery** | Mismatched stock | Consistent stock | Real, graded, art-directed photos and cutouts that animate |
| 8 | **Copy authenticity** | Generic, mixed languages, false claims | Clean and French | Specific, true, warm, local; every number real |
| 9 | **Smoothness** | Jank, layout shift, placeholders | Mostly smooth | 60 fps, no CLS, no hydration flash, instant feedback |
| 10 | **Delight** | None | One nice effect | A memorable moment on every page, all quiet elsewhere |
