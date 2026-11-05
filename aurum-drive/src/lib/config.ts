// ─── IZEM MOTORS · Global Config ─────────────────────────────────────────────
// One file to rule all brand-level constants.
// Swap the values here; nothing else needs to change.

export const BRAND = {
  name: "IZEM MOTORS",
  tagline: "Votre voiture vous attend à l'aéroport.",
  shortName: "IZEM",
  phone: "0772 23 36 64",
  phoneAlt1: "0675 40 25 41",
  phoneAlt2: "",
  whatsapp: "213772233664",
  email: "izemmotors@gmail.com",
  address: "Aéroport Houari Boumediene, Alger",
  hours: "7j/7, 09h00–19h00",
  socialLinks: {
    tiktok: "https://www.tiktok.com/@izem.motors/",
    instagram: "https://www.instagram.com/izem_motors",
    facebook: "https://www.facebook.com/profile.php?id=61593687483158",
  },
  locale: "fr-DZ",
  currency: "DA",
  timezone: "Africa/Algiers",
  googleMaps: "https://maps.app.goo.gl/saDFSFHJhSa3pBCD7",
  googleReviews:
    "https://www.google.com/maps/place/IZEM+MOTORS+%7C+Location+de+voitures+A%C3%A9roport+Alger/@36.7311853,3.1720985,17z/data=!4m8!3m7!1s0x128e5360434cb055:0x8f62ecf6fd289b6f!8m2!3d36.731181!4d3.1746734!9m1!1b1!16s%2Fg%2F11ypkdnby4?entry=ttu&g_ep=EgoyMDI2MTEwMS4wIKXMDSoASAFQAw%3D%3D",
} as const;

export const ROUTES = {
  home: "/",
  fleet: "/vehicules",
  vehicle: (slug: string) => `/vehicules/${slug}`,
  reserve: (id: number | string, pickupAt?: string, returnAt?: string) => {
    const base = `/reserver/modele/${id}`;
    const params = new URLSearchParams();
    if (pickupAt) params.set("pickup_at", pickupAt);
    if (returnAt) params.set("return_at", returnAt);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  },
  confirmation: (ref: string) => `/reserver/confirmation/${ref}`,
  services: "/services",
  about: "/a-propos",
  reviews: "/avis",
  faq: "/faq",
  contact: "/contact",
  legal: "/mentions-legales",
  conditions: "/conditions",
  privacy: "/confidentialite",
} as const;
