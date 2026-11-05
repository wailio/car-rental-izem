// ─── IZEM MOTORS · Data Layer ──────────────────────────────────────────────────
// Bridged to single source of truth in @/content/

import { categories as rawCategories, type Category } from "@/content/categories";
import { fleet as rawFleet, type Vehicle } from "@/content/fleet";
import { faqItems as rawFaqs, type FAQItem } from "@/content/faq";
import { facts, buildWhatsAppLink } from "@/content/site-facts";
import { REVIEWS_DATA } from "@/content/reviews-data";

export type { Category, Vehicle, FAQItem };

export type Agency = {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  mapUrl?: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  theme: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  vehicle?: string;
  date: string;
  avatar?: string;
};

export const categories = rawCategories;
export const vehicles = rawFleet;

export const agencies: Agency[] = [
  {
    id: "alger-aeroport",
    name: "IZEM MOTORS – Livraison Aéroport Alger",
    address: "Aéroport d'Alger Houari Boumediene, 16000 Alger",
    phone: facts.phoneFormatted.value,
    whatsapp: facts.whatsapp.value,
    email: facts.email.value,
    hours: facts.openingHours.value,
  },
];

export const faqs: FAQ[] = rawFaqs.map((f) => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
  theme: f.category === 'aeroport' ? 'Aéroport' : f.category === 'conditions' ? 'Conditions' : 'Réservation',
}));

// Fallback reviews strictly from verified feedback without fake luxury models
export const reviews: Review[] = REVIEWS_DATA.map((r) => ({
  id: r.id,
  author: r.author,
  rating: r.rating,
  text: r.text,
  vehicle: r.vehicle,
  date: r.date || "Avis Google vérifié",
}));

export const stats = [
  { value: 7, suffix: "", label: "Véhicules récents" },
  { value: 24, suffix: "h/24", label: "Assistance 7j/7" },
  { value: 100, suffix: "%", label: "Livraison aéroport incluse" },
];

export { facts, buildWhatsAppLink };
