# 03. Brand and Content

Words are a third of why a site feels "AI-made". This file gives you the brand truth, the voice, a facts register so you never invent anything, a ready French copy deck, and microcopy.

---

## 1. Brand truth (what the company actually says about itself)

**Source:** the company's own TikTok captions (`@dz.rent.car`), read through public search snippets on 12 October 2026. The TikTok page itself blocks automated access, so **ask for the client's best 10 videos** (see section 8).

What the captions say, in the company's words (paraphrased here):
- A **professional car-rental company in Algeria**.
- **Recent vehicles**, **automatic and manual**, **petrol or diesel**.
- **Easy, fast and reliable** rental. **Competitive prices.** **Always available** and at your service.
- **Free delivery and return at the airport.**
- **Roadside assistance 24 hours a day, 7 days a week.**
- **Full-risk insurance.**
- Hashtags point to arrivals at the **airport**, **Alger**, and visitors coming from **France**.

What it does **not** say anywhere in those captions: luxury, prestige, VIP, chauffeur, weddings, embassies, Swiss rigour, dealership-only maintenance, 15,000 customers. Those came from the generated site, not from the company.

**Market context:** many Algerian rental accounts on TikTok promise "free airport delivery" and low daily prices (some quote euros per day). The company will not win by shouting more luxury. It wins by being **clearer, calmer, more trustworthy and better crafted** than everyone else in a crowded scroll.

**Likely audience (assumption, confirm):** people arriving at Houari Boumediene Airport (Algerians living abroad, visitors, business travellers) who want the car ready the moment they land; locals who want a clean recent car without hassle.

---

## 2. Positioning

> **DZ Rent Car puts a recent, insured car in your hands the moment you land, with nothing to figure out.**

**What "luxury" means for this brand:** the **luxury of ease**. Time saved, no surprises, polite and punctual, a clean car, a clear price, someone who answers at 2 a.m. It is expressed through **space, calm, craft and clarity**, not through gold-plated claims. The dark and gold look supports it (a night arrival with warm light), the copy never needs to say "prestige".

**Fleet reality:** mainstream recent models (compact crossovers, SUVs, a small sedan). Present them as **well-prepared, recent and fairly priced**, shot beautifully. Never imply they are something else.

---

## 3. Voice

**Calm. Warm. Precise. Local. Confident.** Like a good concierge who never over-explains and never oversells.

| Do | Don't |
|---|---|
| "Votre voiture vous attend à l'aéroport." | "Une expérience de mobilité d'exception." |
| "Livraison et retour gratuits à l'aéroport." | "Un service de conciergerie automobile sur mesure." |
| "Aucune carte bancaire, aucun paiement en ligne." | "Un parcours simplifié sans friction financière." |
| "On vous répond sous 24 h, souvent bien avant." (only if true) | "Confirmation express" with no basis |
| Short sentences. Concrete nouns. Real numbers. | Triple adjectives, hype, rhetorical contrasts ("pas seulement X mais Y") |
| "Vous". Active verbs. Sentence case. | ALL CAPS paragraphs, exclamation marks, em-dash chains |

**Language:** French throughout (Algerian French usage, plain). Keep the structure ready for Arabic (RTL) and English later. A single warm Arabic touch such as "مرحبا" near the hero is allowed **only if the client agrees** (log in `CLIENT-QUESTIONS.md`).

### Banned words and phrases (the content QA script fails on these)

`d'exception`, `exception` (as praise), `excellence`, `prestige`, `prestigieux`, `VIP`, `luxueux`, `luxe` (in claims), `sur mesure`, `sans compromis`, `rigueur`, `élite`, `haut de gamme`, `palace`, `raffinement`, `incarne`, `art du voyage`, `expérience unique`, `révolutionnaire`, `comblés`, `parcours sans friction`, `chauffeur d'élite`, `tenue d'apparat`, `Lorem`, plus the English leftovers listed in `02` F-06 and the template names in F-09.

(You may use "premium" only for a real category called Premium. "Luxe" may appear only as the visual theme in comments, never in copy.)

### Style rules
- One idea per sentence. Maximum about 18 words per sentence in UI text.
- Numbers as digits: "3 minutes", "24h/24, 7j/7", "30 000 DA / jour".
- The flow is a **request** ("demande"), not an instant booking. Say "Envoyer ma demande", "Votre demande de réservation". Keep the vocabulary identical across the whole journey.
- Never claim a speed, a number, a coverage detail or a service unless the register in section 5 says `verified`.

---

## 4. Visual brand notes

- **Name:** "DZ Rent Car". Wordmark in the display type, with a simple **DZ monogram** made from two lane-line strokes (draw it as SVG). Favicon from the monogram. No fake logo mark.
- **Colour:** dark night base with warm gold light (see `04`). Algeria is expressed with **restraint**: a muted emerald only as the "disponible / confirmé" status colour and a muted red only for errors. No flag stripes, no clichés.
- **Photography must show the real cars**, in good light (see `04` section 9). If TikTok footage exists, reuse it (with the client's permission) for the hero loop and the video section.

---

## 5. Facts register (single source of truth)

Create `src/content/site-facts.ts`. Every claim in the UI reads from it. **A claim renders only if its status is `verified`.** In development, unverified facts render with a visible badge `À confirmer` so the person can see what to ask the client.

```ts
export type FactStatus = 'verified' | 'from-site' | 'conflict' | 'unknown';
export interface Fact<T> { value: T | null; status: FactStatus; source?: string; note?: string }

export const facts = {
  name: { value: 'DZ Rent Car', status: 'verified', source: 'TikTok @dz.rent.car' },
  airportDelivery: { value: 'Livraison et retour gratuits à l\'aéroport', status: 'verified', source: 'TikTok caption' },
  assistance247: { value: 'Assistance routière 24h/24, 7j/7', status: 'verified', source: 'TikTok caption' },
  insurance: { value: 'Assurance tous risques', status: 'verified', source: 'TikTok caption' },
  recentCars: { value: 'Véhicules récents, automatiques ou manuels, essence ou diesel', status: 'verified', source: 'TikTok caption' },
  // ...see the table below
} satisfies Record<string, Fact<unknown>>;
```

| Fact | Current value on the site | Status | Action |
|---|---|---|---|
| Company name | DZ Rent Car | verified | use |
| Free airport delivery and return | not clearly stated | **verified** (TikTok) | **make it the hero promise** |
| 24/7 roadside assistance | "Assistance 24/7" | **verified** (TikTok) | use |
| Full-risk insurance | not clearly stated | **verified** (TikTok) | use; ask for coverage and excess details |
| Recent cars, auto and manual, petrol and diesel | partly | **verified** (TikTok) | use |
| "Easy, fast, reliable", competitive prices | partly | **verified** (TikTok) | use, no superlatives |
| Phone `0555 33 33 16` and WhatsApp `213555333316` | on site | from-site | confirm |
| Email `contact@dzrentcar.dz`, domain `dzrentcar.dz` | on site | from-site | confirm |
| Address, opening hours | "Alger, Algérie" | unknown | ask |
| Number of vehicles (17) | on site | from-site | confirm |
| Customers served (15K+, 10K+, 1200+) | conflicting | **conflict** | ask, show none until known |
| Years of experience (5) | on site | from-site | confirm |
| Number of agencies (1 or 2) | conflicting | **conflict** | ask |
| Response time (15 min or 24 h) | conflicting | **conflict** | ask; default to "sous 24 h" |
| Prices per day, week, month, deposits, age and licence per category | on site | from-site | confirm each |
| Chauffeur service, weddings, long-term leasing, corporate, embassies | on site | **unknown** | hide until confirmed |
| Airport name-board, flight tracking, 2-hour replacement | on site | **unknown** | hide until confirmed |
| Other airports or wilayas, delivery fees | not stated | unknown | ask |
| Payment methods, fuel policy, mileage, second driver, child seat, international licence, cancellation, excess | not stated | unknown | ask; FAQ shows only what is confirmed |
| Instagram, Facebook handles | guessed | unknown | ask; TikTok is verified |

---

## 6. French copy deck (home page, ready to use)

`VERIFY` marks text that depends on a fact not yet confirmed. Keep the wording and swap the value from the register.

### Top bar
"Réponse écrite sous {RESPONSE_TIME}. Aucun paiement en ligne." · "WhatsApp" · "0555 33 33 16" (`VERIFY`)

### Hero
- **Label:** "Alger · Livraison à l'aéroport"
- **H1 (recommended):** "Atterrissez. Votre voiture vous attend."
  Alternatives to test in the lab: "Votre voiture vous attend à l'aéroport." · "Les clés, dès l'arrivée." · "Louer en Algérie, sans y penser." · "De l'aéroport à la route, en douceur."
- **Sub:** "Voitures récentes, automatiques ou manuelles. Livraison et retour gratuits à l'aéroport, assistance 24h/24, assurance tous risques."
- **Buttons:** "Voir les voitures disponibles" (primary) · "Écrire sur WhatsApp" (secondary)
- **Booking bar labels:** "Prise en charge" · "Retour" · "Départ" · "Retour" (date and time) · "Voir les voitures"
- **Live chip:** "Alger · {HH:MM}" (real local time, `Africa/Algiers`)
- Remove "Avec chauffeur" until chauffeur service is confirmed.

### Trust strip (replaces the fake statistics; five verified claims)
1. "Livraison et retour gratuits à l'aéroport"
2. "Assistance routière 24h/24, 7j/7"
3. "Assurance tous risques"
4. "Voitures récentes, automatiques ou manuelles"
5. "Tarifs clairs, caution restituée au retour" (`VERIFY`)

### Choisissez votre catégorie
- **H2:** "Choisissez votre catégorie"
- **Sub:** "De la citadine au SUV. Pour chaque catégorie, l'âge minimum, l'ancienneté du permis et la caution sont indiqués avant de réserver."
- Per category: name, "À partir de {prix} DA / jour", "{âge} ans minimum", "Permis depuis {n} an(s)", caution (`VERIFY` all values).

### Nos prestations (only verified items; keep the structure of 4 rows)
1. **Livraison et retour à l'aéroport**: "On vous remet les clés à l'arrivée et on récupère la voiture au départ. Gratuit." (verified)
2. **Location à la journée, à la semaine, au mois**: "Des tarifs dégressifs selon la durée." (`VERIFY`)
3. **Assistance routière 24h/24, 7j/7**: "Un souci sur la route ? Un numéro, une réponse." (verified)
4. **Location avec chauffeur et événements**: **hidden until confirmed** (`VERIFY`). If hidden, use three rows.
- **CTA:** "Voir tous les services"

### La flotte
- **H2:** "La flotte"
- **Sub:** "Des voitures récentes, nettoyées et vérifiées avant chaque départ." (`VERIFY` the checking claim)
- Card: name, 3 chips (places, boîte, carburant), "{prix} DA / jour", "Voir" and "Réserver".
- **Link:** "Voir les {n} véhicules"

### Pourquoi DZ Rent Car (four reasons, all verified)
- **H2:** "Louer simplement, rouler tranquille"
- "Livraison gratuite à l'aéroport": "Les clés à l'arrivée, la voiture récupérée au départ."
- "Assistance 24h/24, 7j/7": "En cas de panne ou de question, vous avez toujours quelqu'un."
- "Assurance tous risques": "Vous roulez couvert." (`VERIFY` what is covered; add a link to conditions)
- "Voitures récentes": "Automatiques ou manuelles, essence ou diesel, toutes en bon état."

### Vidéo
- **Label:** "En route"
- **H2:** "Voyez comment ça se passe"
- **Button:** "Voir la vidéo"
(Content depends on real footage; see `06`.)

### Comment réserver (a true sequence, so numbering is fine)
- **H2:** "Comment réserver"
- 01 **Choisissez votre voiture**: "Sélectionnez vos dates et le lieu de livraison."
- 02 **Envoyez votre demande**: "3 minutes. Aucune carte bancaire, aucun paiement en ligne."
- 03 **On vous répond**: "Confirmation écrite sous {RESPONSE_TIME}, puis un appel pour caler l'heure."
- 04 **Prenez la route**: "Remise des clés à l'aéroport ou en agence. Caution réglée sur place, restituée au retour."

### Témoignages
Only with **real, permitted** reviews (Google, Facebook, WhatsApp screenshots, TikTok comments).
- **H2:** "Ce que disent nos clients"
- **Fallback if fewer than 3 real reviews:** hide the section and invite reviews in the footer: "Vous avez roulé avec nous ? Laissez un avis sur WhatsApp."

### FAQ
- **H2:** "Tout ce qu'il faut savoir avant de prendre la route"
- **Button:** "Toutes les questions"
Draft answers (`VERIFY` every one before publishing; if not confirmed, show the question with "Écrivez-nous sur WhatsApp" as the answer):
1. **Quels documents faut-il ?** "Une pièce d'identité valide et votre permis de conduire en cours de validité. La caution est réglée à la remise des clés."
2. **Puis-je réserver pour un mariage ou un événement ?** "Écrivez-nous sur WhatsApp avec la date et le lieu, nous vous répondons avec les voitures disponibles."
3. **À la journée, à la semaine, au mois ?** "Oui. Plus la durée est longue, plus le tarif par jour baisse."
4. **Que se passe-t-il en cas de panne ?** "L'assistance routière est joignable 24h/24, 7j/7. Appelez le {numéro} et dites-nous où vous êtes."
5. **Comment modifier ou prolonger ma réservation ?** "Prévenez-nous le plus tôt possible par WhatsApp ou par téléphone. La prolongation dépend de la disponibilité de la voiture."
6. **La livraison à l'aéroport est-elle vraiment gratuite ?** "Oui, la livraison et le retour à l'aéroport sont gratuits." (verified; add the airport list when known)
7. **Quel âge minimum et quelle ancienneté de permis ?** "Cela dépend de la catégorie. Les conditions sont affichées sur chaque voiture."
8. **Y a-t-il un paiement en ligne ?** "Non. Aucun paiement n'est demandé en ligne."
- **Three features under the FAQ (rewritten):** "Voitures récentes" · "Réservation flexible" · "Réponse humaine, 7j/7" (`VERIFY` the last)

### CTA band
- **H2:** "Prêt à prendre la route ?"
- **Sub:** "Choisissez votre voiture, envoyez votre demande, on s'occupe du reste."
- **Buttons:** "Voir les voitures" · "WhatsApp"

### Footer
- **Line:** "Location de voitures en Algérie. Livraison et retour gratuits à l'aéroport."
- **Columns:** Liens rapides · Services · Contact · Suivez-nous (TikTok first)
- **Legal:** Confidentialité · Conditions générales · Mentions légales

---

## 7. Microcopy library

| Moment | Text |
|---|---|
| Primary CTA on vehicle | "Réserver cette voiture" |
| Send button, step 3 | "Envoyer ma demande" |
| Sending | "Envoi en cours…" |
| Success title | "Demande envoyée" |
| Success body | "Référence {REF}. Vous recevez une réponse écrite sous {RESPONSE_TIME}. On vous appelle pour caler l'heure de remise." |
| Required field error | "Ce champ est obligatoire." |
| Phone error | "Entrez un numéro algérien valide, par exemple 0555 12 34 56." |
| E-mail error | "Entrez une adresse e-mail valide, par exemple nom@exemple.dz." |
| Age not eligible | "Cette catégorie demande {n} ans minimum. Voici les voitures que vous pouvez réserver." |
| Licence not eligible | "Cette catégorie demande {n} an(s) de permis. Voici les voitures que vous pouvez réserver." |
| Return before pickup | "Le retour doit être après le départ." |
| Past date | "Choisissez une date à venir." |
| Empty fleet | "Aucune voiture disponible pour ces dates. Essayez d'autres dates ou écrivez-nous sur WhatsApp." |
| Network error | "La connexion a échoué. Vos informations sont conservées, réessayez." |
| Loading | skeletons only, never the word "Chargement" |
| 404 | "Cette page a pris la route. Revenez à l'accueil." |
| WhatsApp prefill (vehicle) | `Bonjour, je souhaite réserver la {voiture} du {départ} au {retour}. Livraison à l'aéroport ?` |
| WhatsApp prefill (general) | `Bonjour, je voudrais louer une voiture à Alger.` |

Helper: `whatsappLink({ car?, from?, to? })` builds `https://wa.me/213555333316?text=...` (URL-encoded) and is the only place WhatsApp links are created.

---

## 8. Questions to send to the client (batch them in `CLIENT-QUESTIONS.md`)

1. Logo files, any brand colours or fonts already in use.
2. Real address(es), opening hours, confirmed phone, WhatsApp, e-mail, domain.
3. Confirmed social handles (TikTok, Instagram, Facebook, others).
4. The full fleet list: model, year, gearbox, fuel, seats, category, price per day, week and month, deposit, and **at least 4 real photos each** (front three-quarter, side, rear three-quarter, interior; more is better).
5. Conditions: minimum age and licence seniority per category, payment methods, fuel policy, mileage limit, second driver, child seat, travel between wilayas, foreign licences, cancellation, late return, insurance coverage and excess.
6. Airport delivery: which airports, which hours, how the handover works, how long delivery takes, delivery elsewhere and its fee.
7. The real response time (15 minutes, 24 hours, other).
8. Which services are really offered (chauffeur, weddings, long-term, corporate).
9. Real numbers: customers served, years active, number of agencies.
10. Real reviews with permission, and the Google Business Profile link if it exists.
11. **Their 10 best TikTok videos** (original files) and permission to reuse them, plus raw footage of a handover at the airport.
12. Languages wanted (French only, plus Arabic and English?).
13. Prices in DA only, or also an approximate euro display for visitors?
14. Company registration details for the legal pages.

---

## 9. SEO (honest, specific)

- **Per-page title (at most 60 characters) and description (at most 155)**, unique, French, no luxury keywords.
- **Home title:** "DZ Rent Car | Location de voiture à Alger, livraison aéroport"
- **Home description:** "Voitures récentes, livraison et retour gratuits à l'aéroport d'Alger, assistance 24h/24, assurance tous risques. Demande en 3 minutes, sans paiement."
- **Natural phrases to use in content** (never stuffed): location voiture aéroport Alger, location voiture Alger livraison aéroport, location voiture automatique Alger, louer une voiture en Algérie.
- Remove `meta keywords` with luxury brands. Fix `og:url` to the real domain, add a real OG image per page.
- **JSON-LD:** `AutoRental` or `LocalBusiness` (name, phone, address when known, opening hours when known, `sameAs` with verified social links), `FAQPage` (confirmed answers only), `BreadcrumbList`, `Product` for each vehicle (offers in DZD).
- `lang="fr"` on `<html>`, `hreflang` when other languages exist, sitemap, robots, canonical.
