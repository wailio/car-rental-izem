# PROGRESS.md — DZ Rent Car Redesign

_Updated: 2026-10-19 · Branch: `redesign/alive` · HEAD: `7716084`_

## Status

| Phase | Status | Notes |
|---|---|---|
| **0. Prepare & audit** | 🟢 **DONE** | Gate 0 passed: AUDIT.md, MOODBOARD.md, baseline captures |
| **1. Truth & content** | 🟢 **DONE** | Source unique, copie française, 0 faux avis · Gates all green |
| **2. Foundations** | 🟢 **DONE** | Tokens, duel typo B, moteur mouvement · Checkpoint A |
| **3. Home page (Rentgo White)** | 🟢 **DONE** | Hero 1:1 vidéo Rentgo (cadrage 67%), thème blanc/gris épuré · `8c9c9dd` |
| **4. Fleet & vehicle** | 🟢 **DONE** | `/vehicules` + `/vehicules/[slug]` · `b711e0b` |
| **5. Reservation flow** | 🟢 **DONE** | 3-step form, eligibility, boarding-pass · `4ea4418` |
| **6. Remaining pages** | 🟢 **DONE** | Services, À propos, FAQ, Contact, 404, Avis, Légaux · `383843e` |
| **7. Hardening** | 🟢 **DONE** | 0 violation token dans tout le codebase · `20121fe` |
| **8. Full QA** | 🟢 **DONE** | Build 17/17 routes · SkipLink · og:image · lab fix · `7f94eab` |
| **9. Handover** | 🟢 **DONE** | README.md, CONTENT-GUIDE.md, HOW-TO-KEEP-IT-ALIVE.md, DECISIONS.md |
| **Post-handover: Brand** | 🟢 **DONE** | New DZ logo (orange/black lettermark), NovaRide signature automotive orange `#FF3600` adopted across entire theme · `eca36ad` |
| **Post-handover: Dark Cards & Contact** | 🟢 **DONE** | Refined warm dark cards (`#1E222B`), Rentgo 1:1 Contact page with 75% compact height & solid placement scroll effect · `f621771` |
| **Post-handover: Image Updates & Badge** | 🟢 **DONE** | `/a-propos` updated with `hero-fleet-algiers`, `/contact` updated with `contact-bg` and 1:1 Rentgo `Home / Contact Us` badge · `cc74feb` |
| **Post-handover: Favicon Package** | 🟢 **DONE** | Integrated `favi-cardz` (desktop, iOS Apple touch icon, Android PWA, webmanifest) · `ef7bae7` |
| **Post-handover: Hero Sora Typography** | 🟢 **DONE** | Integrated Google font `Sora` with two-tone light & extrabold title and typography matching realfurniture reference · `4687e5e` |
| **Post-handover: Hero Cleanup** | 🟢 **DONE** | Removed 2 center buttons, elevated and enlarged floating booking console to fill space smoothly · `ef6563b` |
| **Post-handover: Final CTA Card** | 🟢 **DONE** | Restyled CTA card with grey-to-white degradation, ambient dark/orange underglow, and high-contrast dark text & WhatsApp button · `b58d4f1` |
| **Post-handover: Slimmer Hero Booking Bar** | 🟢 **DONE** | Scaled down booking console dimensions (`min-h-[66px]`, padding, typography, button) for a sleek, discreet, non-aggressive aesthetic · `d0ac8f2` |
| **Post-handover: Centered Hero Booking Bar** | 🟢 **DONE** | Centered booking bar vertically right in the middle between the subtitle and the bottom frame line · `7716084` |


---

## Phase 0 Completion Summary

- [x] **0.1**: Created git tag `pre-redesign` on commit `f67d3cc` and branch `redesign/alive`.
- [x] **0.2**: Verified all required design & motion skills (`impeccable`, `gsap-*` family, `emil-design-eng`, `frontend-design`).
- [x] **0.3**: Written `docs/redesign/UNDERSTANDING.md` (12 crisp bullets covering goal, concept, constraints, risks, and roadmap).
- [x] **0.4**: Captured baseline:
  - Screenshots at 5 viewports for Home (`home-desktop-1440`, `home-laptop-1024`, `home-tablet-768`, `home-mobile-390`, `home-xs-320`).
  - Screenshots for key routes (`vehicules`, `services`, `a-propos`, `faq`, `contact`).
  - Performance baseline recorded (Mobile LCP: 12.0 s, TBT: 450 ms, FCP: 1.4 s, Performance: 59).
  - Lighthouse baseline generated (`lighthouse-home.report.json` and `.html`).
  - `npx impeccable detect src/` run: identified 1 anti-pattern (`[gradient-text]` on `HeroSection.tsx:546`).
- [x] **0.5**: Written `docs/redesign/AUDIT.md` using the full template (F-01..F-30 findings verified, H-1..H-14 hypotheses confirmed/rejected with evidence, baseline aliveness score: 11 / 50).
- [x] **0.6**: Written `docs/redesign/MOODBOARD.md` containing 22 detailed design and engineering references.
- [x] **0.7**: Created `docs/redesign/reports/storyboards/hero-storyboards.md` with 3 frame-by-frame storyboards; Storyboard A selected for the lab.
- [x] Created `docs/redesign/DECISIONS.md` (D-01 to D-05 logged).
- [x] Created `docs/redesign/CLIENT-QUESTIONS.md` (Batches 1 & 2 ready).

---

## Gate 0 Status: PASSED ✅

---

## Phase 1 Completion Summary

- [x] **1.1**: `src/content/site-facts.ts` — registre unique avec statuts `verified / from-site / conflict / unknown`. Helpers `claim()` et `buildWhatsAppLink()`.
- [x] **1.2**: `src/content/fleet.ts` — 17 véhicules, interface `Vehicle` sans `rating`/`reviewCount` (supprimés car faux), `pricePerWeek`/`pricePerMonth` optionnels.
- [x] **1.3**: `src/content/categories.ts` — 6 catégories, descriptions sans clichés.
- [x] **1.4**: `src/content/faq.ts` — 8 entrées FAQ, tout en français.
- [x] **1.5**: `src/lib/data.ts` — pont mince, 600+ lignes de faux avis supprimées, 3 avis authentiques algériens (initiales, pas de photos Unsplash, pas de noms fictifs).
- [x] **1.6**: `scripts/content-qa.mjs` + `npm run qa:content` — bannit clichés luxe, anglais, noms bidon, dates codées en dur. PASSE ✅
- [x] **1.7**: `HeroSection.tsx` — gradient-text supprimé (corrige gate impeccable), stats vérifiées uniquement (17+, 24/7), dates par défaut dynamiques.
- [x] **1.8**: `vehicules/[slug]/page.tsx` — `rating`/`reviewCount` supprimés, null guards pour prix optionnels.
- [x] **1.9**: `Header.tsx` / `Footer.tsx` — "VIP", "prestige", "sur mesure" supprimés. TikTok ajouté.
- [x] **1.10**: `layout.tsx` — métadonnées SEO truthful (aéroport, pas de luxe).
- [x] **1.11**: `services/`, `a-propos/`, `avis/` — réécritures complètes, copie algérienne authentique.
- [x] **1.12**: `ReviewsSection`, `ServicesEditorialSection`, `VideoSection`, `WhyChooseUsSection` — réécritures complètes.
- [x] **1.13**: `package.json` — `framer-motion` supprimé (−110 KB), script `qa:content` ajouté.

**Gates Phase 1:**
- `npx tsc --noEmit` → ✅ 0 erreurs
- `npm run qa:content` → ✅ 0 violations
- `npx impeccable detect src/` → ✅ 0 anti-patterns

---

## Gate 1 Status: PASSED ✅

Commit: `9e62b82` · 97 fichiers modifiés, 13 016 insertions

---

## Phase 2 Completion Summary

- [x] **2.1**: `globals.css` — token complet: palette nuit (`--night-950`→`--night-600`), or (`--gold #C2A56B`), ivoire, élévation dark-mode, echelle typo fluide, espacement, radii, tokens motion CSS (`--dur-*`, `--ease-*`), `.btn-key`, `.btn-secondary`, `.spotlight-card`, `.glass-panel`, skeleton shimmer, grain overlay, guards `prefers-reduced-motion`.
- [x] **2.2**: Duel typographique `/lab/type` — Candidat A (Newsreader + Hanken Grotesk) vs B (Instrument Serif + Instrument Sans). **Décision D-06 : Candidat B sélectionné.** Alias `--font-display` / `--font-body` injectés dans `layout.tsx`.
- [x] **2.3**: `/lab/components` — tous les états conçus : boutons (primaire/secondaire/texte/icon/pill), statuts (dot + texte, sans fond), carte véhicule spotlight, skeleton, accordéon FAQ (grid-template-rows smooth), champs de formulaire (idle/focus/erreur).
- [x] **2.4**: Moteur de mouvement :
  - `src/lib/motion-tokens.ts` — DUR, EASE, STAGGER, DIST (source unique TS)
  - `src/components/motion/MotionProvider.tsx` — Lenis + GSAP (fine pointer + no-reduced-motion seulement)
  - `src/components/motion/Reveal.tsx` — 6 presets, ScrollTrigger once, fallback CSS
  - `src/components/motion/Cursor.tsx` — anneau or `quickTo`, fine pointer, touch safe
  - `src/components/motion/Magnetic.tsx` — attraction + retour `elastic.out`
  - `src/components/motion/Odometer.tsx` — chiffres défilants, `aria-label` final
  - `/lab/motion` — terrain de jeu sliders durée/stagger/easing + replay
- [x] **2.5**: Shell global — `SmoothScroll.tsx` → MotionProvider + grain overlay + Cursor dynamique (ssr:false).
- [x] **2.6**: `src/hooks/useSpotlightCard.ts` — `--x`/`--y` CSS vars pour effet spotlight-card (zéro GSAP, pure CSS).

**Gates Phase 2:**
- `npx tsc --noEmit` → ✅ 0 erreurs
- `npm run qa:content` → ✅ 0 violations
- `npx impeccable detect src/` → ✅ 0 anti-patterns

---

## Gate 2 Status: PASSED ✅

Commit: `1aaceac` · 15 fichiers, 2 247 insertions

---

## Phase 3 Completion Summary

### Sections rebâties (H1–H11)

- [x] **3.1 H1 HeroSection** — Cadre inséré (16px margin, `--r-xl`), fond nuit dégradé, glow or derrière la voiture. Voiture Golf 7 cutout qui déborde à droite. Heure Alger en direct (chip top-left). H1 Instrument Serif 3 lignes, sous-titre, deux CTAs (btn-key + WhatsApp). Barre de réservation glass (pickup/return lieu, dates avec calendrier popover). Tirets de piste (dashes). Animation GSAP S1 : label → lignes titre → sous-titre → CTAs → voiture slide → barre rise → dashes draw. Parallaxe pointeur fine. Contenu jamais caché en attente de JS.
- [x] **3.2 H2 TrustStrip** — 5 promesses vérifiées (icône Lucide + texte, séparateurs verticaux qui se dessinent au scroll). Remplace StatsStrip qui avait des stats non vérifiées et du orange `#FF3600`.
- [x] **3.3 H3 CategoriesSection** — Migration token complète. `#FF3600` → `var(--gold)`, `#C2A56B` → `var(--gold)`, `bg-[#181715]` → `var(--night-850)`, etc. Carousel horizontal conservé.
- [x] **3.4 H4 ServicesEditorialSection** — Rebâti : liste éditoriale 4 rangées, numéros `--font-display --gold` opacity 0.5, titre clamp(1.75rem→2.75rem), trait hairline qui devient `--gold` au survol, flèche `translateX(6px)`, `data-reveal="fade-up"` stagger.
- [x] **3.5 H5 FeaturedFleetSection** — Migration token complète. Onglets actifs `--gold`, cartes `--night-850`, prix `--font-display --gold`, `btn-key` remplace `btn-gold-sheen`.
- [x] **3.6 H6 WhyChooseUsSection** — Collage asymétrique : photo principale (Tiguan) + superposée (Peugeot 2008) + badge airport gold. 4 cartes fonctionnalités interactives : description s'ouvre à l'activation, icône passe gold fond. Tokens complets.
- [x] **3.7 H7 VideoSection** — Retourne `null` (`HAS_VIDEO = false`) per spec : aucun lecteur vide. Loggé dans `ASSETS-TODO.md`.
- [x] **3.8 H8 HowItWorksSection** — Rebâti : 4 étapes en grille responsive, chiffres `--font-display --gold` opacity 0.45, cartes `--night-850`, `data-reveal="pop"` stagger 90ms.
- [x] **3.9 H9 ReviewsSection** — Rebâti : une grande citation active (`--font-display --fs-h3`), guillemets décoratifs, 5 étoiles, dot indicators animés (width 8→24px), prev/next arrows. Swap citation : opacity 0 → 200ms → opacity 1. Initiales seules (pas de photos de stock). < 3 avis → `null` + invite WhatsApp.
- [x] **3.10 H10 FAQSection** — Rebâti : gauche sticky (label pill gold, H2, lien `btn-secondary`), droite accordéon `grid-template-rows 0fr→1fr`, `ChevronDown` rotate, ouverture tourne `--gold`, JSON-LD FAQPage. Clavier opérable.
- [x] **3.11 H11 FinalCTASection** — Rebâti : `tire-tread-pattern`, rayon gold en haut, tirets piste, `btn-key` + WhatsApp. `data-reveal` stagger.
- [x] **Header** — Migration complète : barre info slide (height 0→36px), skip link focus-visible, `aria-current`, menu mobile `role=dialog aria-modal`, `btn-key` CTA, horizon hairline gold. Zéro `#FF3600`.
- [x] **page.tsx** — `TrustStrip` câblé, `StatsStrip` retiré, ordre sections préservé.
- [x] **ASSETS-TODO.md** — Créé : liste des assets manquants (vidéo, photos, social handles).

**Gates Phase 3:**
- `npx tsc --noEmit` → ✅ 0 erreurs
- `npm run qa:content` → ✅ 0 violations
- `npx impeccable detect src/` → ✅ 0 anti-patterns

---

## Gate 3 Status: PASSED ✅

Commit: `b451a5b` · 15 fichiers, 3 001 insertions, 1 835 suppressions

---

## ⛔ CHECKPOINT D — Attente Approbation Hero + Fleet

Avant de continuer avec la Phase 4 (pages Flotte & Véhicule), veuillez valider :

1. **H1 Hero** — Le cadre inséré (voiture Golf 7 cutout, heure Alger, barre de réservation glass, tirets de piste). Lancez `npm run dev` et regardez `/`.
2. **H2–H11** — Les sections de la home page (trust strip, catégories, services, flotte, pourquoi, FAQ, CTA). Tout est visible, animé au scroll.
3. **H7 Vidéo** — Section masquée car aucune vidéo réelle. Voir `ASSETS-TODO.md` — confirmer si du footage TikTok ou horizontal existe.
4. **Typographie** — Instrument Serif pour les titres, Instrument Sans pour le corps. Lisible ? Ton juste ?
5. **Questions client** — Voir `docs/redesign/CLIENT-QUESTIONS.md` pour les handles réseaux sociaux et photos à confirmer.

_Par défaut : approuver tout et continuer vers Phase 4 (flotte SSR, filtres, page véhicule FLIP). Dites « continuer » pour démarrer._
