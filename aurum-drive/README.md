# DZ Rent Car — Site web

Site de location de voitures basé à Alger, avec livraison à l'Aéroport Houari Boumediene.  
Branche de redesign : `redesign/alive` · Concept : **Arrivée. Calme. Vivant.**

---

## Prérequis

- **Node.js** 20 ou supérieur
- **npm** 10 ou supérieur (inclus avec Node.js)

Vérification :
```bash
node -v   # doit afficher v20.x ou plus
npm -v    # doit afficher 10.x ou plus
```

---

## Installation

```bash
cd aurum-drive
npm install
```

---

## Développement local

```bash
npm run dev
```

Ouvrir **http://localhost:3000** dans le navigateur.  
Les modifications de fichiers sont rechargées automatiquement.

---

## Build de production

```bash
npm run build
npm run start
```

Le build vérifie les types TypeScript et génère les pages statiques.  
17 routes au total : 14 statiques, 3 dynamiques.

---

## Vérifications qualité (gates)

À lancer avant chaque commit :

```bash
# 1. Vérification TypeScript
npx tsc --noEmit

# 2. Vérification du contenu (0 anglais, 0 inventions, 0 mots interdits)
npm run qa:content

# 3. Audit de design (anti-patterns UI)
npx impeccable detect src/
```

Les trois doivent passer à zéro erreur avant tout merge.

---

## Structure du projet

```
aurum-drive/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx            # Accueil
│   │   ├── vehicules/          # Flotte + fiche véhicule
│   │   ├── reserver/           # Formulaire 3 étapes + confirmation
│   │   ├── services/           # Page prestations
│   │   ├── a-propos/           # Page à propos
│   │   ├── faq/                # FAQ avec recherche
│   │   ├── contact/            # Contact + formulaire
│   │   ├── avis/               # Avis clients
│   │   └── not-found.tsx       # Page 404
│   ├── components/             # Composants réutilisables
│   │   ├── home/               # Sections de la page d'accueil
│   │   ├── navigation/         # Header, Footer, MobileActionBar
│   │   ├── common/             # ScrollToTop, SkipLink
│   │   ├── cursor/             # CursorRing (desktop uniquement)
│   │   └── motion/             # Reveal, Cursor, Magnetic, Odometer
│   ├── content/                # ⭐ FICHIERS DE CONTENU — modifier ici
│   │   ├── site-facts.ts       # Faits vérifiés de l'agence
│   │   ├── fleet.ts            # Véhicules de la flotte
│   │   ├── categories.ts       # Catégories de véhicules
│   │   └── faq.ts              # Questions fréquentes
│   └── lib/
│       ├── config.ts           # Numéros de téléphone, WhatsApp, adresse
│       ├── data.ts             # Pont vers les fichiers de contenu
│       └── motion-tokens.ts    # Constantes d'animation GSAP
├── public/
│   └── images/                 # Photos (hero, véhicules)
│       └── hero-fleet-algiers.jpg
└── docs/redesign/              # Documentation du redesign
```

---

## Modifier le contenu

> **Important :** ne jamais modifier les fichiers de pages directement pour changer les données métier. Utiliser uniquement les fichiers dans `src/content/`.

### Voir le guide complet → [`docs/redesign/CONTENT-GUIDE.md`](docs/redesign/CONTENT-GUIDE.md)

---

## Variables d'environnement

Aucune variable d'environnement n'est requise pour le développement local.

Pour la production, créer un fichier `.env.local` si un backend de réservation est connecté :

```env
# Endpoint de réservation (optionnel — le mode WhatsApp fonctionne sans backend)
NEXT_PUBLIC_BOOKING_ENDPOINT=https://api.dzrentcar.dz/reservations
```

---

## Déploiement

### Vercel (recommandé)
```bash
npx vercel --prod
```

### Hébergement classique (VPS / cPanel)
```bash
npm run build
# Copier le dossier .next/, public/, package.json, next.config.ts sur le serveur
# Lancer : npm run start
```

---

## Règles pour ajouter une nouvelle section

1. **Tokens uniquement** — utiliser `var(--gold)`, `var(--ivory)`, `var(--night-850)`, etc. Jamais de couleur hexadécimale directe.
2. **Composant `"use client"`** si la section a des interactions (useState, onMouseEnter, GSAP).
3. **`data-reveal="fade-up"`** sur les éléments à animer à l'entrée.
4. **Contenu depuis `src/content/`** — jamais de texte codé en dur dans les composants.
5. **Lancer les 3 gates** avant tout commit.

---

## Branche de travail

```
redesign/alive   ← branche active
pre-redesign     ← tag du site original (avant tout changement)
```

Pour comparer avant/après :
```bash
git diff pre-redesign HEAD --stat
```

---

## Contact technique

Questions sur l'architecture ou le système de tokens → voir [`docs/redesign/DECISIONS.md`](docs/redesign/DECISIONS.md).
