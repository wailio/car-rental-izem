// ─── IZEM MOTORS · FAQ Register ────────────────────────────────────────────────
// Governed by docs/redesign/03-BRAND-AND-CONTENT.md
// Authentic, helpful answers in clear French.

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'reservation' | 'conditions' | 'aeroport' | 'paiement';
}

export const faqItems: FAQItem[] = [
  {
    id: 'documents',
    category: 'conditions',
    question: "Quels documents faut-il pour louer ?",
    answer: "Une pièce d'identité valide (passeport ou carte nationale) et votre permis de conduire original en cours de validité. La caution est déposée lors de la remise des clés.",
  },
  {
    id: 'aeroport-gratuit',
    category: 'aeroport',
    question: "La livraison à l'aéroport est-elle vraiment gratuite ?",
    answer: "Oui. La livraison et le retour de votre véhicule à l'Aéroport d'Alger Houari Boumediene sont entièrement gratuits, 24h/24 et 7j/7 sur réservation.",
  },
  {
    id: 'duree-tarifs',
    category: 'reservation',
    question: "Peut-on louer à la journée, à la semaine ou au mois ?",
    answer: "Oui. Nous proposons des locations de courte, moyenne et longue durée avec des tarifs dégressifs selon la période choisie.",
  },
  {
    id: 'panne-assistance',
    category: 'conditions',
    question: "Que se passe-t-il en cas de panne ou d'imprévu sur la route ?",
    answer: "Notre assistance routière est joignable 24h/24 et 7j/7. Un simple appel ou message WhatsApp permet une prise en charge rapide partout où vous vous trouvez.",
  },
  {
    id: 'paiement-en-ligne',
    category: 'paiement',
    question: "Y a-t-il un paiement demandé en ligne ?",
    answer: "Non. Aucun paiement ni numéro de carte bancaire n'est requis sur le site. Le règlement et le dépôt de caution s'effectuent sur place lors de la remise des clés.",
  },
  {
    id: 'age-permis',
    category: 'conditions',
    question: "Quel est l'âge minimum et l'ancienneté de permis requise ?",
    answer: "Les conditions dépendent de la catégorie du véhicule (dès 21 ans et 1 an de permis pour les économiques). Les critères précis sont affichés en toute transparence sur chaque fiche modèle.",
  },
  {
    id: 'prolongation',
    category: 'reservation',
    question: "Comment modifier ou prolonger ma réservation ?",
    answer: "Contactez-nous directement par WhatsApp ou par téléphone dès que vous souhaitez modifier vos dates. La prolongation est accordée selon la disponibilité du véhicule.",
  },
  {
    id: 'assurance',
    category: 'conditions',
    question: "Quelle est la formule d'assurance incluse ?",
    answer: "Tous nos véhicules bénéficient d'une assurance tous risques avec assistance 24/7 pour que vous puissiez rouler l'esprit tranquille.",
  },
];
