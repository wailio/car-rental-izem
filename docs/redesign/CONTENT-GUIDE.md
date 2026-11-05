# Guide de Contenu — DZ Rent Car

> Ce guide est écrit pour **vous**, propriétaire de l'agence. Pas besoin de connaître le code. Chaque section vous explique exactement dans quel fichier aller et quoi changer.

---

## 📋 Table des matières

1. [Modifier les informations de l'agence (téléphone, adresse, email)](#1-informations-de-lagence)
2. [Ajouter ou modifier un véhicule](#2-ajouter-ou-modifier-un-vehicule)
3. [Changer les prix](#3-changer-les-prix)
4. [Retirer un véhicule temporairement](#4-retirer-un-vehicule-temporairement)
5. [Modifier les questions fréquentes (FAQ)](#5-modifier-la-faq)
6. [Ajouter un avis client](#6-ajouter-un-avis-client)
7. [Changer les photos](#7-changer-les-photos)
8. [Éléments à confirmer (TODO:CLIENT)](#8-elements-a-confirmer)
9. [Règle d'or — ce qu'il ne faut pas inventer](#9-regle-dor)

---

## 1. Informations de l'agence

**Fichier :** `aurum-drive/src/lib/config.ts`

C'est ici que se trouvent le numéro de téléphone, le numéro WhatsApp, l'adresse e-mail et l'adresse physique. Ces valeurs s'affichent partout sur le site (header, footer, contact, fiches véhicule).

```ts
export const BRAND = {
  name: "DZ Rent Car",
  phone: "0555 33 33 16",          // ← Changer ici
  whatsapp: "213555333316",         // ← Format international sans + ni espaces
  email: "contact@dzrentcar.dz",   // ← Changer ici
  address: "Aéroport d'Alger Houari Boumediene", // ← Changer ici
  // ...
};
```

> ⚠️ Le numéro WhatsApp (`213555333316`) doit être au format international sans `+` ni espaces. Ex : `213 0555 33 33 16` → enlever l'espace et le 0 → `213555333316`.

---

## 2. Ajouter ou modifier un véhicule

**Fichier :** `aurum-drive/src/content/fleet.ts`

Chaque véhicule est un objet dans le tableau `fleet`. Voici la structure complète :

```ts
{
  id: 18,                          // Numéro unique (prendre le suivant)
  slug: "renault-megane",          // URL de la fiche (/vehicules/renault-megane)
  name: "Renault Mégane",          // Nom affiché sur le site
  brand: "Renault",                // Marque
  categoryId: "berline",           // Catégorie (voir liste ci-dessous)
  images: ["/cars/renault-megane.jpg"], // Photo (voir section 7)
  specs: {
    seats: 5,                      // Nombre de places
    gearbox: "Manuelle",           // "Automatique" ou "Manuelle"
    fuel: "Diesel",                // "Essence", "Diesel" ou "Hybride"
    doors: 5,
    ac: true,                      // Climatisation
    wifi: false,                   // Hotspot Wi-Fi
  },
  features: [                      // Équipements (liste libre)
    "Régulateur de vitesse",
    "Bluetooth",
  ],
  pricePerDay: 18000,              // Prix en DA par jour
  pricePerWeek: 110000,            // Prix en DA par semaine (optionnel)
  pricePerMonth: 380000,           // Prix en DA par mois (optionnel)
  available: true,                 // true = disponible, false = retiré
  description: "...",              // Texte de description (2-3 phrases)
  power: "90 ch",                  // Puissance (optionnel)
  zeroToHundred: "12 s",          // 0-100 km/h (optionnel)
  fuel_consumption: "5,5 L/100",  // Consommation (optionnel)
  bootVolume: "380 L",            // Coffre (optionnel)
}
```

### Catégories disponibles

| `categoryId` | Nom affiché |
|---|---|
| `citadine` | Citadines |
| `berline` | Berlines |
| `suv` | SUV & 4×4 |
| `premium` | Premium |
| `utilitaire` | Utilitaires |

Pour ajouter une nouvelle catégorie, modifier également `aurum-drive/src/content/categories.ts`.

---

## 3. Changer les prix

**Fichier :** `aurum-drive/src/content/fleet.ts`

Pour chaque véhicule, chercher `pricePerDay` et modifier la valeur en **dinars algériens (DA)** :

```ts
pricePerDay: 25000,    // 25 000 DA par jour
pricePerWeek: 150000,  // 150 000 DA par semaine
pricePerMonth: 500000, // 500 000 DA par mois
```

Le site affiche les prix en DA avec la virgule comme séparateur des milliers (ex : `25 000 DA`). Aucun autre fichier à modifier.

---

## 4. Retirer un véhicule temporairement

**Fichier :** `aurum-drive/src/content/fleet.ts`

Pour masquer un véhicule sans le supprimer (panne, entretien) :

```ts
available: false,  // ← Passer de true à false
```

Le véhicule n'apparaîtra plus dans la liste. Pour le remettre, repasser à `true`.

Pour supprimer définitivement : supprimer l'objet entier du tableau `fleet`.

---

## 5. Modifier la FAQ

**Fichier :** `aurum-drive/src/content/faq.ts`

Chaque question/réponse est un objet :

```ts
{
  id: "new-question",            // Identifiant unique (sans espaces, sans accents)
  question: "Votre question ?",
  answer: "Votre réponse complète.",
  theme: "reservation",          // Thème (voir liste)
}
```

### Thèmes disponibles

| `theme` | Affiché sous |
|---|---|
| `reservation` | Réservation |
| `vehicule` | Véhicule |
| `tarif` | Tarifs |
| `livraison` | Livraison |
| `assurance` | Assurance |
| `paiement` | Paiement |

---

## 6. Ajouter un avis client

**Fichier :** `aurum-drive/src/content/site-facts.ts` → section `reviews` dans `aurum-drive/src/lib/data.ts`

> ⚠️ **Règle absolue** : n'ajouter que de vrais avis de vrais clients. Aucun avis inventé.

**Fichier :** `aurum-drive/src/lib/data.ts` — chercher le tableau `reviews` :

```ts
{
  id: "nouvel-id",              // Identifiant unique
  author: "Prénom N.",          // Prénom + initiale du nom (respecter la vie privée)
  vehicle: "Volkswagen Tiguan", // Véhicule loué (optionnel)
  rating: 5,                    // Note de 1 à 5
  text: "Texte de l'avis...",   // Avis exact du client
  date: "Oct. 2026",            // Mois et année
}
```

---

## 7. Changer les photos

### Photo de la page d'accueil (hero)
**Fichier :** `aurum-drive/public/images/hero-fleet-algiers.jpg`

Remplacer ce fichier par une nouvelle photo. Conserver le même nom de fichier.

Dimensions recommandées : **1920 × 1080 px minimum**, format JPG ou WebP.

### Photos des véhicules
**Dossier :** `aurum-drive/public/cars/`

Format du nom de fichier : `nom-du-vehicule.jpg` (en minuscules, tirets, sans espaces).

Dans `fleet.ts`, la propriété `images` accepte plusieurs photos :

```ts
images: [
  "/cars/volkswagen-tiguan.jpg",     // Photo principale
  "/cars/volkswagen-tiguan-2.jpg",   // Vue intérieure (optionnel)
  "/cars/volkswagen-tiguan-3.jpg",   // Vue arrière (optionnel)
],
```

Dimensions recommandées : **1200 × 800 px minimum**, fond neutre de préférence.

---

## 8. Éléments à confirmer

Ces informations sont marquées `TODO:CLIENT` dans le code. Elles s'affichent actuellement avec une formulation neutre — à remplacer par vos données réelles.

| Information | Statut actuel | Fichier à modifier |
|---|---|---|
| Adresse physique de l'agence | Aéroport d'Alger (approximatif) | `src/lib/config.ts` → `address` |
| Numéro de téléphone principal | `0555 33 33 16` (à confirmer) | `src/lib/config.ts` → `phone` |
| Adresse e-mail | `contact@dzrentcar.dz` (à confirmer) | `src/lib/config.ts` → `email` |
| Nombre de clients servis | Masqué (chiffres contradictoires) | `src/content/site-facts.ts` → `customersServed` |
| Années d'activité | Masqué (non confirmé) | `src/content/site-facts.ts` → `yearsActive` |
| Délai de réponse | "sous 24h" (formulation prudente) | `src/content/faq.ts` |

Pour rendre un fait visible, le passer à `status: 'verified'` dans `site-facts.ts`.

---

## 9. Règle d'or

> **Ne jamais inventer de faits.**

Le site est conçu pour n'afficher que ce qui est vrai. Si une information n'est pas confirmée, elle reste masquée plutôt que d'afficher un chiffre inventé.

Cela protège votre agence :  
- Pas de fausse promesse sur les délais  
- Pas de faux avis clients  
- Pas de nombre de clients gonflé  

Quand vous êtes prêt à confirmer un fait, modifier le `status` dans `site-facts.ts` :
```ts
yearsActive: {
  value: 7,                  // ← Votre vraie valeur
  status: 'verified',        // ← Passer de 'from-site' à 'verified'
  source: 'Registre du commerce',
}
```

---

*Guide rédigé lors du redesign — Octobre 2026. Branche `redesign/alive`.*
