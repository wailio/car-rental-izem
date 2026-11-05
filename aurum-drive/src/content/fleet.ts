// ─── IZEM MOTORS · Fleet Register ──────────────────────────────────────────────
// Governed by docs/redesign/03-BRAND-AND-CONTENT.md & 06-PAGE-SPECS.md
// Truthful fleet data. Clean French copy, no fake ratings, no banned buzzwords.

export interface Vehicle {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  images: string[];
  specs: {
    seats: number;
    gearbox: "Automatique" | "Manuelle";
    fuel: "Essence" | "Diesel" | "Hybride";
    doors: number;
    ac: boolean;
    wifi: boolean;
  };
  features: string[];
  pricePerDay: number;   // DA
  pricePerWeek?: number; // DA
  pricePerMonth?: number;// DA
  available: boolean;
  description: string;
  power?: string;
  zeroToHundred?: string;
  fuel_consumption?: string;
  bootVolume?: string;
}

export const fleet: Vehicle[] = [
  {
    id: 1,
    slug: "audi-a3-sportback",
    name: "Audi A3 Sportback",
    brand: "Audi",
    categoryId: "premium",
    images: ["/cars/audi-a3-sportback.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 5, ac: true, wifi: false },
    features: ["Boîte automatique S-Tronic", "Cockpit digital", "Phares LED", "Aide au stationnement"],
    pricePerDay: 22000,
    pricePerWeek: 130000,
    pricePerMonth: 450000,
    available: true,
    description: "Berline compacte moderne alliant dynamisme, précision de conduite et confort technologique pour tous vos trajets en Algérie.",
    power: "150 ch",
    zeroToHundred: "8,4 s",
    fuel_consumption: "6,2 L/100 km",
    bootVolume: "380 L",
  },
  {
    id: 2,
    slug: "mg-7",
    name: "MG 7",
    brand: "MG",
    categoryId: "premium",
    images: ["/cars/mg-7.png"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 4, ac: true, wifi: false },
    features: ["Aileron arrière actif électrique", "Double écran panoramique", "Sonorisation Bose", "Sièges ergonomiques sport"],
    pricePerDay: 26000,
    pricePerWeek: 155000,
    pricePerMonth: 520000,
    available: true,
    description: "Berline fastback sportive aux lignes affirmées et aux performances de premier ordre, idéale pour vos déplacements d'affaires et réceptions.",
    power: "261 ch",
    zeroToHundred: "6,5 s",
    fuel_consumption: "6,9 L/100 km",
    bootVolume: "375 L",
  },
  {
    id: 3,
    slug: "volkswagen-t-cross",
    name: "Volkswagen T-Cross",
    brand: "Volkswagen",
    categoryId: "suv",
    images: ["/cars/volkswagen-t-cross.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 5, ac: true, wifi: false },
    features: ["Banquette arrière coulissante", "Front Assist", "Aide au stationnement Park Pilot", "Climatisation Climatronic"],
    pricePerDay: 17000,
    pricePerWeek: 100000,
    pricePerMonth: 350000,
    available: true,
    description: "SUV urbain robuste, modulable et sécurisant, parfait pour rouler en toute sérénité sur les grands axes autoroutiers comme au centre d'Alger.",
    power: "110 ch",
    zeroToHundred: "10,2 s",
    fuel_consumption: "6,1 L/100 km",
    bootVolume: "455 L",
  },
  {
    id: 4,
    slug: "geely-coolray",
    name: "Geely Coolray",
    brand: "Geely",
    categoryId: "suv",
    images: ["/cars/geely-coolray.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 5, ac: true, wifi: false },
    features: ["Toit ouvrant panoramique", "Caméra 360 degrés", "Écran tactile HD", "Régulateur de vitesse adaptatif"],
    pricePerDay: 15000,
    pricePerWeek: 90000,
    pricePerMonth: 310000,
    available: true,
    description: "Crossover compact au style sportif et contemporain, très apprécié pour sa souplesse mécanique et ses équipements modernes.",
    power: "174 ch",
    zeroToHundred: "7,9 s",
    fuel_consumption: "6,6 L/100 km",
    bootVolume: "330 L",
  },
  {
    id: 5,
    slug: "kia-sonet",
    name: "Kia Sonet",
    brand: "Kia",
    categoryId: "compacte",
    images: ["/cars/kia-sonet.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 5, ac: true, wifi: false },
    features: ["Connectivité smartphone tactile", "Caméra de recul", "Modes de conduite ajustables", "Feux de jour LED"],
    pricePerDay: 12000,
    pricePerWeek: 72000,
    pricePerMonth: 250000,
    available: true,
    description: "Crossover compact urbain moderne et polyvalent, offrant un confort soigné et une conduite fluide pour vos trajets professionnels ou personnels.",
    power: "115 ch",
    zeroToHundred: "10,8 s",
    fuel_consumption: "6,3 L/100 km",
    bootVolume: "392 L",
  },
  {
    id: 6,
    slug: "mg-5",
    name: "MG 5",
    brand: "MG",
    categoryId: "berline",
    images: ["/cars/mg-5.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 4, ac: true, wifi: false },
    features: ["Coffre grand volume 512L", "Écran tactile 10 pouces", "Caméra de recul", "Régulateur de vitesse"],
    pricePerDay: 10500,
    pricePerWeek: 63000,
    pricePerMonth: 220000,
    available: true,
    description: "Grande berline élégante et spacieuse, dotée d'une habitabilité remarquable et d'un coffre généreux, idéale pour les familles et longs trajets.",
    power: "115 ch",
    zeroToHundred: "10,5 s",
    fuel_consumption: "5,8 L/100 km",
    bootVolume: "512 L",
  },
  {
    id: 7,
    slug: "geely-gx3-pro",
    name: "Geely GX3 Pro",
    brand: "Geely",
    categoryId: "economique",
    images: ["/cars/geely-gx3-pro.jpg"],
    specs: { seats: 5, gearbox: "Automatique", fuel: "Essence", doors: 5, ac: true, wifi: false },
    features: ["Direction assistée électrique", "Capteurs de recul", "Écran multimédia tactile", "Climatisation"],
    pricePerDay: 8500,
    pricePerWeek: 51000,
    pricePerMonth: 180000,
    available: true,
    description: "Crossover citadin économique et surélevé, très maniable pour circuler aisément à Alger avec une consommation maîtrisée.",
    power: "102 ch",
    zeroToHundred: "11,5 s",
    fuel_consumption: "5,9 L/100 km",
    bootVolume: "400 L",
  },
];
