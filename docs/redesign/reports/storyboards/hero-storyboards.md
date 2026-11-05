# Hero "Arrivée" — Three Storyboards (Frame by Frame)

_Reference: `05-MOTION-AND-ALIVENESS.md` (Section 5, S1) and `07-IDEAS-LAB.md` (Section 3.1, I-01)._

---

## Storyboard A: The Physical Night Arrival (Recommended for Lab)

### Concept
Landing at Algiers airport at dusk/night. The atmosphere is quiet and vast. As the visitor opens the page, the car arrives with momentum, dips as it brakes, and turns on its headlights — lighting the booking console.

### Frame-by-Frame Timeline (Total duration: 2.2 s)

```
0.0s ─── [Frame 1: Calm Night Frame]
         • Dark night background (`#0B0E14`) with airport runway ambient blur.
         • Deep vignette active. Background starts subtle scale settle (1.12 → 1.04).
         • Zero invisible content — hero layout is pre-rendered in HTML.

0.10s ── [Frame 2: Signage Drops In]
         • Header smoothly drops in from y: -24px with fade (0.8s, `power3.out`).
         • Monogram "DZ" and airport live clock chip ("Alger · 21:42") fade in top-left.

0.12s ── [Frame 3: H1 Word-Mask Reveal]
         • CSS word masks activate on first paint (no waiting for JS hydration).
         • "Atterrissez." rises from overflow hidden container (70ms delay).
         • "Votre voiture vous attend." follows line by line with solid ivory weight.

0.50s ── [Frame 4: Subtitle & CTAs Pop]
         • Supporting text ("Voitures récentes, livraison et retour gratuits...") rises 24px.
         • Primary "Voir les voitures disponibles" and WhatsApp buttons pop (`scale: 0.95 → 1`).

0.60s ── [Frame 5: The Vehicle Arrives]
         • High-resolution car cutout enters from +24vw (off-screen right) towards center-right.
         • Easing: `expo.out` (1.5s).
         • Ghost trail: two trailing opacity silhouettes (at 25% and 12%) lag behind by 60ms and 120ms.

1.65s ── [Frame 6: Brake & Settle]
         • The car reaches destination position.
         • Suspension dip: 0.5° subtle clockwise tilt and 3px vertical dip, then returns to level.
         • Cast shadow underneath wheels expands and darkens.

1.90s ── [Frame 7: Headlights Ignition]
         • Twin warm gold headlight bloom sprites (`#FFF1D0` core, `#E6CD96` ambient glow) switch on.
         • A soft volumetric light cone wipes across the glass booking bar below.
         • Runway centerline dashes at frame bottom begin slow continuous idle drift (3.4s linear loop).

2.20s+ ── [Frame 8: Alive & Interactive]
         • Pointer coupling engages: subtle 4-plane parallax (background ±6px, car ±14px, light beam ±22px, dashes ±30px).
         • Scroll coupling engages: as user scrolls down, car smoothly drifts right (+10vw) with scale 1.06 while text fades up.
```

### Motion Profile
- **Entrance**: `expo.out`
- **Settle**: `sine.inOut` (suspension dip)
- **Coupling**: Lerp 0.08 mouse follow, native scroll on touch.

---

## Storyboard B: The Volumetric Light Reveal

### Concept
The car is already in position in the dark, bathed in deep shadow. A moving airport follow-spotlight sweeps across the scene from left to right, revealing the car's contours, followed by headlight activation.

### Frame-by-Frame Timeline (Total duration: 2.0 s)

```
0.0s ─── [Frame 1: Deep Silhouette]
         • Dark night canvas (`#06080C`). Car cutout is visible only as a dark silhouette against subtle city lights.
         • H1 and navigation appear with clean word masks.

0.4s ─── [Frame 2: Terminal Light Sweep]
         • A wide diagonal beam of warm amber light (`rgba(194,165,107,0.18)`) sweeps from left (-40%) across the screen to right (+120%).
         • As the sweep touches the car body, specular highlights glint off the windshield, hood, and rim edges using a clip-path mask.

1.1s ─── [Frame 3: Contour Unveiling]
         • The car body transitions from 20% silhouette to full photographic clarity (`autoAlpha: 1`, `scale: 0.98 → 1.0`).
         • Booking console rises with glassmorphism blur (`backdrop-filter: blur(18px)`).

1.5s ─── [Frame 4: Twin Headlights Flash]
         • Headlights blink once softly, then illuminate to full strength.
         • Light beam illuminates the "Livraison gratuite à l'aéroport" trust badge.
```

### Motion Profile
- **Light sweep**: `power3.inOut` (1.1s)
- **Specular wipe**: `expo.out` (0.8s)

---

## Storyboard C: The Scroll-Linked Runway Landing

### Concept
The arrival is completely coupled to visitor scroll. The page loads with the airport tarmac and headline; as the user begins their first scroll motion, the vehicle advances down a marked runway into the booking area.

### Frame-by-Frame Timeline (Scroll-Bound)

```
0% Scroll ── [Frame 1: Approach Horizon]
             • Camera view is looking down a perspective runway with glowing edge markers.
             • Car is in distance (scale: 0.65, opacity: 0.4).
             • Headline: "Atterrissez. Votre voiture vous attend."

30% Scroll ─ [Frame 2: Touchdown & Approach]
             • Car advances along perspective runway centerline (`scale: 0.65 → 0.92`, `yPercent: -20 → 0`).
             • Runway dashes accelerate past the wheels.

70% Scroll ─ [Frame 3: Turn & Stage]
             • Vehicle rotates 15° to face the visitor in a three-quarter angle (`scale: 1.0`).
             • Headlights fire forward, casting beam directly into the booking selector bar.

100% Scroll  [Frame 4: Unpin & Section Transition]
             • Hero unpins cleanly, flowing into the "Trust Strip" and "Catégories" section.
```

### Motion Profile
- **Engine**: ScrollTrigger with `scrub: 0.8`.
- **Note**: Requires pinning, which must be carefully tested against mobile CPU constraints.

---

## Evaluation & Selection for Lab Testing

| Evaluation Criteria | Weight | Storyboard A (Physical Arrival) | Storyboard B (Light Sweep) | Storyboard C (Scroll Scrub) |
|---|:---:|:---:|:---:|:---:|
| **Immediate "Alive" Feeling** | x3 | **5/5** (Immediate motion without user effort) | 4/5 (Atmospheric but slower) | 3/5 (Dead until user scrolls) |
| **LCP Safety & Performance** | x3 | **5/5** (Starts immediately, zero layout shift) | 4/5 (Clip-path masks require GPU composite) | 3/5 (ScrollTrigger pin can delay mobile scroll) |
| **Brand Storytelling ("Arrivée")** | x2 | **5/5** (Car physically arrives and brakes) | 4/5 (Focuses on light, less on car) | 5/5 (Literal landing simulation) |
| **Mobile Adaptability** | x2 | **5/5** (Easily reduced to 12vw slide without lag) | 4/5 (Heavy mask shaders on low-end GPUs) | 2/5 (Pinning on mobile causes scroll fighting) |
| **Total Weighted Score (out of 50)** | | **49 / 50** | 40 / 50 | 33 / 50 |

### Decision
**Storyboard A (The Physical Night Arrival)** is selected as the primary direction for `/lab/hero-car/a`. It satisfies all LCP safety requirements, creates instant delight within 2 seconds of landing on the site, and works reliably on mobile without scroll pinning or heavy GPU masks.
