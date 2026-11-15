// ─── IZEM MOTORS · Categories Register ──────────────────────────────────────────
// Governed by docs/redesign/03-BRAND-AND-CONTENT.md & 06-PAGE-SPECS.md
// Clean French copy, no banned luxury clichés.

export interface Category {
  id: string;
  name: string;
  slug: string;
  minAge: number;
  licenceYears: number;
  deposit: number; // DA
  priceFrom: number; // DA/jour
  description: string;
}

export const categories: Category[] = [
  {
    id: "economique",
    name: "Économique",
    slug: "economique",
    minAge: 21,
    licenceYears: 1,
    deposit: 30000,
    priceFrom: 8500,
    description: "Crossover citadin surélevé, sobre et agile pour manœuvrer facilement dans Alger.",
  },
  {
    id: "berline",
    name: "Berline",
    slug: "berline",
    minAge: 23,
    licenceYears: 2,
    deposit: 60000,
    priceFrom: 10500,
    description: "Grand coffre de 512 L et confort soigné pour les familles et longs trajets autoroutiers.",
  },
  {
    id: "compacte",
    name: "Compacte",
    slug: "compacte",
    minAge: 21,
    licenceYears: 1,
    deposit: 40000,
    priceFrom: 12000,
    description: "Conduite fluide, format polyvalent et connectivité moderne pour vos déplacements pro.",
  },
  {
    id: "suv",
    name: "SUV",
    slug: "suv",
    minAge: 23,
    licenceYears: 2,
    deposit: 80000,
    priceFrom: 15000,
    description: "Moteur 174 ch, caméra 360° et toit panoramique pour voyager avec sérénité.",
  },
  {
    id: "utilitaire",
    name: "Crossover",
    slug: "crossover",
    minAge: 21,
    licenceYears: 2,
    deposit: 50000,
    priceFrom: 17000,
    description: "Position haute, modularité allemande et sécurité optimale sur tous les axes routiers.",
  },
  {
    id: "premium",
    name: "Premium",
    slug: "premium",
    minAge: 25,
    licenceYears: 3,
    deposit: 150000,
    priceFrom: 22000,
    description: "Boîte S-Tronic, finitions soignées et technologies de pointe pour vos rendez-vous.",
  },
];
