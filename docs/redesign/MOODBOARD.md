# Moodboard & Design References (Phase 0)

_Research document containing 22 curated design & engineering references based on `04-ART-DIRECTION-AND-DESIGN-SYSTEM.md` (Section 10)._

---

## 1. Automotive & Luxury Editorial

### 01. Porsche (Official Digital Experience)
- **Source**: `porsche.com`
- **Technique to study**: Low-angle silhouette photography, smooth dark-mode lighting with single directional key light, seamless model variant toggling.
- **What to steal**: The dramatic front three-quarter cutout positioning where the car extends slightly beyond the content container, conveying presence and arrival.
- **What to skip**: Complex 3D WebGL car configurator that bogs down mobile frame rates.

### 02. Bugatti (Editorial Model Showcases)
- **Source**: `bugatti.com`
- **Technique to study**: Giant typography contrast (112px headline next to 14px caption), massive negative space, silent pauses between content blocks.
- **What to steal**: Deep blue-black night background (`#06080C`) paired with warm metallic specular highlights.
- **What to skip**: Overly theatrical video loops with dramatic classical audio.

### 03. Lucid Motors (Air Showcase)
- **Source**: `lucidmotors.com`
- **Technique to study**: Subtle headlight beam flare and soft lens bloom layered over dark textures without causing visual noise.
- **What to steal**: The headlight ignition sequence where the light cone gently reveals the road ahead on scroll.
- **What to skip**: Heavy client-side JavaScript initialization blocking initial DOM paint.

### 04. Rivian (Storytelling & Specs Grid)
- **Source**: `rivian.com`
- **Technique to study**: Clear, honest tabular spec chips (range, seats, drivetrain) with clean divider hairlines (`rgba(255,255,255,0.08)`).
- **What to steal**: Odometer-style roll animations when specs or prices switch.
- **What to skip**: Multi-page horizontal scrolljacking that interferes with native trackpad/touchpad scrolling.

### 05. Polestar (Minimalist Scandinavian Tech)
- **Source**: `polestar.com`
- **Technique to study**: Restraint in typography, zero decorative gradients, pure functional typography hierarchy.
- **What to steal**: Single hot accent button style — clean pill button with dark arrow circle inside.
- **What to skip**: Ultra-low contrast grey-on-dark body text that fails accessibility WCAG AA.

---

## 2. Mobility & Reservation Flow References

### 06. Sixt (Premium Car Rental Flow)
- **Source**: `sixt.com`
- **Technique to study**: Compact sticky booking bar with clear pickup/return location pills and duration counter.
- **What to steal**: Live day count calculation that dynamically updates as dates are picked.
- **What to skip**: Aggressive upselling banners, hidden insurance fees, and loud orange badge noise.

### 07. Blacklane (Chauffeur & Airport Transfer)
- **Source**: `blacklane.com`
- **Technique to study**: Airport arrival reassurance: flight number input, meeting point instructions, calm step-by-step clarity.
- **What to steal**: The airport arrival reassurance messaging ("Your driver awaits at terminal exit").
- **What to skip**: Corporate jargon and stock photography of business executives in suits.

### 08. Turo (Peer-to-Peer Fleet Grid)
- **Source**: `turo.com`
- **Technique to study**: High-density fleet card layout showing price per day, total price for trip, and key badges (seats, transmission).
- **What to steal**: Clean card proportion with car cutout sitting on an elevated plate.
- **What to skip**: Tiny card grids with cluttered badge chips.

### 09. Airbnb (Search & Mobile Bottom Sheet)
- **Source**: `airbnb.com`
- **Technique to study**: Fluid modal-to-bottom-sheet transitions for date range selection on mobile.
- **What to steal**: Two-month calendar picker with quick presets ("Ce week-end", "1 semaine", "1 mois").
- **What to skip**: Heavy multi-layered search overlay blocking background visibility entirely.

### 10. Skyscanner (Price Matrix & Clear Dates)
- **Source**: `skyscanner.net`
- **Technique to study**: Tabular lining figures for prices, clear currency presentation, no unexpected charges.
- **What to steal**: Tabular numbers (`font-variant-numeric: tabular-nums`) so prices never cause layout shifts.
- **What to skip**: Third-party advertisement blocks and blinking discount timers.

---

## 3. Interaction Craft & Micro-details

### 11. Linear (App & Marketing Craft)
- **Source**: `linear.app`
- **Technique to study**: Cursor-tracking spotlight border on cards using CSS radial gradient masks and `--mx`, `--my` variables.
- **What to steal**: Subtle 1px gold border illumination that follows mouse movement over the fleet grid.
- **What to skip**: Dark purple and neon violet glow gradients.

### 12. Stripe (Dashboard & Interactive Forms)
- **Source**: `stripe.com`
- **Technique to study**: Floating labels, instant inline validation, keyboard-tab order, non-destructive error handling.
- **What to steal**: 56px input field height with 14px radius and gold glow halo on focus (`rgba(194,165,107,0.14)`).
- **What to skip**: Multi-colored animated gradient meshes.

### 13. Emil Kowalski (Animation Philosophy)
- **Source**: `emilkowal.ski` / Animation Handbook
- **Technique to study**: Interruptible spring physics, exits faster than entrances (60-70% duration), entrance starts from `scale(0.95)`.
- **What to steal**: Button press reaction: `transform: scale(0.97)` in 100ms with snappy return.
- **What to skip**: Elastic overshooting on informational UI cards.

### 14. Rauno Freiberg (Invisible Details)
- **Source**: `rauno.me`
- **Technique to study**: Fine cursor trailing ring, tactile feedback, micro-interactions that feel responsive rather than loud.
- **What to steal**: 24px cursor follower ring with 0.45s lag (`quickTo`) that expands to 84px with contextual label ("Voir").
- **What to skip**: Disabling the native system cursor.

### 15. Locomotive Agency (Editorial Web Choreography)
- **Source**: `locomotive.ca`
- **Technique to study**: Word-mask typography reveals where lines of text slide up from masked containers without layout jump.
- **What to steal**: Server-rendered `SplitWords` component animated with CSS so headlines render immediately without waiting for hydration.
- **What to skip**: Forced heavy smooth scrolling on mobile devices.

---

## 4. Runway, Airport & Aviation Aesthetics

### 16. Changi Airport / Singapore Airlines (Terminal Signage)
- **Source**: Changi Airport Digital Wayfinding
- **Technique to study**: Clean high-contrast typography, crisp directional iconography, soothing amber runway lighting.
- **What to steal**: Runway centerline dashes (28x2px with 56px gaps) used as section dividers with slow idle drift.
- **What to skip**: Dense flight schedule grids that overwhelm casual viewers.

### 17. Rimowa (Luxury Travel Hardware)
- **Source**: `rimowa.com`
- **Technique to study**: Boarding pass / ticket aesthetic with subtle perforation cuts, mono-spaced flight codes, and high-craft minimalism.
- **What to steal**: Boarding-pass confirmation card (`/reserver/confirmation/[ref]`) with tear-off stub and stamp animation.
- **What to skip**: High-fashion runway video cluttering the product overview.

### 18. Monocle Travel Guides
- **Source**: `monocle.com`
- **Technique to study**: Editorial layout with asymmetrical columns, warm ivory text, small precise labels with wide letter-spacing (`tracking-widest`).
- **What to steal**: Asymmetrical collage layout for the "Pourquoi choisir DZ Rent Car" section with rotating circular stamp.
- **What to skip**: Dense unreadable newspaper-style columns.

---

## 5. Experimental & Creative References

### 19. Awwwards Site of the Day: "Alpine Cars"
- **Source**: `awwwards.com` (Alpine Showcase)
- **Technique to study**: Velocity skew effect on image rail during scroll.
- **What to steal**: GSAP ScrollTrigger velocity skew clamping between -4deg and +4deg on the fleet rail.
- **What to skip**: Sound effects on hover.

### 20. Codrops: Cursor Hover Image Trails
- **Source**: `tympanus.net/codrops`
- **Technique to study**: Hovering a service item causes a floating preview image to follow the cursor smoothly.
- **What to steal**: Editorial list in "Nos prestations" where hovering each service displays a refined preview thumbnail near the cursor.
- **What to skip**: Full-screen canvas particle distortion.

### 21. Apple (iPhone / Watch Keynote Landing Pages)
- **Source**: `apple.com`
- **Technique to study**: Scrubbed progress storytelling where a key element travels along a path as the user scrolls.
- **What to steal**: "Comment réserver" road scrub where a clean minimalist car icon travels down a lane line.
- **What to skip**: Gigantic multi-gigabyte video scrubs that drain mobile battery.

### 22. Sixt Luxury "Black" Theme
- **Source**: `sixt.com/luxury`
- **Technique to study**: Dark mode vehicle photography grading: desaturated background, punchy car paint highlights, dark asphalt floor.
- **What to steal**: Consistent photographic color grade applied across all vehicle cards.
- **What to skip**: Fake claims of "VIP royal treatment".
