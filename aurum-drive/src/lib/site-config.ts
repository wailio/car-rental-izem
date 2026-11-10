import { REVIEWS_DATA } from '@/content/reviews-data';
export interface ReviewItem {
  id: string
  author: string
  vehicle: string
  rating: number
  date?: string
  text: string
}

export interface SiteConfig {
  // ── 1. Contact & Agence (/contact) ──────────────────────────────────────────
  phone: string
  phone_alt: string
  whatsapp: string
  email: string
  address: string
  airport_terminal: string
  hours: string
  maps_embed_url: string
  contact_bg_image: string
  contact_client_image: string

  // ── 2. Accueil & Hero (/) ───────────────────────────────────────────────────
  hero_eyebrow: string
  hero_heading: string
  hero_subtitle: string
  hero_cta: string
  hero_cta_secondary: string
  hero_booking_title: string
  promo_bar: string
  reassurance_badge: string

  // ── 3. Flotte & Catalogue (/vehicules) ──────────────────────────────────────
  fleet_title: string
  fleet_subtitle: string
  fleet_pickup_location: string
  fleet_empty_msg: string

  // ── 4. Prestations & Services (/services) ───────────────────────────────────
  service_1_title: string
  service_1_tagline: string
  service_1_desc: string
  service_1_image: string

  service_2_title: string
  service_2_tagline: string
  service_2_desc: string
  service_2_image: string

  service_3_title: string
  service_3_tagline: string
  service_3_desc: string
  service_3_image: string

  service_4_title: string
  service_4_tagline: string
  service_4_desc: string
  service_4_image: string

  // ── 5. À Propos (/a-propos) ─────────────────────────────────────────────────
  about_badge: string
  about_title: string
  about_intro: string
  about_story_h2: string
  about_story_p1: string
  about_story_p2: string
  about_image: string
  stats_vehicles: string
  stats_assistance: string
  stats_delivery: string

  // ── 6. Avis Clients (/avis) ─────────────────────────────────────────────────
  reviews_badge: string
  reviews_title: string
  reviews_subtitle: string
  reviews_rating: string
  reviews_items_json: string
  review_1_author: string
  review_1_vehicle: string
  review_1_text: string
  review_2_author: string
  review_2_vehicle: string
  review_2_text: string
  review_3_author: string
  review_3_vehicle: string
  review_3_text: string

  // ── 7. Centre d'Aide & FAQ (/faq) ───────────────────────────────────────────
  faq_badge: string
  faq_title: string
  faq_subtitle: string
  faq_1_q: string
  faq_1_a: string
  faq_2_q: string
  faq_2_a: string
  faq_3_q: string
  faq_3_a: string
  faq_4_q: string
  faq_4_a: string

  // ── 8. Conditions de Location (/conditions) ─────────────────────────────────
  condition_1_title: string
  condition_1_text: string
  condition_2_title: string
  condition_2_text: string
  condition_3_title: string
  condition_3_text: string
  condition_4_title: string
  condition_4_text: string

  // ── 9. Pied de page, Réseaux Sociaux & SEO ──────────────────────────────────
  tiktok: string
  tiktok_url: string
  instagram_url: string
  facebook_url: string
  footer_tagline: string
  footer_brand_desc: string
  footer_notice: string
  logo_url: string
  meta_title: string
  meta_description: string
  og_image: string

  [key: string]: string
}

export const DEFAULT_REVIEWS: ReviewItem[] = REVIEWS_DATA;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // ── 1. Contact & Agence (/contact) ──────────────────────────────────────────
  phone: '0555 33 33 16',
  phone_alt: '0561 84 11 58',
  whatsapp: '213555333316',
  email: 'izemmotors@gmail.com',
  address: "Aéroport d'Alger Houari Boumediene (Terminal 1, Ouest & Agence Alger)",
  airport_terminal: 'Terminal 1 (National) & Terminal 4 (Ouest International)',
  hours: '7j/7, 24h/24 pour les arrivées aéroport · Lun–Sam 08h00–19h00',
  maps_embed_url: 'https://maps.google.com/?q=Aeroport+d+Alger+Houari+Boumediene',
  contact_bg_image: '/images/bbg.jpg',
  contact_client_image: '/images/contact-us-image.jpg',

  // ── 2. Accueil & Hero (/) ───────────────────────────────────────────────────
  hero_eyebrow: "Prise en charge à l'Aéroport d'Alger",
  hero_heading: 'Louez le véhicule idéal pour chaque trajet à Alger',
  hero_subtitle: "Trouvez la voiture idéale pour chaque trajet parmi notre sélection de véhicules récents et parfaitement entretenus. Livraison gratuite à l'Aéroport d'Alger, assistance 24h/24, assurance tous risques et sans paiement en ligne préalable.",
  hero_cta: 'Réserver un véhicule',
  hero_cta_secondary: 'Voir la flotte',
  hero_booking_title: 'Besoin de louer un véhicule ?',
  promo_bar: "Livraison & retour gratuits à l'aéroport · Assistance 24h/24, 7j/7 · Assurance tous risques · Zéro frais cachés",
  reassurance_badge: 'Sélectionnez vos dates pour afficher les disponibilités exactes et les tarifs dégressifs. Sans paiement en ligne.',

  // ── 3. Flotte & Catalogue (/vehicules) ──────────────────────────────────────
  fleet_title: 'La flotte',
  fleet_subtitle: 'Sélectionnez vos dates pour afficher les disponibilités exactes et les tarifs dégressifs. Sans paiement en ligne.',
  fleet_pickup_location: "Aéroport d'Alger Houari Boumediene",
  fleet_empty_msg: "Aucune voiture disponible pour ces dates. Essayez d'autres dates ou écrivez-nous sur WhatsApp.",

  // ── 4. Prestations & Services (/services) ───────────────────────────────────
  service_1_title: "Livraison & retour à l'Aéroport d'Alger",
  service_1_tagline: "Vos clés vous attendent à l'arrivée au terminal.",
  service_1_desc: "Finie l'attente après le vol. Dès votre sortie du terminal de l'Aéroport Houari Boumediene, notre équipe vous remet le véhicule réservé avec les papiers prêts. Au retour, nous récupérons la voiture au même endroit. Service gratuit 24h/24 et 7j/7.",
  service_1_image: '/cars/audi-a3-sportback.jpg',

  service_2_title: 'Location courte, moyenne et longue durée',
  service_2_tagline: 'Des formules souples avec tarifs dégressifs transparents.',
  service_2_desc: 'Que vous restiez quelques jours pour affaires ou plusieurs semaines en famille, profitez de tarifs dégressifs clairs. Pas de frais cachés, un kilométrage adapté et une transparence totale sur le dépôt de garantie.',
  service_2_image: '/cars/volkswagen-t-cross.jpg',

  service_3_title: 'Assistance routière 24h/24 et 7j/7',
  service_3_tagline: 'Une équipe locale joignable à tout moment.',
  service_3_desc: "Parce qu'un imprévu peut arriver sur la route, notre assistance téléphonique et WhatsApp reste active 24h/24 et 7j/7. Nous coordonnons rapidement l'aide nécessaire pour que vous puissiez poursuivre votre trajet sereinement.",
  service_3_image: '/cars/geely-coolray.jpg',

  service_4_title: 'Véhicules pour événements et déplacements familiaux',
  service_4_tagline: 'Des voitures impeccables pour vos moments importants.',
  service_4_desc: 'Nos SUV et berlines récents sont minutieusement nettoyés et contrôlés pour vos fêtes de famille, cortèges ou rendez-vous importants. Contactez-nous pour réserver les modèles de votre choix.',
  service_4_image: '/cars/mg-7.png',

  // ── 5. À Propos (/a-propos) ─────────────────────────────────────────────────
  about_badge: 'Notre Engagement',
  about_title: 'Une agence de location humaine, à Alger.',
  about_intro: "IZEM MOTORS est née d'un principe simple : louer un véhicule à Alger doit être clair, rapide et rassurant. Sans frais cachés ni mauvaise surprise.",
  about_story_h2: "La simplicité dès votre descente d'avion",
  about_story_p1: "Nous avons supprimé les tracas habituels : finies les attentes interminables, les modèles modifiés au dernier moment ou les cautions floues. Chez IZEM MOTORS, vous conduisez le modèle que vous avez réservé, aux conditions convenues.",
  about_story_p2: "Nous livrons et reprenons les véhicules directement à l'Aéroport d'Alger Houari Boumediene sans supplément. Notre équipe est sur place 7j/7 pour vous remettre les clés dès votre atterrissage.",
  about_image: '/images/wee.png',
  stats_vehicles: '17',
  stats_assistance: '24h/24',
  stats_delivery: '100%',

  // ── 6. Avis Clients (/avis) ─────────────────────────────────────────────────
  reviews_badge: 'Avis Vérifiés Google',
  reviews_title: 'Avis de nos Clients',
  reviews_subtitle: '70 avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.',
  reviews_rating: '5.0/5',
  reviews_items_json: JSON.stringify(DEFAULT_REVIEWS),
  review_1_author: 'Abderrahim ZEMMOUR',
  review_1_vehicle: 'Volkswagen T-Cross',
  review_1_text: "Très bonne expérience ! Service sérieux, voiture propre et en très bon état. Équipe sympathique et professionnelle. Merci pour votre accueil et votre confiance, je recommande à 100% !",
  review_2_author: 'Chimene',
  review_2_vehicle: 'Geely Coolray',
  review_2_text: "Très bonne expérience chez Izem motors. Service rapide et efficace je recommande fortement !! Les voitures sont parfaites et le personnel super gentil et professionnel. Je suis très satisfaite de la voiture j’ai pu renouveler pleins de fois mon contrat de location grâce a leur réactivité . Merci bcp !!",
  review_3_author: 'Nadia Bouzid',
  review_3_vehicle: 'Audi A3 Sportback',
  review_3_text: "Je suis très satisfaite de cette location. Tout s’est très bien passé du début à la fin. Le véhicule était propre, confortable, en très bon état et parfaitement conforme à la description. La prise en charge s’est déroulée avec ponctualité et courtoisie.",

  // ── 7. Centre d'Aide & FAQ (/faq) ───────────────────────────────────────────
  faq_badge: "Centre d'Aide & FAQ",
  faq_title: 'Questions Fréquentes',
  faq_subtitle: 'Retrouvez toutes les précisions sur les conditions de location, le dépôt de caution et les modalités de remise des clés.',
  faq_1_q: 'Quels documents faut-il pour louer ?',
  faq_1_a: "Une pièce d'identité valide (passeport ou carte nationale) et votre permis de conduire original en cours de validité. La caution est déposée lors de la remise des clés.",
  faq_2_q: "La livraison à l'aéroport est-elle vraiment gratuite ?",
  faq_2_a: "Oui. La livraison et le retour de votre véhicule à l'Aéroport d'Alger Houari Boumediene sont entièrement gratuits, 24h/24 et 7j/7 sur réservation.",
  faq_3_q: 'Y a-t-il un paiement demandé en ligne ?',
  faq_3_a: "Non. Aucun paiement ni numéro de carte bancaire n'est requis sur le site. Le règlement et le dépôt de caution s'effectuent sur place lors de la remise des clés.",
  faq_4_q: 'Quelle est la formule d\'assurance incluse ?',
  faq_4_a: "Tous nos véhicules bénéficient d'une assurance tous risques avec assistance 24/7 pour que vous puissiez rouler l'esprit tranquille.",

  // ── 8. Conditions de Location (/conditions) ─────────────────────────────────
  condition_1_title: "1. Conditions d'Éligibilité du Conducteur",
  condition_1_text: "Le locataire et tout conducteur autorisé doivent être âgés au minimum de 21 ans (23 ans pour les Berlines et SUV, 25 ans pour la catégorie Premium) et être titulaires d'un permis de conduire valide depuis au moins 1 à 3 ans selon la catégorie du véhicule loué.",
  condition_2_title: '2. Réservation & Confirmation',
  condition_2_text: 'Toute demande effectuée via le site Internet constitue une pré-réservation sans paiement immédiat. La réservation ne devient définitive qu\'après confirmation écrite émise par IZEM MOTORS par e-mail ou WhatsApp.',
  condition_3_title: '3. Caution & Règlement',
  condition_3_text: "Une caution sous forme de chèque certifié, pré-autorisation de carte bancaire ou espèces est déposée au moment de la prise en charge du véhicule. Cette caution est intégralement restituée à la restitution du véhicule après constat contradictoire de l'état des lieux.",
  condition_4_title: '4. Utilisation du Véhicule',
  condition_4_text: 'Le véhicule doit être conduit sur les voies carrossables autorisées et dans le strict respect du Code de la Route en vigueur en République Algérienne Démocratique et Populaire.',

  // ── 9. Pied de page, Réseaux Sociaux & SEO ──────────────────────────────────
  tiktok: '@izem.motors',
  tiktok_url: 'https://www.tiktok.com/@izem.motors/',
  instagram_url: 'https://www.instagram.com/dz_rent_car/',
  facebook_url: 'https://www.facebook.com/people/Dz-rent-car/100069505853486/',
  footer_tagline: 'IZEM MOTORS · Location de véhicules à Alger et Aéroport Houari Boumediene',
  footer_brand_desc: 'Votre partenaire mobilité de confiance à Alger. Flotte récente, livraison aéroport gratuite et assistance continue 24/7.',
  footer_notice: 'Zéro paiement en ligne requis · Règlement et caution effectués sur place lors de la prise en charge.',
  logo_url: '/images/izem-emblem.png',
  meta_title: 'IZEM MOTORS | Location de voitures Aeroport Alger & Aéroport Houari Boumediene',
  meta_description: "Location de voitures récentes à Alger avec IZEM MOTORS. Livraison gratuite Aéroport d'Alger 24/7, assurance tous risques et réservation sans prépaiement.",
  og_image: '/images/hero-fleet-poster.jpg',
}

export const PUBLIC_SITE_CONFIG_STORAGE_URL =
  'https://vhzgasepkcdhnpcinntb.supabase.co/storage/v1/object/public/products/site-config.json'

export function parseReviews(config?: Partial<SiteConfig>): ReviewItem[] {
  if (config?.reviews_items_json) {
    try {
      const parsed = JSON.parse(config.reviews_items_json)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
  }
  if (config?.review_1_author) {
    const list: ReviewItem[] = []
    let i = 1
    while (config[`review_${i}_author`]) {
      list.push({
        id: String(i),
        author: String(config[`review_${i}_author`] || ''),
        vehicle: String(config[`review_${i}_vehicle`] || ''),
        rating: 5,
        date: '2026-09-01',
        text: String(config[`review_${i}_text`] || ''),
      })
      i++
    }
    if (list.length > 0) return list
  }
  return DEFAULT_REVIEWS
}
