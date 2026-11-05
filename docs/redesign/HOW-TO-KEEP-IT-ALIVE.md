# Comment préserver l'expérience "Arrivée. Calme. Vivant."
## Guide d'ingénierie & design pour les ajouts futurs

Ce guide s'adresse à tout développeur ou designer souhaitant ajouter de nouvelles pages ou sections au site **DZ Rent Car**, sans casser l'esprit luxueux, calme et réactif du projet.

---

### 1. La philosophie en trois mots

- **Arrivée** : Vous atterrissez de nuit à Alger. La voiture est prête. C'est le soulagement d'un service maîtrisé, discret, sans agitation.
- **Calme** : Des fonds très sombres (`--night-950`), un contraste doux (`--ivory-dim`), de grands espaces verticaux (`clamp(4rem, 8vw, 8rem)`). Une seule source de lumière chaude par écran (notre or `--gold`).
- **Vivant** : L'interface réagit sous le doigt et la souris avec une physique naturelle (décélération `expo.out`, élasticité contrôlée, absence totale d'à-coups).

---

### 2. Les 6 commandements techniques

#### 1. Zéro couleur en dur dans le code
N'écrivez **jamais** de code hexadécimal (`#FF3600`, `#C2A56B`, `#FFFFFF`, etc.) dans vos balises ou styles.
Utilisez exclusivement les tokens CSS :
- Or : `var(--gold)`, `var(--gold-hi)`, `rgba(194,165,107,.12)`
- Nuit : `var(--night-950)`, `var(--night-900)`, `var(--night-850)`, `var(--night-800)`
- Ivoire : `var(--ivory)`, `var(--ivory-dim)`, `var(--ivory-mute)`
- Statut vert : `var(--ok)`
- Bordures : `1px solid rgba(255,255,255,.07)` ou `1px solid rgba(194,165,107,.25)`

#### 2. Jamais de `transition: all`
N'animez que les propriétés physiques : `transform`, `opacity`, `clip-path` ou `color`/`border-color`.
- Mauvais : `transition: all 0.3s ease`
- Bon : `transition: transform var(--dur-hover) var(--ease-out-strong), border-color var(--dur-hover) var(--ease-out-strong)`

#### 3. Jamais d'entrée en `ease-in`
Les entrées commencent à vitesse maximale et décélèrent doucement (`var(--ease-out-strong)` : `cubic-bezier(.16, 1, .3, 1)`).
Les éléments apparaissent à `scale(.95)` ou avec un décalage vertical `y: 20px`, jamais depuis l'infini.

#### 4. Le contenu n'attend pas JavaScript
Le héros et les textes essentiels doivent être lisibles dès le HTML initial. Si le JS plante ou prend du temps sur mobile 3G, l'utilisateur voit immédiatement l'offre et peut téléphoner.

#### 5. Respect du mobile et du tactile
Sur écran tactile (`@media (hover: none)` ou `pointer: coarse`) :
- Désactiver les effets magnétiques et le suiveur de curseur.
- Conserver le scroll natif sans inertie artificielle forcée.
- Les zones de clic doivent faire au moins 44×44 px.

#### 6. Respect de `prefers-reduced-motion`
Pour les utilisateurs sensibles au mouvement, toutes les transitions doivent être immédiates :
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 3. Anatomie d'un nouveau composant de section

```tsx
"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function NouvelleSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(4rem, 8vw, 8rem) var(--gutter)",
        maxWidth: "var(--container)",
        margin: "0 auto",
      }}
    >
      {/* Label de section */}
      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-body)",
          fontSize: "var(--fs-micro)",
          textTransform: "uppercase",
          letterSpacing: ".14em",
          color: "var(--gold)",
          border: "1px solid rgba(194,165,107,.3)",
          background: "rgba(194,165,107,.06)",
          borderRadius: "var(--r-pill)",
          padding: ".3rem .9rem",
          marginBottom: "1rem",
        }}
      >
        Titre de catégorie
      </span>

      {/* Titre éditorial */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--fs-h2)",
          color: "var(--ivory)",
          lineHeight: 1.1,
          marginBottom: "2rem",
        }}
      >
        Titre élégant en <span style={{ color: "var(--gold)", fontStyle: "italic" }}>italique</span>
      </h2>

      {/* Grille de cartes réactives */}
      <div
        data-reveal="fade-up"
        style={{
          background: "var(--night-850)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: "var(--r-xl)",
          padding: "clamp(1.5rem, 4vw, 3rem)",
          transition: "border-color var(--dur-hover) var(--ease-out-strong)",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(194,165,107,.3)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)")}
      >
        {/* Contenu */}
      </div>
    </section>
  );
}
```

---

### 4. Les trois portes de contrôle (Gates)

Avant de pousser du code en production, exécutez toujours dans `aurum-drive/` :
```bash
# 1. Vérification TypeScript stricte
npx tsc --noEmit

# 2. Vérification des interdits (anglais, mots bannis, fausses promesses)
npm run qa:content

# 3. Détection des anti-patterns visuels
npx impeccable detect src/
```

Si les trois commandes se terminent sans avertissement ni erreur, le travail respecte les standards de qualité du projet.
