export interface ProductFinish {
  name: string;
  color: string;
}

export const DEFAULT_FINISHES: ProductFinish[] = [
  { name: 'Noir Ébène', color: '#0F172A' },
  { name: 'Gris Métallisé', color: '#64748B' },
  { name: 'Blanc Pur', color: '#F8FAFC' },
];

export const DEFAULT_FEATURES: string[] = [
  'Véhicule récent et révisé',
  'Assurance tous risques incluse',
  'Remise immédiate Aéroport Houari Boumediene',
];

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  featured?: boolean;
  createdAt?: string;
  finishes?: ProductFinish[];
  features?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Audi A3 Sportback',
    description: 'Berline compacte premium alliant dynamisme, raffinement et finitions d\'exception.',
    price: 22000,
    originalPrice: 25000,
    image: '/cars/audi-a3-sportback.jpg',
    images: ['/cars/audi-a3-sportback.jpg'],
    category: 'Berline',
    brand: 'Audi',
    featured: true,
    features: ['Boîte automatique S tronic', 'Cockpit virtuel', 'Remise directe aéroport'],
  },
  {
    id: 2,
    name: 'MG 7 Fastback',
    description: 'Berline grand tourisme aux lignes sportives racées et habitacle technologique luxueux.',
    price: 26000,
    originalPrice: 30000,
    image: '/cars/mg-7.png',
    images: ['/cars/mg-7.png'],
    category: 'Luxe',
    brand: 'MG',
    featured: true,
    features: ['Design fastback exclusif', 'Sellerie cuir nappa', 'Système audio premium'],
  },
  {
    id: 3,
    name: 'Volkswagen T-Cross',
    description: 'SUV urbain allemand compact, surélevé, spacieux et idéal pour tous vos trajets.',
    price: 17000,
    originalPrice: 19000,
    image: '/cars/volkswagen-t-cross.jpg',
    images: ['/cars/volkswagen-t-cross.jpg'],
    category: 'SUV',
    brand: 'Volkswagen',
    featured: true,
    features: ['Poste de conduite surélevé', 'Aide au stationnement', 'Climatisation bizone'],
  },
  {
    id: 4,
    name: 'Geely Coolray Sport',
    description: 'SUV moderne au caractère affirmé, doté des dernières technologies d\'assistance.',
    price: 15000,
    originalPrice: 17000,
    image: '/cars/geely-coolray.jpg',
    images: ['/cars/geely-coolray.jpg'],
    category: 'SUV',
    brand: 'Geely',
    featured: true,
    features: ['Caméra panoramique 360°', 'Toit ouvrant panoramique', 'Mode Sport dynamique'],
  },
  {
    id: 5,
    name: 'Kia Sonet Crossover',
    description: 'Crossover polyvalent et économique, confortable en ville comme sur autoroute.',
    price: 12000,
    originalPrice: 14000,
    image: '/cars/kia-sonet.jpg',
    images: ['/cars/kia-sonet.jpg'],
    category: 'Crossover',
    brand: 'Kia',
    featured: false,
    features: ['Faible consommation', 'Écran tactile HD', 'Apple CarPlay & Android Auto'],
  },
  {
    id: 6,
    name: 'MG 5 Berline',
    description: 'Berline élégante, coffre généreux de 512 L et grand confort pour les trajets d\'affaires et famille.',
    price: 10500,
    originalPrice: 12000,
    image: '/cars/mg-5.jpg',
    images: ['/cars/mg-5.jpg'],
    category: 'Berline',
    brand: 'MG',
    featured: false,
    features: ['Grand coffre 512 L', 'Régulateur de vitesse', 'Confort longue distance'],
  },
  {
    id: 7,
    name: 'Geely GX3 Pro',
    description: 'Citadine surélevée compacte et agile, parfaite pour circuler et se garer facilement.',
    price: 8500,
    originalPrice: 10000,
    image: '/cars/geely-gx3-pro.jpg',
    images: ['/cars/geely-gx3-pro.jpg'],
    category: 'Citadine',
    brand: 'Geely',
    featured: false,
    features: ['Format compact idéal Alger', 'Garde au sol surélevée', 'Consommation minimale'],
  },
];
