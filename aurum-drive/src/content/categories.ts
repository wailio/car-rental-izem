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
    description: "Pratiques et sobres pour vos déplacements quotidiens en ville et sur route.",
  },
  {
    id: "compacte",
    name: "Compacte",
    slug: "compacte",
    minAge: 21,
    licenceYears: 1,
    deposit: 40000,
    priceFrom: 12000,
    description: "Le juste équilibre entre maniabilité urbaine, confort et espace à bord.",
  },
  {
    id: "berline",
    name: "Berline",
    slug: "berline",
    minAge: 23,
    licenceYears: 2,
    deposit: 60000,
    priceFrom: 10500,
    description: "Confort supérieur et volume de coffre généreux pour les longues distances.",
  },
  {
    id: "suv",
    name: "SUV",
    slug: "suv",
    minAge: 23,
    licenceYears: 2,
    deposit: 80000,
    priceFrom: 15000,
    description: "Position haute, habitabilité spacieuse et sérénité sur tous vos parcours.",
  },
  {
    id: "premium",
    name: "Premium",
    slug: "premium",
    minAge: 25,
    licenceYears: 3,
    deposit: 150000,
    priceFrom: 22000,
    description: "Finitions soignées et technologies de pointe pour vos rendez-vous importants.",
  },
  {
    id: "utilitaire",
    name: "Utilitaire",
    slug: "utilitaire",
    minAge: 21,
    licenceYears: 2,
    deposit: 50000,
    priceFrom: 17000,
    description: "Capacité de chargement optimisée pour vos transports et matériels volumineux.",
  },
];
