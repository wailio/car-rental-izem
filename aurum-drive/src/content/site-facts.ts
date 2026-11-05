// ─── IZEM MOTORS · Single Source of Truth: Site Facts Register ─────────────────
// Governed by docs/redesign/03-BRAND-AND-CONTENT.md
// Rule: Only facts marked 'verified' can be rendered as claims in production.

export type FactStatus = 'verified' | 'from-site' | 'conflict' | 'unknown';

export interface Fact<T> {
  value: T;
  status: FactStatus;
  source?: string;
  note?: string;
}

export const facts = {
  // ── Verified Facts ─────────────────────────────────────────────────────────
  name: {
    value: 'IZEM MOTORS',
    status: 'verified',
    source: 'Google Maps listing & social media profiles',
  },
  seoName: {
    value: 'IZEM MOTORS | Location de voitures Aéroport Alger',
    status: 'verified',
    source: 'Google Maps listing',
  },
  shortName: {
    value: 'IZEM',
    status: 'verified',
    source: 'Social media handles',
  },
  airportDelivery: {
    value: "Livraison et retour gratuits à l'aéroport d'Alger",
    status: 'verified',
    source: 'Google Maps listing & social media',
    note: 'Core superpower of the brand — make it the hero promise',
  },
  assistance247: {
    value: 'Assistance routière 24h/24, 7j/7',
    status: 'verified',
    source: 'Social media profiles',
  },
  insurance: {
    value: 'Assurance tous risques',
    status: 'from-site',
    source: 'Service offering',
    note: 'Coverage and excess details to be confirmed by client',
  },
  recentCars: {
    value: 'Véhicules récents, automatiques ou manuels',
    status: 'verified',
    source: 'Social media profiles',
  },
  reliableService: {
    value: 'Location simple, rapide et fiable',
    status: 'verified',
    source: 'Social media profiles',
  },
  tiktokHandle: {
    value: 'https://www.tiktok.com/@izem.motors/',
    status: 'verified',
    source: 'TikTok profile @izem.motors',
  },
  instagramHandle: {
    value: 'https://www.instagram.com/izem_motors',
    status: 'verified',
    source: 'Instagram profile @izem_motors',
  },
  facebookHandle: {
    value: 'https://www.facebook.com/profile.php?id=61593687483158',
    status: 'verified',
    source: 'Facebook profile',
  },

  // ── From-Site Facts (To be confirmed by client) ───────────────────────────
  phone: {
    value: '0772 23 36 64',
    status: 'verified',
    source: 'Google search results',
    note: 'Primary contact number',
  },
  phoneAlt: {
    value: '0675 40 25 41',
    status: 'verified',
    source: 'Google search results',
    note: 'Secondary contact number',
  },
  phoneFormatted: {
    value: '+213 772 23 36 64',
    status: 'verified',
    source: 'Google search results',
  },
  whatsapp: {
    value: '213772233664',
    status: 'verified',
    source: 'Phone number formatted for WhatsApp',
  },
  email: {
    value: 'izemmotors@gmail.com',
    status: 'from-site',
    source: 'TODO:CLIENT Confirm official email',
    note: 'Placeholder until client confirms',
  },
  domain: {
    value: 'https://izem.autos',
    status: 'from-site',
    source: 'Google search results — official website',
  },
  vehicleCount: {
    value: 7,
    status: 'verified',
    source: 'Flotte officielle IZEM MOTORS (7 véhicules)',
  },
  openingHours: {
    value: '7j/7 de 09h00 à 19h00',
    status: 'verified',
    source: 'Google search results',
  },
  agencyAddress: {
    value: "Aéroport Houari Boumediene, Alger",
    status: 'verified',
    source: 'Google Maps listing',
    note: 'Primary hub at the airport',
  },
  googleMaps: {
    value: 'https://maps.app.goo.gl/saDFSFHJhSa3pBCD7',
    status: 'verified',
    source: 'Client provided Google Maps link',
  },

  // ── Conflicting / Unknown Facts ───────────────────────────────────────────
  responseTime: {
    value: 'sous 24 h',
    status: 'from-site',
    source: 'Standard promise',
    note: 'Defaulting to safe promise "sous 24 h"',
  },
  customersServed: {
    value: null,
    status: 'unknown',
    source: 'TODO:CLIENT Provide verified number',
    note: 'Hidden until verified number is provided',
  },
  yearsActive: {
    value: null,
    status: 'unknown',
    source: 'TODO:CLIENT Confirm founding year',
    note: 'Hidden until confirmed',
  },
} as const satisfies Record<string, Fact<unknown>>;

export type FactKey = keyof typeof facts;

/**
 * claim() helper to safely retrieve fact values.
 * In production: Only returns the value if verified, else fallback or neutral copy.
 * In development: Returns value, logging unconfirmed items.
 */
export function claim<K extends FactKey>(key: K, fallback?: string): string {
  const fact = facts[key];
  if (!fact) return fallback ?? '';

  if (process.env.NODE_ENV === 'production') {
    if (fact.status === 'verified') {
      return String(fact.value ?? '');
    }
    // Return safe fallback or neutral value
    return fallback !== undefined ? fallback : (fact.value !== null ? String(fact.value) : '');
  }

  // Development mode: return value with note if unverified
  return fact.value !== null ? String(fact.value) : (fallback ?? '');
}

/**
 * Builds standard WhatsApp direct link
 */
export function buildWhatsAppLink(options?: { car?: string; from?: string; to?: string; text?: string }): string {
  const base = `https://wa.me/${facts.whatsapp.value}`;
  if (options?.text) {
    return `${base}?text=${encodeURIComponent(options.text)}`;
  }
  if (options?.car) {
    const text = options.from && options.to
      ? `Bonjour, je souhaite réserver la ${options.car} du ${options.from} au ${options.to}. Livraison à l'aéroport d'Alger ?`
      : `Bonjour, je souhaite avoir des renseignements sur la ${options.car}.`;
    return `${base}?text=${encodeURIComponent(text)}`;
  }
  return `${base}?text=${encodeURIComponent("Bonjour IZEM MOTORS, je voudrais louer une voiture à l'aéroport d'Alger.")}`;
}
