const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/lib/site-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// 1. Add import at the top
if (!content.includes("import { REVIEWS_DATA } from '@/content/reviews-data'")) {
  content = `import { REVIEWS_DATA } from '@/content/reviews-data';\n` + content;
}

// 2. Replace the massive DEFAULT_REVIEWS array with REVIEWS_DATA
const startMarker = 'export const DEFAULT_REVIEWS: ReviewItem[] = [';
const endMarker = 'export const DEFAULT_SITE_CONFIG: SiteConfig = {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in site-config.ts');
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

let newContent = before + 'export const DEFAULT_REVIEWS: ReviewItem[] = REVIEWS_DATA;\n\n' + after;

// 3. Update reviews_subtitle
newContent = newContent.replace(
  "reviews_subtitle: '136 avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.',",
  "reviews_subtitle: '70 avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.',"
);

// 4. Update review_1, review_2, review_3 in DEFAULT_SITE_CONFIG
const oldReviewsBlock = `  review_1_author: 'Nesrine Zerfaoui',
  review_1_vehicle: 'Audi A3 Sportback',
  review_1_text: "J’ai eu le plaisir de louer une voiture de chez IZEM MOTORS : professionnalisme exemplaire masha’Allah, la voiture était d’une propreté irréprochable, parfaitement entretenue et dans un état impeccable. Mais ce qui fait véritablement la différence, c’est la qualité humaine ! Ibrahim ainsi que toute son équipe m’ont accueillie avec le sourire, une grande gentillesse et un profond sens du service.",
  review_2_author: 'Boombino',
  review_2_vehicle: 'Geely Coolray',
  review_2_text: "Excellent service ! L'équipe est très professionnelle, accueillante et toujours à l'écoute. La voiture était propre, en parfait état et conforme à la réservation. Les prix sont raisonnables et les démarches sont simples et rapides. Je recommande vivement cette agence de location de voitures.",
  review_3_author: 'SoCappie',
  review_3_vehicle: 'Volkswagen T-Cross',
  review_3_text: "Expérience tout simplement EXCEPTIONNELLE ! J’ai loué un véhicule pendant mon séjour à Alger et tout était parfait. La voiture était impeccable, propre et récente. Le service client est irréprochable : ponctualité à l'aéroport, gentillesse et professionnalisme au rendez-vous.",`;

const newReviewsBlock = `  review_1_author: 'Abderrahim ZEMMOUR',
  review_1_vehicle: 'Volkswagen T-Cross',
  review_1_text: "Très bonne expérience ! Service sérieux, voiture propre et en très bon état. Équipe sympathique et professionnelle. Merci pour votre accueil et votre confiance, je recommande à 100% !",
  review_2_author: 'Chimene',
  review_2_vehicle: 'Geely Coolray',
  review_2_text: "Très bonne expérience chez Izem motors. Service rapide et efficace je recommande fortement !! Les voitures sont parfaites et le personnel super gentil et professionnel. Je suis très satisfaite de la voiture j’ai pu renouveler pleins de fois mon contrat de location grâce a leur réactivité . Merci bcp !!",
  review_3_author: 'Nadia Bouzid',
  review_3_vehicle: 'Audi A3 Sportback',
  review_3_text: "Je suis très satisfaite de cette location. Tout s’est très bien passé du début à la fin. Le véhicule était propre, confortable, en très bon état et parfaitement conforme à la description. La prise en charge s’est déroulée avec ponctualité et courtoisie.",`;

if (newContent.includes(oldReviewsBlock)) {
  newContent = newContent.replace(oldReviewsBlock, newReviewsBlock);
} else {
  console.log('Notice: exact old reviews block not matched, searching with regex or substrings');
  // Fallback replace
  newContent = newContent.replace(/review_1_author:\s*'[^']+'/, "review_1_author: 'Abderrahim ZEMMOUR'");
  newContent = newContent.replace(/review_1_vehicle:\s*'[^']+'/, "review_1_vehicle: 'Volkswagen T-Cross'");
  newContent = newContent.replace(/review_1_text:\s*"[^"]+"/, 'review_1_text: "Très bonne expérience ! Service sérieux, voiture propre et en très bon état. Équipe sympathique et professionnelle. Merci pour votre accueil et votre confiance, je recommande à 100% !"');
  newContent = newContent.replace(/review_2_author:\s*'[^']+'/, "review_2_author: 'Chimene'");
  newContent = newContent.replace(/review_2_vehicle:\s*'[^']+'/, "review_2_vehicle: 'Geely Coolray'");
  newContent = newContent.replace(/review_2_text:\s*"[^"]+"/, 'review_2_text: "Très bonne expérience chez Izem motors. Service rapide et efficace je recommande fortement !! Les voitures sont parfaites et le personnel super gentil et professionnel. Je suis très satisfaite de la voiture j’ai pu renouveler pleins de fois mon contrat de location grâce a leur réactivité . Merci bcp !!"');
  newContent = newContent.replace(/review_3_author:\s*'[^']+'/, "review_3_author: 'Nadia Bouzid'");
  newContent = newContent.replace(/review_3_vehicle:\s*'[^']+'/, "review_3_vehicle: 'Audi A3 Sportback'");
  newContent = newContent.replace(/review_3_text:\s*"[^"]+"/, 'review_3_text: "Je suis très satisfaite de cette location. Tout s’est très bien passé du début à la fin. Le véhicule était propre, confortable, en très bon état et parfaitement conforme à la description. La prise en charge s’est déroulée avec ponctualité et courtoisie."');
}

fs.writeFileSync(configPath, newContent, 'utf8');
console.log('Successfully updated site-config.ts!');
