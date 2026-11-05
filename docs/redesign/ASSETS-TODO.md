# ASSETS-TODO.md — DZ Rent Car

Fichiers manquants à fournir par le client pour compléter le design.
Sans ces fichiers, les sections correspondantes restent masquées ou en mode fallback.

---

## Vidéo (H7 — VideoSection)

| Statut | Fichier | Détail |
|---|---|---|
| ❌ MANQUANT | Vidéo horizontale (16:9) | Montage : livraison au terminal, intérieur voiture, route. Durée idéale : 30–90 s. Formats acceptés : MP4 H.265 ou WebM AV1. Hébergement recommandé : Cloudflare Stream ou Mux. |
| ❌ MANQUANT | Poster vidéo HD | Image statique affichée avant le clic. Déjà présent `/images/intro-video-bg.jpg` mais à vérifier — remplacer par 1920 × 1080 px minimum si nécessaire. |
| ⚠️ OPTIONNEL | TikTok clips (vertical 9:16) | Si pas de vidéo horizontale : 4 clips TikTok embarqués + bouton « Suivez-nous ». Fournir les URLs TikTok des vidéos. |

**Action** : régler `HAS_VIDEO = true` dans `src/components/home/VideoSection.tsx` et fournir l'URL de la vidéo hébergée.

---

## Photos (général)

| Statut | Fichier | Détail |
|---|---|---|
| ⚠️ À vérifier | `/cars/volkswagen-tiguan.jpg` | Utilisé dans WhyChooseUsSection — vérifier qu'il s'agit bien d'un véhicule de la flotte réelle. |
| ⚠️ À vérifier | `/cars/peugeot-2008.jpg` | Idem — vérifier authenticité. |
| ⚠️ À vérifier | `/cars/hero-volkswagen-golf-7.png` | Utilisé dans HeroSection — cutout transparent fond, bonne qualité ? |
| ❌ MANQUANT | Photo hero nuit (fond du cadre) | Photo réelle nuit Alger / aéroport pour fond du héros. Actuellement : fond dégradé CSS. |

---

## Logo

| Statut | Fichier | Détail |
|---|---|---|
| ✅ PRÉSENT | `/images/dz-rent-car-logo.png` | Logo existant utilisé. Si une version SVG ou haute résolution existe, la fournir. |

---

## Réseaux sociaux

| Statut | Champ | Valeur actuelle |
|---|---|---|
| ⚠️ À confirmer | TikTok handle | Référencé dans Footer mais URL non confirmée — TODO:CLIENT |
| ✅ Confirmé | WhatsApp | `213555333316` |
| ⚠️ À confirmer | Instagram | `instagram.com/dzrentcar` — vérifier handle exact |
| ⚠️ À confirmer | Facebook | `facebook.com/dzrentcar` — vérifier handle exact |

---

_Mis à jour : 2026-10-15 · Phase 3_
