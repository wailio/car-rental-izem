'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { showIosToast, showIosConfirm } from '@/components/ui/ios-dialog'
import {
  Home, Phone, Info, Share2, LayoutTemplate, Search,
  ChevronRight, Save, Upload, Image as ImageIcon,
  Loader2, RefreshCw, ExternalLink, X, Check, Sparkles,
  Car, Star, HelpCircle, FileText, Trash2, Plus, ChevronDown,
} from 'lucide-react'
import { DEFAULT_SITE_CONFIG, ReviewItem, parseReviews } from '@/lib/site-config'

// ─── Field & Section Definitions ─────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'url'

interface Field {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  hint?: string
}

interface ImageField {
  key: string
  label: string
  hint?: string
}

interface Section {
  key: string
  label: string
  fields: Field[]
  imageFields?: ImageField[]
}

interface SitePage {
  key: string
  label: string
  icon: React.ElementType
  color: string
  sections: Section[]
}

const SITE_PAGES: SitePage[] = [
  {
    key: 'contact',
    label: 'Contact & Agence',
    icon: Phone,
    color: '#0A84FF',
    sections: [
      {
        key: 'coordonnees',
        label: 'Lignes directes & Contact',
        fields: [
          { key: 'phone', label: "Téléphone d'accueil 24/7", type: 'text', placeholder: '0555 33 33 16', hint: "Numéro principal affiché sur l'en-tête et le pied de page" },
          { key: 'phone_alt', label: 'Ligne secondaire / Urgences', type: 'text', placeholder: '0561 84 11 58', hint: "Numéro d'astreinte directe 2ème ligne" },
          { key: 'whatsapp', label: 'Numéro WhatsApp officiel', type: 'text', placeholder: '213555333316', hint: 'Sans le signe + ni espaces (ex: 213555333316)' },
          { key: 'email', label: 'Courriel officiel', type: 'text', placeholder: 'dzrentcars@gmail.com', hint: 'Pour les devis et confirmations écrites' },
        ],
      },
      {
        key: 'localisation',
        label: 'Agence & Terminaux',
        fields: [
          { key: 'address', label: 'Showroom & Agence', type: 'text', placeholder: "Aéroport d'Alger Houari Boumediene (Terminal 1, Ouest & Agence Alger)", hint: "Adresse physique de l'agence principale" },
          { key: 'airport_terminal', label: 'Hub livraison aéroport', type: 'text', placeholder: 'Terminal 1 (National) & Terminal 4 (Ouest International)', hint: 'Terminaux desservis pour la remise des clés' },
          { key: 'hours', label: "Horaires d'ouverture", type: 'text', placeholder: '7j/7, 24h/24 pour les arrivées aéroport · Lun–Sam 08h00–19h00', hint: 'Disponibilité affichée aux voyageurs' },
          { key: 'maps_embed_url', label: 'Lien Google Maps / Itinéraire', type: 'url', placeholder: 'https://maps.google.com/?q=Aeroport+d+Alger+Houari+Boumediene', hint: 'Lien de géolocalisation pour guider le voyageur' },
        ],
        imageFields: [
          { key: 'contact_bg_image', label: 'Arrière-plan bannière contact', hint: 'Image affichée dans la bannière supérieure (/images/contact-bg.png)' },
          { key: 'contact_client_image', label: 'Photo service client', hint: 'Visuel du service client affiché à côté des coordonnées (/images/contact-us-image.jpg)' },
        ],
      },
    ],
  },
  {
    key: 'home',
    label: "Page d'Accueil",
    icon: Home,
    color: '#30D158',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section & Accroche',
        fields: [
          { key: 'hero_eyebrow', label: "Badge d'accroche (eyebrow)", type: 'text', placeholder: "Prise en charge à l'Aéroport d'Alger", hint: 'Texte court au-dessus du grand titre' },
          { key: 'hero_heading', label: 'Titre principal H1', type: 'text', placeholder: 'Louez le véhicule idéal pour chaque trajet à Alger', hint: "Grand titre d'accroche principal" },
          { key: 'hero_subtitle', label: "Sous-titre de l'accroche", type: 'textarea', placeholder: "Trouvez la voiture idéale pour chaque trajet parmi notre sélection de véhicules récents et parfaitement entretenus. Livraison gratuite à l'Aéroport d'Alger, assistance 24h/24, assurance tous risques et sans paiement en ligne préalable.", hint: 'Texte explicatif sous le titre principal' },
          { key: 'hero_cta', label: "Bouton d'action principal (CTA 1)", type: 'text', placeholder: 'Réserver un véhicule' },
          { key: 'hero_cta_secondary', label: 'Bouton secondaire (CTA 2)', type: 'text', placeholder: 'Voir la flotte' },
          { key: 'hero_booking_title', label: 'Titre module de réservation', type: 'text', placeholder: 'Besoin de louer un véhicule ?' },
        ],
      },
      {
        key: 'promo',
        label: 'Bandeau de Réassurance & Promo',
        fields: [
          { key: 'promo_bar', label: 'Texte du bandeau défilant', type: 'textarea', placeholder: "Livraison & retour gratuits à l'aéroport · Assistance 24h/24, 7j/7 · Assurance tous risques · Zéro frais cachés", hint: "Bandeau d'annonce en haut du site" },
          { key: 'reassurance_badge', label: 'Ligne de réassurance réservation', type: 'textarea', placeholder: 'Sélectionnez vos dates pour afficher les disponibilités exactes et les tarifs dégressifs. Sans paiement en ligne.', hint: 'Phrase affichée au-dessus du sélecteur de dates' },
        ],
      },
    ],
  },
  {
    key: 'vehicules',
    label: 'Flotte & Catalogue',
    icon: Car,
    color: '#FF9F0A',
    sections: [
      {
        key: 'catalogue',
        label: 'Catalogue & Réservation',
        fields: [
          { key: 'fleet_title', label: 'Titre de la page flotte', type: 'text', placeholder: 'La flotte', hint: 'Grand titre sur la page /vehicules' },
          { key: 'fleet_subtitle', label: 'Sous-titre catalogue', type: 'textarea', placeholder: 'Sélectionnez vos dates pour afficher les disponibilités exactes et les tarifs dégressifs. Sans paiement en ligne.' },
          { key: 'fleet_pickup_location', label: 'Lieu de prise en charge par défaut', type: 'text', placeholder: "Aéroport d'Alger Houari Boumediene" },
          { key: 'fleet_empty_msg', label: 'Message si aucun véhicule disponible', type: 'textarea', placeholder: "Aucune voiture disponible pour ces dates. Essayez d'autres dates ou écrivez-nous sur WhatsApp." },
        ],
      },
    ],
  },
  {
    key: 'services',
    label: 'Prestations',
    icon: Sparkles,
    color: '#FFD60A',
    sections: [
      {
        key: 'services_list',
        label: 'Les 4 Prestations Phares',
        fields: [
          { key: 'service_1_title', label: 'Prestation 1 — Titre', type: 'text', placeholder: "Livraison & retour à l'Aéroport d'Alger" },
          { key: 'service_1_tagline', label: 'Prestation 1 — Tagline', type: 'text', placeholder: "Vos clés vous attendent à l'arrivée au terminal." },
          { key: 'service_1_desc', label: 'Prestation 1 — Description', type: 'textarea', placeholder: "Finie l'attente après le vol. Dès votre sortie du terminal de l'Aéroport Houari Boumediene, notre équipe vous remet le véhicule réservé avec les papiers prêts." },
          { key: 'service_2_title', label: 'Prestation 2 — Titre', type: 'text', placeholder: 'Location courte, moyenne et longue durée' },
          { key: 'service_2_tagline', label: 'Prestation 2 — Tagline', type: 'text', placeholder: 'Des formules souples avec tarifs dégressifs transparents.' },
          { key: 'service_2_desc', label: 'Prestation 2 — Description', type: 'textarea', placeholder: 'Que vous restiez quelques jours pour affaires ou plusieurs semaines en famille, profitez de tarifs dégressifs clairs. Pas de frais cachés.' },
          { key: 'service_3_title', label: 'Prestation 3 — Titre', type: 'text', placeholder: 'Assistance routière 24h/24 et 7j/7' },
          { key: 'service_3_tagline', label: 'Prestation 3 — Tagline', type: 'text', placeholder: 'Une équipe locale joignable à tout moment.' },
          { key: 'service_3_desc', label: 'Prestation 3 — Description', type: 'textarea', placeholder: "Parce qu'un imprévu peut arriver sur la route, notre assistance téléphonique et WhatsApp reste active 24h/24 et 7j/7." },
          { key: 'service_4_title', label: 'Prestation 4 — Titre', type: 'text', placeholder: 'Véhicules pour événements et déplacements familiaux' },
          { key: 'service_4_tagline', label: 'Prestation 4 — Tagline', type: 'text', placeholder: 'Des voitures impeccables pour vos moments importants.' },
          { key: 'service_4_desc', label: 'Prestation 4 — Description', type: 'textarea', placeholder: 'Nos SUV et berlines récents sont minutieusement nettoyés et contrôlés pour vos fêtes de famille, cortèges ou rendez-vous importants.' },
        ],
        imageFields: [
          { key: 'service_1_image', label: 'Photo Prestation 1 (Aéroport)', hint: 'Image affichée sur la carte Prestation 1 (/cars/audi-a3-sportback.jpg)' },
          { key: 'service_2_image', label: 'Photo Prestation 2 (Durée)', hint: 'Image affichée sur la carte Prestation 2 (/cars/volkswagen-t-cross.jpg)' },
          { key: 'service_3_image', label: 'Photo Prestation 3 (Assistance)', hint: 'Image affichée sur la carte Prestation 3 (/cars/geely-coolray.jpg)' },
          { key: 'service_4_image', label: 'Photo Prestation 4 (Événements)', hint: 'Image affichée sur la carte Prestation 4 (/cars/mg-7.png)' },
        ],
      },
    ],
  },
  {
    key: 'about',
    label: 'À Propos',
    icon: Info,
    color: '#AF52DE',
    sections: [
      {
        key: 'about_content',
        label: 'Notre Engagement & Histoire',
        fields: [
          { key: 'about_badge', label: 'Badge de la page', type: 'text', placeholder: 'Notre Engagement' },
          { key: 'about_title', label: 'Titre principal', type: 'text', placeholder: 'Une agence de location humaine, à Alger.' },
          { key: 'about_intro', label: 'Introduction de la marque', type: 'textarea', placeholder: "IZEM MOTORS est née d'un principe simple : louer un véhicule à Alger doit être clair, rapide et rassurant. Sans frais cachés ni mauvaise surprise." },
          { key: 'about_story_h2', label: "Titre de l'histoire", type: 'text', placeholder: "La simplicité dès votre descente d'avion" },
          { key: 'about_story_p1', label: "Histoire de l'agence — §1", type: 'textarea', placeholder: 'Nous avons supprimé les tracas habituels : finies les attentes interminables, les modèles modifiés au dernier moment ou les cautions floues.' },
          { key: 'about_story_p2', label: 'Livraison aéroport — §2', type: 'textarea', placeholder: "Nous livrons et reprenons les véhicules directement à l'Aéroport d'Alger Houari Boumediene sans supplément." },
        ],
        imageFields: [
          { key: 'about_image', label: "Photo principale de l'agence / flotte", hint: 'Grande photo affichée sur la page À propos (/images/hero-fleet-poster.jpg)' },
        ],
      },
      {
        key: 'about_stats',
        label: 'Chiffres Clés & Statistiques',
        fields: [
          { key: 'stats_vehicles', label: 'Nombre de véhicules récents', type: 'text', placeholder: '17', hint: 'Nombre total de voitures en circulation' },
          { key: 'stats_assistance', label: 'Assistance routière', type: 'text', placeholder: '24h/24', hint: "Disponibilité 7j/7 de l'assistance" },
          { key: 'stats_delivery', label: 'Livraison aéroport incluse', type: 'text', placeholder: '100%', hint: 'Taux de prise en charge sans supplément' },
        ],
      },
    ],
  },
  {
    key: 'avis',
    label: 'Avis Clients',
    icon: Star,
    color: '#FF2D55',
    sections: [
      {
        key: 'reviews_content',
        label: "En-tête & Avis Clients",
        fields: [
          { key: 'reviews_badge', label: 'Badge de la page avis', type: 'text', placeholder: "Retours d'Expérience" },
          { key: 'reviews_title', label: 'Titre principal', type: 'text', placeholder: 'Avis de nos Clients' },
          { key: 'reviews_subtitle', label: 'Sous-titre', type: 'textarea', placeholder: "Découvrez les retours d'expérience de conducteurs ayant loué un véhicule avec IZEM MOTORS." },
          { key: 'reviews_rating', label: 'Note moyenne globale', type: 'text', placeholder: '5.0/5' },
        ],
      },
    ],
  },
  {
    key: 'faq',
    label: "Centre d'Aide & FAQ",
    icon: HelpCircle,
    color: '#5AC8FA',
    sections: [
      {
        key: 'faq_content',
        label: 'Questions Fréquentes de Location',
        fields: [
          { key: 'faq_badge', label: "Badge du centre d'aide", type: 'text', placeholder: "Centre d'Aide & FAQ" },
          { key: 'faq_title', label: 'Titre principal', type: 'text', placeholder: 'Questions Fréquentes' },
          { key: 'faq_subtitle', label: 'Description', type: 'textarea', placeholder: 'Retrouvez toutes les précisions sur les conditions de location, le dépôt de caution et les modalités de remise des clés.' },
          { key: 'faq_1_q', label: 'Question 1', type: 'text', placeholder: 'Quels documents faut-il pour louer ?' },
          { key: 'faq_1_a', label: 'Réponse 1', type: 'textarea', placeholder: "Une pièce d'identité valide (passeport ou carte nationale) et votre permis de conduire original en cours de validité. La caution est déposée lors de la remise des clés." },
          { key: 'faq_2_q', label: 'Question 2', type: 'text', placeholder: "La livraison à l'aéroport est-elle vraiment gratuite ?" },
          { key: 'faq_2_a', label: 'Réponse 2', type: 'textarea', placeholder: "Oui. La livraison et le retour de votre véhicule à l'Aéroport d'Alger Houari Boumediene sont entièrement gratuits, 24h/24 et 7j/7 sur réservation." },
          { key: 'faq_3_q', label: 'Question 3', type: 'text', placeholder: 'Y a-t-il un paiement demandé en ligne ?' },
          { key: 'faq_3_a', label: 'Réponse 3', type: 'textarea', placeholder: "Non. Aucun paiement ni numéro de carte bancaire n'est requis sur le site. Le règlement et le dépôt de caution s'effectuent sur place lors de la remise des clés." },
          { key: 'faq_4_q', label: 'Question 4', type: 'text', placeholder: "Quelle est la formule d'assurance incluse ?" },
          { key: 'faq_4_a', label: 'Réponse 4', type: 'textarea', placeholder: "Tous nos véhicules bénéficient d'une assurance tous risques avec assistance 24/7 pour que vous puissiez rouler l'esprit tranquille." },
        ],
      },
    ],
  },
  {
    key: 'conditions',
    label: 'Conditions de Location',
    icon: FileText,
    color: '#FF9500',
    sections: [
      {
        key: 'conditions_content',
        label: 'Conditions Générales de Location',
        fields: [
          { key: 'condition_1_title', label: 'Article 1 — Titre', type: 'text', placeholder: "1. Conditions d'Éligibilité du Conducteur" },
          { key: 'condition_1_text', label: 'Article 1 — Texte', type: 'textarea', placeholder: "Le locataire et tout conducteur autorisé doivent être âgés au minimum de 21 ans (23 ans pour les Berlines et SUV, 25 ans pour la catégorie Premium) et être titulaires d'un permis de conduire valide depuis au moins 1 à 3 ans selon la catégorie du véhicule loué." },
          { key: 'condition_2_title', label: 'Article 2 — Titre', type: 'text', placeholder: '2. Réservation & Confirmation' },
          { key: 'condition_2_text', label: 'Article 2 — Texte', type: 'textarea', placeholder: "Toute demande effectuée via le site Internet constitue une pré-réservation sans paiement immédiat. La réservation ne devient définitive qu'après confirmation écrite émise par IZEM MOTORS par e-mail ou WhatsApp." },
          { key: 'condition_3_title', label: 'Article 3 — Titre', type: 'text', placeholder: '3. Caution & Règlement' },
          { key: 'condition_3_text', label: 'Article 3 — Texte', type: 'textarea', placeholder: "Une caution sous forme de chèque certifié, pré-autorisation de carte bancaire ou espèces est déposée au moment de la prise en charge du véhicule. Cette caution est intégralement restituée à la restitution du véhicule après constat contradictoire de l'état des lieux." },
          { key: 'condition_4_title', label: 'Article 4 — Titre', type: 'text', placeholder: '4. Utilisation du Véhicule' },
          { key: 'condition_4_text', label: 'Article 4 — Texte', type: 'textarea', placeholder: 'Le véhicule doit être conduit sur les voies carrossables autorisées et dans le strict respect du Code de la Route en vigueur en République Algérienne Démocratique et Populaire.' },
        ],
      },
    ],
  },
  {
    key: 'footer_seo',
    label: 'Pied de page & SEO',
    icon: LayoutTemplate,
    color: '#5856D6',
    sections: [
      {
        key: 'reseaux',
        label: 'Réseaux Sociaux & Canaux Directs',
        fields: [
          { key: 'tiktok', label: 'TikTok — Identifiant officiel', type: 'text', placeholder: '@izem.motors', hint: "Compte officiel TikTok de l'agence" },
          { key: 'tiktok_url', label: 'TikTok — Lien profil', type: 'url', placeholder: 'https://www.tiktok.com/@izem.motors/' },
          { key: 'instagram_url', label: 'Instagram — Lien page', type: 'url', placeholder: 'https://www.instagram.com/izem_motors' },
          { key: 'facebook_url', label: 'Facebook — Lien page', type: 'url', placeholder: 'https://www.facebook.com/profile.php?id=61593687483158' },
        ],
      },
      {
        key: 'footer',
        label: 'Pied de page & Identité',
        fields: [
          { key: 'footer_tagline', label: 'Tagline du footer', type: 'text', placeholder: 'IZEM MOTORS · Location de véhicules à Alger et Aéroport Houari Boumediene' },
          { key: 'footer_brand_desc', label: 'Description de marque', type: 'textarea', placeholder: 'Votre partenaire mobilité de confiance à Alger. Flotte récente, livraison aéroport gratuite et assistance continue 24/7.' },
          { key: 'footer_notice', label: 'Mention réservation & règlement', type: 'text', placeholder: 'Zéro paiement en ligne requis · Règlement et caution effectués sur place lors de la prise en charge.' },
        ],
        imageFields: [
          { key: 'logo_url', label: 'Logo officiel IZEM MOTORS', hint: "Logo affiché dans l'en-tête et le pied de page (/images/izem-emblem.png)" },
        ],
      },
      {
        key: 'seo',
        label: 'Référencement Google & Partage Social',
        fields: [
          { key: 'meta_title', label: 'Titre Google (Meta Title)', type: 'text', placeholder: 'IZEM MOTORS | Location de Voiture Alger & Aéroport Houari Boumediene', hint: 'Idéalement 50 à 65 caractères' },
          { key: 'meta_description', label: 'Description Google (Meta Description)', type: 'textarea', placeholder: "Location de voitures récentes à Alger avec IZEM MOTORS. Livraison gratuite Aéroport d'Alger 24/7, assurance tous risques et réservation sans prépaiement.", hint: 'Idéalement 140 à 160 caractères' },
        ],
        imageFields: [
          { key: 'og_image', label: 'Image de partage réseaux sociaux (Open Graph)', hint: 'Format 1200×630 px pour les aperçus WhatsApp, Facebook (/images/hero-fleet-poster.jpg)' },
        ],
      },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminWebsiteInfoPage() {
  const [data, setData] = useState<Record<string, string>>({ ...DEFAULT_SITE_CONFIG })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [activePage, setActivePage] = useState('contact')
  const [activeSection, setActiveSection] = useState('coordonnees')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [contentKey, setContentKey] = useState(0)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadFieldRef = useRef<string | null>(null)

  // Show left sidebar for 2 seconds on initial mobile visit, then auto-fades away so user knows where to change topic
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileNavOpen(true)
      const timer = setTimeout(() => {
        setMobileNavOpen(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  // ─── Load config ─────────────────────────────────────────────────────────
  const loadConfig = useCallback(async () => {
    // 1. Instant local cache for seamless refresh without flicker
    try {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('dzrent_site_config') : null
      if (cached) {
        setData(prev => ({ ...prev, ...JSON.parse(cached) }))
      }
    } catch {}

    try {
      const res = await fetch('/api/admin/site-config?t=' + Date.now(), { cache: 'no-store' })
      if (res.ok) {
        const cfg = await res.json()
        const merged = { ...DEFAULT_SITE_CONFIG, ...cfg }
        setData(merged)
        try {
          localStorage.setItem('dzrent_site_config', JSON.stringify(merged))
        } catch {}
      }
    } catch {
      // use defaults
    }
  }, [])

  useEffect(() => { loadConfig() }, [loadConfig])

  // ─── Save (always saves FULL config) ─────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    const sectionId = `${activePage}:${activeSection}`
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur de sauvegarde')

      if (json.config) {
        setData(prev => ({ ...prev, ...json.config }))
        try {
          localStorage.setItem('dzrent_site_config', JSON.stringify(json.config))
        } catch {}
      }

      setSavedSection(sectionId)
      setTimeout(() => setSavedSection(prev => prev === sectionId ? null : prev), 3500)
      showIosToast('Modifications sauvegardées et synchronisées en direct ✓', 'success')
    } catch (err: any) {
      showIosToast(err.message || 'Erreur lors de la sauvegarde', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ─── Image upload ─────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const fieldKey = uploadFieldRef.current
    if (!file || !fieldKey) return
    e.target.value = ''

    setUploadingKey(fieldKey)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Échec du téléversement')
      const json = await res.json()
      const url = json.url || json.publicUrl || json.path || ''
      setData(prev => ({ ...prev, [fieldKey]: url }))
      showIosToast('Image téléversée ✓', 'success')
    } catch (err: any) {
      showIosToast(err.message || 'Erreur de téléversement', 'error')
    } finally {
      setUploadingKey(null)
      uploadFieldRef.current = null
    }
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
  const navigate = (pageKey: string, sectionKey: string) => {
    setActivePage(pageKey)
    setActiveSection(sectionKey)
    setContentKey(k => k + 1)
    setMobileNavOpen(false) // Auto closes on mobile to reveal editing form
  }

  const currentPage = SITE_PAGES.find(p => p.key === activePage)
  const currentSection = currentPage?.sections.find(s => s.key === activeSection)
  const sectionId = `${activePage}:${activeSection}`

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif' }}
    >
      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ══════════ LEFT SIDEBAR (Overlay on mobile, fixed column on desktop) ══════════ */}
      <div
        className={`flex flex-col shrink-0 overflow-hidden fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ease-out shadow-2xl md:shadow-none ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          width: 275,
          background: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
        }}
      >
        {/* Sidebar header */}
        <div
          className="shrink-0"
          style={{ padding: '16px 16px 14px', borderBottom: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: '#94A3B8',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                CMS du site
              </p>
              <h2
                style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}
              >
                Infos du site
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={loadConfig}
                disabled={loading}
                title="Actualiser depuis le serveur"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RefreshCw
                  className={loading ? 'animate-spin' : ''}
                  style={{ width: 13, height: 13, color: '#64748B' }}
                />
              </button>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 md:hidden transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live badge */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0 animate-pulse" />
            <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>Site en ligne</span>
            <ExternalLink style={{ width: 10, height: 10, color: '#047857' }} />
          </a>
        </div>

        {/* Pages list */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0' }}>
          {SITE_PAGES.map((page) => {
            const PageIcon = page.icon
            const isActive = activePage === page.key

            return (
              <div key={page.key} className="mb-1">
                {/* Page button */}
                <button
                  onClick={() => {
                    const first = page.sections[0]
                    if (first) navigate(page.key, first.key)
                  }}
                  className="ios-page-nav-btn group"
                  data-active={isActive}
                >
                  <div
                    className="ios-icon-box"
                    style={{
                      background: isActive ? '#FFFFFF' : '#F1F5F9',
                    }}
                  >
                    <PageIcon
                      style={{ width: 13, height: 13, color: isActive ? '#0F172A' : '#64748B' }}
                    />
                  </div>
                  <span className="ios-page-title">
                    {page.label}
                  </span>
                  <ChevronRight
                    className="ios-chevron"
                    style={{
                      transform: isActive ? 'rotate(90deg)' : 'none',
                    }}
                  />
                </button>

                {/* Sections — animated expand */}
                <div
                  style={{
                    maxHeight: isActive ? `${page.sections.length * 44}px` : '0px',
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.38s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease',
                  }}
                >
                  {page.sections.map((section) => {
                    const isSectionActive = isActive && activeSection === section.key
                    const wasSaved = savedSection === `${page.key}:${section.key}`
                    return (
                      <button
                        key={section.key}
                        onClick={() => navigate(page.key, section.key)}
                        className="ios-sub-nav-btn group"
                        data-active={isSectionActive}
                      >
                        <span
                          className="ios-dot"
                          style={{
                            background: isSectionActive ? page.color : '#CBD5E1',
                          }}
                        />
                        <span className="ios-sub-title">
                          {section.label}
                        </span>
                        {wasSaved && (
                          <Check style={{ width: 11, height: 11, color: '#10B981' }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div
          className="shrink-0 text-center"
          style={{ padding: '10px 14px', borderTop: '1px solid #F1F5F9' }}
        >
          <p style={{ fontSize: 9.5, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Modifications en direct sur le site
          </p>
        </div>
      </div>

      {/* ══════════ RIGHT CONTENT ══════════ */}
      <div className="flex-1 overflow-y-auto w-full" style={{ background: '#F5F5F7' }}>
        {/* Mobile Top Bar — Topic Switcher & Quick Save */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md sticky top-0 z-30 gap-2">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#0F172A] text-xs font-semibold border border-slate-200 truncate min-w-0"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{currentPage?.label} · {currentSection?.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-md bg-[#0F172A] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            <span>Sauvegarder</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
            <Loader2 className="w-7 h-7 animate-spin text-[#0F172A]" />
            <p style={{ fontSize: 13, color: '#64748B' }}>Chargement de la configuration...</p>
          </div>
        ) : !currentSection ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
            <Sparkles style={{ width: 28, height: 28, color: '#94A3B8' }} />
            <p style={{ fontSize: 13, color: '#64748B' }}>Sélectionnez une section</p>
          </div>
        ) : (
          <div
            key={contentKey}
            className="p-4 sm:p-6 md:p-8 max-w-5xl"
            style={{ animation: 'wInfoFadeUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both' }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              <span style={{ fontSize: 12, color: '#64748B' }}>{currentPage?.label}</span>
              <ChevronRight style={{ width: 11, height: 11, color: '#94A3B8' }} />
              <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 600 }}>{currentSection.label}</span>
            </div>

            {/* Section title + top save */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    marginBottom: 4,
                  }}
                >
                  {currentSection.label}
                </h1>
                <p style={{ fontSize: 12.5, color: '#64748B' }}>
                  Page{' '}
                  <strong style={{ color: '#0F172A' }}>
                    {currentPage?.label}
                  </strong>{' '}
                  · Les modifications sont enregistrées dans Supabase et propagées sur le site en direct.
                </p>
              </div>
              <SaveButton
                saving={saving}
                saved={savedSection === sectionId}
                onSave={handleSave}
              />
            </div>

            {/* Split layout: fields LEFT, images RIGHT — stacked on mobile */}
            <div
              className={`grid gap-5 ${(currentSection.imageFields?.length ?? 0) > 0 ? 'grid-cols-1 lg:grid-cols-[1fr_320px]' : 'grid-cols-1'}`}
            >
              {/* TEXT FIELDS */}
              <div
                className="rounded-[24px] p-6 sm:p-8 space-y-5"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02), 0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 12px 32px -4px rgba(15, 23, 42, 0.025)',
                }}
              >
                {currentSection.fields.map((field) => (
                  <FieldRow
                    key={field.key}
                    field={field}
                    value={data[field.key] ?? ''}
                    onChange={(val) => setData(prev => ({ ...prev, [field.key]: val }))}
                  />
                ))}

                {/* Bottom save for longer sections */}
                {currentSection.fields.length > 3 && (
                  <div className="pt-2 flex justify-end">
                    <SaveButton
                      saving={saving}
                      saved={savedSection === sectionId}
                      onSave={handleSave}
                      compact
                    />
                  </div>
                )}
              </div>

              {/* IMAGE FIELDS */}
              {(currentSection.imageFields?.length ?? 0) > 0 && (
                <div className="space-y-4">
                  {currentSection.imageFields!.map((imgField) => (
                    <div
                      key={imgField.key}
                      className="rounded-[24px] p-5 transition-all duration-200 group"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #DFE3E8',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: '#64748B',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 10,
                        }}
                      >
                        {imgField.label}
                      </p>

                      {/* Preview or placeholder */}
                      {data[imgField.key] ? (
                        <div
                          className="relative rounded-xl overflow-hidden mb-3 group/img"
                          style={{ aspectRatio: '16/10', background: '#F1F5F9' }}
                        >
                          <img
                            src={data[imgField.key]}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                          <button
                            onClick={() => setData(prev => ({ ...prev, [imgField.key]: '' }))}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 hover:bg-red-500 cursor-pointer"
                            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
                            title="Supprimer l'image"
                          >
                            <X style={{ width: 13, height: 13, color: '#fff' }} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            uploadFieldRef.current = imgField.key
                            fileInputRef.current?.click()
                          }}
                          className="w-full rounded-xl flex flex-col items-center justify-center gap-2 mb-3 transition-all duration-200 hover:border-[#0F172A] hover:bg-slate-50 cursor-pointer"
                          style={{
                            aspectRatio: '16/10',
                            border: '1.5px dashed #CBD5E1',
                            background: '#F8FAFC',
                          }}
                        >
                          {uploadingKey === imgField.key ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#0F172A]" />
                          ) : (
                            <>
                              <ImageIcon className="w-6 h-6 text-[#94A3B8] transition-all duration-200 group-hover:scale-110 group-hover:text-[#0F172A]" />
                              <p className="text-[11.5px] text-[#64748B] font-medium">
                                Cliquer pour téléverser
                              </p>
                            </>
                          )}
                        </button>
                      )}

                      {/* URL input */}
                      <input
                        type="text"
                        value={data[imgField.key] ?? ''}
                        onChange={e => setData(prev => ({ ...prev, [imgField.key]: e.target.value }))}
                        placeholder="Ou coller une URL d'image..."
                        className="ios-field-input !py-2 !text-xs !mb-2.5"
                      />

                      <button
                        onClick={() => {
                          uploadFieldRef.current = imgField.key
                          fileInputRef.current?.click()
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all duration-200 bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A] border border-slate-200 font-semibold cursor-pointer"
                        style={{
                          fontSize: 11.5,
                        }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        Téléverser
                      </button>

                      {imgField.hint && (
                        <p style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 7, lineHeight: 1.4 }}>
                          {imgField.hint}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AVIS CLIENTS PACKABLE ACCORDION MANAGER */}
            {activePage === 'avis' && (
              <div className="mt-6">
                <ReviewsAccordionManager
                  data={data}
                  setData={setData}
                  saving={saving}
                  onSave={handleSave}
                  saved={savedSection === sectionId}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <style>{`
        @keyframes wInfoFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Apple iOS Fluid Sidebar Selection & Hover Styles ── */
        .ios-page-nav-btn {
          width: calc(100% - 16px);
          margin: 3px 8px;
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          user-select: none;
          transition: all 0.18s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .ios-page-nav-btn:hover {
          background: #F1F5F9;
        }
        .ios-page-nav-btn:active {
          transform: scale(0.98);
        }
        .ios-page-nav-btn[data-active="true"] {
          background: #0F172A;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .ios-icon-box {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }
        .ios-page-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          flex: 1;
          text-align: left;
          transition: color 0.15s ease;
        }
        .ios-page-nav-btn:hover .ios-page-title {
          color: #0F172A;
        }
        .ios-page-nav-btn[data-active="true"] .ios-page-title {
          color: #FFFFFF;
          font-weight: 600;
        }
        .ios-chevron {
          width: 13px;
          height: 13px;
          color: #94A3B8;
          transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .ios-page-nav-btn:hover .ios-chevron {
          color: #0F172A;
        }
        .ios-page-nav-btn[data-active="true"] .ios-chevron {
          color: #FFFFFF;
        }

        /* Sub-navigation buttons */
        .ios-sub-nav-btn {
          width: calc(100% - 24px);
          margin: 2px 12px 2px 28px;
          padding: 6px 10px 6px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          user-select: none;
          transition: all 0.15s ease;
        }
        .ios-sub-nav-btn:hover {
          background: #F8FAFC;
        }
        .ios-sub-nav-btn[data-active="true"] {
          background: #F1F5F9;
        }
        .ios-dot {
          width: 6px;
          height: 6px;
          border-radius: 99px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .ios-sub-title {
          font-size: 12px;
          color: #64748B;
          font-weight: 450;
          flex: 1;
          text-align: left;
          transition: color 0.15s ease;
        }
        .ios-sub-nav-btn:hover .ios-sub-title {
          color: #0F172A;
        }
        .ios-sub-nav-btn[data-active="true"] .ios-sub-title {
          color: #0F172A;
          font-weight: 600;
        }

        /* Form inputs & textareas */
        .ios-field-input {
          width: 100%;
          padding: 9px 13px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          color: #0F172A;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ios-field-input:hover {
          border-color: #94A3B8;
        }
        .ios-field-input:focus {
          border-color: #0F172A;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }

        /* Save Button Hover */
        .ios-save-btn {
          transition: all 0.15s ease;
        }
        .ios-save-btn:hover:not(:disabled) {
          filter: brightness(1.15);
        }
        .ios-save-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: { key: string; label: string; type: string; placeholder?: string; hint?: string }
  value: string
  onChange: (v: string) => void
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="group">
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          color: isFocused ? '#0F172A' : '#64748B',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 6,
          transition: 'color 0.15s ease',
        }}
      >
        {field.label}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="ios-field-input"
          style={{ resize: 'vertical', lineHeight: 1.6 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="ios-field-input"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}

      {field.hint && (
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 5, lineHeight: 1.45 }}>
          {field.hint}
        </p>
      )}
    </div>
  )
}

function SaveButton({
  saving,
  saved,
  onSave,
  compact = false,
}: {
  saving: boolean
  saved: boolean
  onSave: () => void
  compact?: boolean
}) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="ios-save-btn flex items-center gap-2 rounded-[8px] font-semibold shrink-0 cursor-pointer shadow-xs"
      style={{
        padding: compact ? '7px 16px' : '9px 20px',
        fontSize: compact ? 12 : 13,
        background: saved ? '#10B981' : '#0F172A',
        color: '#FFFFFF',
        border: 'none',
        opacity: saving ? 0.7 : 1,
        letterSpacing: '-0.01em',
      }}
    >
      {saving ? (
        <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />
      ) : saved ? (
        <Check style={{ width: 14, height: 14 }} />
      ) : (
        <Save style={{ width: 14, height: 14 }} />
      )}
      {saving ? 'Sauvegarde...' : saved ? 'Synchronisé ✓' : 'Sauvegarder'}
    </button>
  )
}

function ReviewsAccordionManager({
  data,
  setData,
  saving,
  onSave,
  saved,
}: {
  data: Record<string, string>
  setData: React.Dispatch<React.SetStateAction<Record<string, string>>>
  saving: boolean
  onSave: () => void
  saved: boolean
}) {
  const reviews = parseReviews(data)
  const [isDrawerMounted, setIsDrawerMounted] = useState(false)
  const [isDrawerActive, setIsDrawerActive] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const modalBodyRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 8

  const openDrawer = () => {
    setIsDrawerMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerActive(true)
      })
    })
  }

  const closeDrawer = () => {
    setIsDrawerActive(false)
    setTimeout(() => {
      setIsDrawerMounted(false)
    }, 320)
  }

  // Prevent background website scrolling while drawer is open
  useEffect(() => {
    if (!isDrawerMounted) return
    const originalBody = document.body.style.overflow
    const originalHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = originalBody
      document.documentElement.style.overflow = originalHtml
      window.removeEventListener('keydown', onKey)
    }
  }, [isDrawerMounted])

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      r.author.toLowerCase().includes(q) ||
      (r.vehicle && r.vehicle.toLowerCase().includes(q)) ||
      r.text.toLowerCase().includes(q)
    )
  })

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateReviews = (newList: ReviewItem[]) => {
    const json = JSON.stringify(newList)
    setData(prev => {
      const next: Record<string, string> = { ...prev, reviews_items_json: json }
      for (let i = 1; i <= 20; i++) {
        delete next[`review_${i}_author`]
        delete next[`review_${i}_vehicle`]
        delete next[`review_${i}_text`]
      }
      newList.forEach((r, idx) => {
        next[`review_${idx + 1}_author`] = r.author
        next[`review_${idx + 1}_vehicle`] = r.vehicle
        next[`review_${idx + 1}_text`] = r.text
      })
      return next
    })
  }

  const handleAddReview = () => {
    const newId = 'rev_' + Date.now()
    const newReview: ReviewItem = {
      id: newId,
      author: '',
      vehicle: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      text: '',
    }
    const updated = [newReview, ...reviews]
    updateReviews(updated)
    setOpenId(newId)
    setSearchQuery('')
    setCurrentPage(1)
    openDrawer()
    setTimeout(() => {
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 200)
    showIosToast('Nouvel avis ajouté au sommet — complétez les détails puis sauvegardez', 'info')
  }

  const handleDeleteReview = async (id: string) => {
    const target = reviews.find(r => r.id === id)
    const authorName = target?.author || 'cet avis'
    const confirmed = await showIosConfirm({
      title: 'Supprimer l\'avis ?',
      message: `Voulez-vous supprimer définitivement l'avis de ${authorName} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDestructive: true,
    })
    if (!confirmed) return

    const updated = reviews.filter(r => r.id !== id)
    updateReviews(updated)
    if (openId === id) {
      setOpenId(null)
    }
    showIosToast(`${authorName} a été supprimé`, 'info')
  }

  const handleItemChange = (id: string, patch: Partial<ReviewItem>) => {
    const updated = reviews.map(r => r.id === id ? { ...r, ...patch } : r)
    updateReviews(updated)
  }

  return (
    <div className="space-y-3">
      {/* ── Top bar: Header & small "Ajouter un avis" button ── */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider m-0">
            Base d&apos;avis Google
          </h3>
          <p className="text-[11.5px] text-slate-500 m-0">
            {reviews.length} témoignages vérifiés connectés au site
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddReview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un avis</span>
        </button>
      </div>

      {/* ── Cool small shape: Google Reviews Card (iOS Widget Style) ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={openDrawer}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openDrawer()
          }
        }}
        className="group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md hover:scale-[1.004] active:scale-[0.996]"
        style={{
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02), 0 4px 16px -2px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Google Reviews Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-amber-300 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  {reviews.length} Avis Clients Google
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  5,0 / 5
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal m-0 truncate">
                Fiche officielle Google Maps · Cliquez pour ouvrir le panneau latéral de gestion
              </p>
            </div>
          </div>

          {/* Action pill on shape */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-2xs">
              <span>Gérer les {reviews.length} avis</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* ── CRM Right-Side Slide-Over Drawer (Ignoring background on the left) ── */}
      {isDrawerMounted && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Backdrop (Left side ignored background effect with blur and dimming) */}
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer ${
              isDrawerActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Slide-over Drawer Panel */}
          <div
            className={`fixed inset-y-0 right-0 max-w-full flex w-full sm:max-w-2xl lg:max-w-3xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isDrawerActive ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ willChange: 'transform' }}
          >
            <div
              className="w-full h-full bg-white border-l border-slate-200/90 shadow-[-24px_0_60px_-15px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden text-slate-900 overscroll-contain"
              style={{ overscrollBehavior: 'contain' }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* ── CRM Drawer Header ── */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white shrink-0">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight m-0">
                          Gestion des Avis Clients
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                          {reviews.length} avis · 5,0/5 ★
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal m-0 truncate">
                        Fiche officielle Google Maps · Cliquez sur un avis pour l&apos;éditer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleAddReview}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ajouter un avis</span>
                    </button>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      aria-label="Fermer la fenêtre latérale d'avis"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#F8FAFC] border border-slate-200 shadow-2xs">
                  <input
                    type="text"
                    placeholder="Rechercher par client, modèle ou mot-clé..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-2 py-1 text-xs bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  <span className="text-[11px] font-medium text-slate-400 shrink-0 pr-2">
                    {filteredReviews.length} avis · Page {safePage}/{totalPages}
                  </span>
                </div>
              </div>

            {/* ── Modal Window Scrollable Body ── */}
            <div
              ref={modalBodyRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F8FAFC] overscroll-contain"
              style={{ overscrollBehavior: 'contain' }}
              onWheel={(e) => e.stopPropagation()}
            >
              {paginatedReviews.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 mb-3">
                    {searchQuery ? 'Aucun avis ne correspond à votre recherche.' : 'Aucun avis client répertorié pour le moment.'}
                  </p>
                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={handleAddReview}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Créer le premier avis</span>
                    </button>
                  )}
                </div>
              ) : (
                paginatedReviews.map((rev, pageIdx) => {
                  const index = startIndex + pageIdx
                  const isOpen = openId === rev.id

                  return (
                    <div
                      key={rev.id}
                      className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-2 border-slate-900/15 bg-white shadow-sm ring-1 ring-slate-900/5'
                          : 'border border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                      }`}
                    >
                      {/* Packable Header Row */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setOpenId(isOpen ? null : rev.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setOpenId(isOpen ? null : rev.id)
                          }
                        }}
                        className="p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200/70 shrink-0">
                            Avis #{index + 1}
                          </span>

                          <span className="font-bold text-sm text-slate-900 truncate">
                            {rev.author || <span className="text-slate-400 font-normal italic">Nouveau client (sans nom)</span>}
                          </span>

                          {rev.vehicle && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 truncate max-w-[140px] sm:max-w-[200px]">
                              {rev.vehicle}
                            </span>
                          )}

                          <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                                }`}
                              />
                            ))}
                          </div>

                          {!isOpen && rev.text && (
                            <span className="text-xs text-slate-500 truncate max-w-[220px] md:max-w-[340px] hidden sm:inline-block">
                              &ldquo;{rev.text}&rdquo;
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rev.date && (
                            <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
                              {rev.date}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteReview(rev.id)
                            }}
                            title="Supprimer cet avis"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400">
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-slate-900' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Form View */}
                      {isOpen && (
                        <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50 space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nom du client
                              </label>
                              <input
                                type="text"
                                value={rev.author}
                                onChange={(e) => handleItemChange(rev.id, { author: e.target.value })}
                                placeholder="Ex: Karim B."
                                className="ios-field-input"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Véhicule loué
                              </label>
                              <input
                                type="text"
                                value={rev.vehicle}
                                onChange={(e) => handleItemChange(rev.id, { vehicle: e.target.value })}
                                placeholder="Ex: Volkswagen T-Cross"
                                className="ios-field-input"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Note attribuée ({rev.rating || 5}/5)
                              </label>
                              <div className="flex items-center gap-1 py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleItemChange(rev.id, { rating: star })}
                                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                                    title={`${star} étoile${star > 1 ? 's' : ''}`}
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        star <= (rev.rating || 5)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="text-xs font-bold text-slate-700 ml-2 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                                  {rev.rating || 5} / 5 étoiles
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Date du retour / location
                              </label>
                              <input
                                type="text"
                                value={rev.date || ''}
                                onChange={(e) => handleItemChange(rev.id, { date: e.target.value })}
                                placeholder="Ex: 2026-09-15"
                                className="ios-field-input"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Commentaire / Témoignage client
                            </label>
                            <textarea
                              rows={3}
                              value={rev.text}
                              onChange={(e) => handleItemChange(rev.id, { text: e.target.value })}
                              placeholder="Rédigez l'avis ou collez le retour client reçu..."
                              className="ios-field-input"
                              style={{ resize: 'vertical', lineHeight: 1.6 }}
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setOpenId(null)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              Replier cet avis ▲
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* ── Static Bottom Footer Bar (Pinned at exact same height - NO JUMPING!) ── */}
            <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:px-6 flex items-center justify-between gap-3 z-10 shadow-xs">
              {/* Previous button (Fixed width: w-24 sm:w-28) */}
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => goToPage(Math.max(1, safePage - 1))}
                className="w-24 sm:w-28 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shrink-0 text-center"
              >
                ← Précédent
              </button>

              {/* Static Page indicator & windowed page buttons */}
              <div className="flex items-center justify-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg shrink-0">
                  Page {safePage} / {totalPages}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline truncate">
                  ({startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredReviews.length)} sur {filteredReviews.length})
                </span>
              </div>

              {/* Next button (Fixed width: w-24 sm:w-28) */}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
                className="w-24 sm:w-28 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shrink-0 text-center"
              >
                Suivant →
              </button>

              {/* Save inside modal */}
              <div className="hidden sm:block pl-2 border-l border-slate-200 shrink-0">
                <SaveButton
                  saving={saving}
                  saved={saved}
                  onSave={onSave}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
      )}
    </div>
  )
}

