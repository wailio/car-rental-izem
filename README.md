# IZEM MOTORS — Location de Voitures Aéroport d'Alger

Site web officiel et plateforme de réservation pour **IZEM MOTORS** (`SARL IZEM TECH`), agence de location de véhicules basée à l'Aéroport International d'Alger Houari Boumédiène (Dar El Beïda).

- **Production :** [https://izem-motors.vercel.app](https://izem-motors.vercel.app)
- **Dépôt GitHub :** [https://github.com/wailio/car-rental-izem](https://github.com/wailio/car-rental-izem)

---

## 📁 Structure du Projet

```text
car-rental-2/
├── aurum-drive/                # Application Next.js 15 (App Router, React 19, TypeScript)
│   ├── public/                 # Assets statiques web (vidéos, logos, photos de flotte)
│   │   ├── images/             # Photos optimisées, emblème IZEM MOTORS, background contact
│   │   └── videos/             # Vidéo hero (herosec-vid.mp4)
│   ├── src/
│   │   ├── app/                # Routes Next.js (/vehicules, /services, /a-propos, /contact, /avis, /admin)
│   │   ├── components/         # Composants UI, navigation, sections d'accueil, modales
│   │   ├── content/            # Données locales (70 vrais avis Google, flotte, faits vérifiés)
│   │   └── lib/                # Configuration du site, supabase, hooks réactifs
│   └── scripts/                # Scripts utilitaires (synchronisation Supabase, QA contenu)
│
├── assets/                     # Fichiers sources et médias organisés
│   ├── admin-audit/            # Captures d'écran et historique d'audit de l'interface admin
│   ├── branding/               # Logos vectoriels transparents, favicon pack, redesign pack
│   ├── car-photos/             # Photos sources des modèles de la flotte
│   └── reviews/                # Fichier source des avis Google (izem-reviews.xlsx)
│
├── docs/redesign/              # Documentation d'ingénierie, spécifications, registre de vérité
└── reference-designs/          # Références UX/UI et briefs créatifs
```

---

## 🛠️ Stack Technique

- **Framework :** Next.js 15 (App Router, Server & Client Components)
- **Langage :** TypeScript (strict)
- **Styling :** Tailwind CSS 3.4 avec design system sur-mesure (palette nuit, accents dorés & teal signature)
- **Animations & Motion :** GSAP 3 (ScrollTrigger), transitions réactives
- **Typographie :** Sora & Instrument Sans / Serif
- **Base de données & Stockage :** Supabase (PostgreSQL + Object Storage)
- **Déploiement :** Vercel CI/CD

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ (Node 20+ recommandé)
- npm ou pnpm

### Installation & Développement
```bash
# Se placer dans le dossier de l'application Next.js
cd aurum-drive

# Installer les dépendances
npm install

# Lancer le serveur de développement local
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Vérifications & Tests (Quality Gates)
```bash
# Vérification des types TypeScript
npx tsc --noEmit

# Vérification du respect strict du contenu en français (zéro texte bidon / anglicismes)
npm run qa:content

# Build de production
npm run build
```

---

## 🚢 Déploiement

Le site est hébergé sur Vercel avec le domaine de production `izem-motors.vercel.app` :

```bash
cd aurum-drive
npx vercel --prod --yes
```

---

## 📞 Informations de Contact & Légal

- **Raison sociale :** SARL IZEM TECH (IZEM MOTORS)
- **Localisation :** Zone d'activité aéroport d'Alger, Dar El Beïda, Alger
- **Téléphones :** +213 549 78 29 99 / +213 782 89 09 93 / +213 774 03 09 43
- **Google Reviews :** [Voir les 70 avis vérifiés sur Google Maps](https://maps.app.goo.gl/9yq1B)
