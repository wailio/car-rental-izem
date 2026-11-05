# 08. Test and QA Protocol

"Done" means **proven**, not "it looks fine to me". Use your browser subagent for visual and interaction checks, Chrome DevTools for performance, and scripts for anything repeatable. Save evidence under `docs/redesign/reports/`.

---

## 1. Principles

1. **Measure, do not feel.** Numbers for performance, recordings for motion, checklists for accessibility.
2. **Compare side by side.** Before and after, reference and result, mobile and desktop.
3. **Test the ugly cases.** Slow network, slow CPU, small screens, keyboard only, reduced motion, interruptions.
4. **Automate what repeats**: content QA, visual regression, accessibility scans, date logic.
5. **Humans decide taste.** Scripts cannot tell you whether it feels alive. Real people on real phones can.

---

## 2. The section loop (do this for every section, component and page)

1. **Study**: re-read the spec in `06` and the motion spec in `05`; open the reference frames in `MOODBOARD.md`.
2. **Micro-spec**: write 5 lines in `DESIGN.md` (intent, layout, motion, states, mobile).
3. **Build desktop (1440)**, then **tablet (768)**, then **mobile (390 and 320)**.
4. **Add motion** with tokens only (no magic numbers). Tune with the sliders in `/lab/motion`.
5. **Test states**: default, hover, focus-visible, pressed, loading, empty, error, disabled.
6. **Test motion**: record at 1x and at 0.25x speed, then compare with the timeline in `05`. Run interruption tests (section 6).
7. **Measure**: LCP, CLS, INP, frame times during a 10 s scroll with 4x CPU throttle and Slow 4G.
8. **Compare** screenshots at 5 viewports against the reference and against the sections already built (consistency).
9. **Critique** as a senior art director using the impeccable `critique` skill; apply the squint, grayscale and swap tests (section 5). **Remove one accessory.**
10. **Fix, re-test, commit.** Write the evidence pack (`01-MASTER-PLAN.md`). Update `PROGRESS.md`.

---

## 3. Test matrix

| Dimension | Values |
|---|---|
| **Viewports** | 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 |
| **Browsers** | Chrome (desktop and Android), Safari (iOS, or Playwright WebKit), Firefox, Edge, Samsung Internet (emulate where real devices are unavailable) |
| **Network** | Fast, Slow 4G, Fast 3G, offline (graceful errors) |
| **CPU** | none, 4x throttle, 6x throttle |
| **Input** | mouse, keyboard only, touch, screen reader |
| **Preferences** | `prefers-reduced-motion: reduce`, `saveData`, browser zoom 200%, text size 200%, forced colors (Windows high contrast) |
| **States** | default, hover, focus-visible, pressed, loading, empty, error, disabled |
| **Pages** | `/`, `/vehicules`, `/vehicules/[slug]`, `/reserver/modele/[id]`, `/reserver/confirmation/[ref]`, `/services`, `/a-propos`, `/faq`, `/contact`, legal, 404 |

Run the **full matrix** at Phase 8. During earlier phases run the subset relevant to what you touched.

---

## 4. Performance tests and budgets

| Metric | Budget (mobile, Slow 4G, 4x CPU) |
|---|---|
| Lighthouse | Performance at least 90; Accessibility, Best Practices and SEO at 100 on Home, Fleet, Vehicle |
| LCP | at most 2.5 s (target 2.0 s) |
| CLS | at most 0.02 |
| INP | at most 150 ms |
| TBT | at most 200 ms |
| Frames over 20 ms during a 10 s scroll | at most 3% |
| Long tasks during animations | none over 100 ms |
| Initial JavaScript (Home) | at most about 170 KB gzip; load GSAP plugins only where used |
| Hero image | at most about 160 KB desktop, 90 KB mobile (AVIF or WebP) |
| Fonts | at most about 120 KB total, no layout shift on swap |
| Page weight (Home, first load, without video) | at most about 1.8 MB |

**How**
1. Chrome DevTools Performance trace of load plus a 10 s scroll (CPU 4x, Slow 4G). Record long tasks, layout shifts, and frame times.
2. Lighthouse (mobile) on the routes above.
3. The frame-time snippet from `05` section 13.
4. Bundle analysis (`@next/bundle-analyzer`). Check that GSAP plugins and the cursor are lazy.
5. Image audit in the Network panel: no oversized requests, correct `sizes`, the LCP image preloaded with `fetchpriority="high"`.
6. Hydration check: hard reload with throttling and watch the first 3 seconds for flashes of placeholders or invisible content.
7. **Memory test**: navigate between routes 20 times and check that listeners, ScrollTriggers and heap do not grow.

---

## 5. Visual quality tests

- **Side by side**: put the reference frame and your screenshot next to each other at the same viewport. Compare spacing, scale contrast, alignment, light.
- **Squint test**: blur the screenshot (or squint). Is the hierarchy still obvious? Is there one clear focal point per viewport?
- **Grayscale test**: does it still work without colour?
- **Swap test**: replace the logo with another company's. If nobody would notice, the page is generic. Make it more specific.
- **5-second test**: show someone the screenshot for 5 seconds. Can they say what the company does and what to do next?
- **Rhythm audit**: list the vertical padding and tempo of every section. Are consecutive sections different? Is there a quiet one after a busy one?
- **Typography checks**: measure at 60 to 68 characters, no widows in headlines, hierarchy visible, tabular numerals, **French typography** (non-breaking space before `:`, `;`, `?`, `!`, and inside « »; correct apostrophes `’`; "oct." not "Octo.").
- **Consistency audit**: the same radius, spacing, button and input everywhere; no one-off values.
- **Grid overlay**: toggle an overlay to check alignment to the 12-column grid and the 8-pt spacing.
- **Image check**: every image sharp at 2x, consistent grading, correct car for the name, no stock mismatches.
- **Run the slop detector**: `npx impeccable detect src/` and, when the dev server runs, `npx impeccable detect http://localhost:3000`. The target is **zero unresolved findings**; any remaining finding needs a written justification in `DECISIONS.md`.

---

## 6. Motion tests

1. **Record every animation at 1x and at 0.25x** (`gsap.globalTimeline.timeScale(0.25)`). Compare with the timeline in `05`. Note timing and easing differences and fix them.
2. **Interruption tests**: hover in and out quickly, click category pills rapidly, open and close the menu quickly, change scroll direction mid-reveal, resize mid-animation. Nothing may get stuck, restart or flash.
3. **Scroll tests**: slow scroll, fast flick, scroll to anchor, back and forward navigation, page refresh mid-page, restore scroll position.
4. **Idle test**: leave the page for 30 s. Idle loops must stay subtle, CPU must stay near idle, loops must pause when the tab is hidden.
5. **Reduced motion**: every reveal and signature moment has the fallback in `05` section 11 and nothing is invisible.
6. **Touch**: no cursor effects, press feedback present, drag physics natural, no scroll fighting.
7. **Resize and rotate**: ScrollTriggers refresh, no overlaps, no layout shift.
8. **Slow CPU**: at 6x throttle the site stays usable and non-glitchy (effects can degrade, content never breaks).
9. **No flash of invisible content** with throttled network and with JavaScript delayed.

---

## 7. Functional tests

### 7.1 Date and price logic (unit tests, e.g. Vitest, in `src/lib/dates.test.ts`)
- Exactly 24 h gives 1 day. Exactly 72 h gives 3 days. 24 h 01 min follows the confirmed grace rule. Less than 24 h gives 1 day. Return before pickup is invalid.
- Month and year boundaries, 29 February (2028), a pickup late at night.
- Computation is in `Africa/Algiers` regardless of the visitor's time zone (test with a Paris and a New York time zone).
- Age on the exact birthday, one day before, one day after. Licence years boundary on the pickup date.
- Invalid dates (31 February), empty values, future birth dates.
- Default dates are always in the future at any time of day.

### 7.2 Reservation form matrix
| Case | Expected |
|---|---|
| Valid path, all three steps | Request created, confirmation page with reference |
| Each required field empty | Inline plain-language error, focus moves to the field |
| Phone: `0555 12 34 56`, `+213 555 12 34 56`, `00213 555 12 34 56` | Accepted and normalised |
| Phone: `0455 12 34 56`, `0555`, letters | Rejected with the helpful message |
| Invalid e-mail | Rejected |
| Under the minimum age (exact boundary) | Explanation and suggested eligible categories |
| Licence too recent (exact boundary) | Same |
| Birth date in the future, licence before plausibility | Rejected |
| Network failure at submit | Inputs preserved, friendly error, retry works |
| Double click on submit | Exactly one request |
| Refresh mid-form, back button, forward | State restored |
| Honeypot filled, or submit faster than 3 s | Silently rejected, no information leaked |
| Special input (emoji, very long text, Arabic and right-to-left text, `<script>`) | Stored and displayed safely (escaped) |
| Keyboard-only completion | Entire flow works, focus order logical |
| Screen reader | Errors announced, labels read, steps announced |

### 7.3 Links and actions
- Every internal link returns 200. Every `tel:` and WhatsApp link is correct (`https://wa.me/213...` with encoded text). **No link points to a relative phone-like path.**
- Social links point to verified handles only (TikTok first).
- Filters sync with the URL, and back and forward restore them. Date bar updates results.
- Hard-coded dates do not exist anywhere (`pickup_at=20` search returns nothing).

---

## 8. Accessibility tests

- **Automated**: Lighthouse accessibility 100, and axe (for example `@axe-core/playwright`) with zero violations on every route.
- **Keyboard-only walkthrough** of the full journey (Home, Fleet, Vehicle, Reservation, Confirmation). Visible `:focus-visible` everywhere, logical order, no keyboard traps in the menu, lightbox, sheets and date picker, `Esc` closes overlays and returns focus.
- **Screen-reader smoke test** (NVDA on Windows or VoiceOver on iOS) for three flows: choose dates and find a car, send a request, read the FAQ. Landmarks, headings, accordion state, dialog labelling, error announcements.
- **Contrast**: every text and background pair at least 4.5:1 (3:1 for large text and UI components). Re-check text over images with the scrim.
- **Target size**: at least 44 x 44 px for touch.
- **Zoom and reflow**: 200% zoom and 320 px width with no loss of content or horizontal scroll.
- **Motion safety**: nothing flashes more than 3 times a second, nothing essential is conveyed only by motion, reduced motion is respected.
- **Names**: every stretched link, icon button and image has an accessible name (fixes F-08).

---

## 9. Content QA (automated, runs in CI and before every checkpoint)

Create `scripts/content-qa.mjs` and add `"qa:content": "node scripts/content-qa.mjs"` to `package.json`. It fails on banned words, English leftovers, template names, hard-coded dates, bad links.

```js
// scripts/content-qa.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const rules = {
  banned:   [/d['’]exception/i, /excellence/i, /prestig/i, /\bVIP\b/, /luxueu/i, /sur mesure/i,
             /sans compromis/i, /rigueur/i, /\bélite\b/i, /haut de gamme/i, /raffinement/i, /comblés/i, /lorem/i],
  english:  [/Explore our/i, /Enhance your/i, /Watch Full Video/i, /View All/i, /What our customers/i,
             /Discover the ease/i, /Car Rental With Driver/i],
  template: [/Leslie Alexander/, /Floyd Miles/, /Courtney Henry/, /Robert Fox/, /Annette Black/, /Alis White/, /nova ride/i],
  hardcoded:[/pickup_at=20\d\d/, /return_at=20\d\d/],
  badLinks: [/href=["']\/\d{9,}/, /Octo\./],
};

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let failures = 0;
for (const file of walk('src')) {
  if (!/\.(tsx?|css|json|md)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const [label, list] of Object.entries(rules)) {
    for (const re of list) {
      const m = text.match(re);
      if (m) { failures++; console.error(`[${label}] ${file}: ${m[0]}`); }
    }
  }
}
if (failures) { console.error(`${failures} content issue(s) found`); process.exit(1); }
console.log('Content QA passed');
```

Also enforce at runtime: a helper `claim(key)` returns a fact's value **only if its status is `verified`** in production (in development it returns the value with a visible "À confirmer" badge). Add a test that no component imports facts without going through `claim`.

Additional automated checks: every page has a unique `<title>` and description; every image has `alt`; every vehicle gallery has distinct images; JSON-LD validates; sitemap and robots exist; `og:url` matches the canonical domain.

---

## 10. Visual regression and accessibility automation (optional but recommended)

```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install
```

```ts
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/vehicules', '/vehicules/volkswagen-tiguan', '/services', '/a-propos', '/contact'];
const sizes = [{ w: 1440, h: 900 }, { w: 390, h: 844 }, { w: 320, h: 640 }];

for (const r of routes) for (const s of sizes) {
  test(`${r} @${s.w}`, async ({ page }) => {
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.emulateMedia({ reducedMotion: 'reduce' });           // stable snapshots
    await page.goto(r, { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot(`${(r.replace(/\//g, '_') || 'home')}-${s.w}.png`,
      { fullPage: true, maxDiffPixelRatio: 0.01 });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
}
```

Run it before every checkpoint. Add Playwright **WebKit** and **Firefox** projects to cover Safari and Firefox engines when real devices are unavailable.

---

## 11. Security and robustness basics

- Reservation endpoint: server-side validation (never trust the client), rate limiting per IP, honeypot and minimum-time checks, input length limits, output escaping, no secrets in client bundles, CORS locked to the site, personal data never logged in clear.
- Confirmation page exposes minimal data without the phone suffix.
- Security headers (CSP where feasible, `X-Content-Type-Options`, `Referrer-Policy`), HTTPS only.
- Error pages never leak stack traces.

---

## 12. Human test (the person runs it with 5 people, on their own phones)

**Setup**: use a test mode (`?test=1` or a staging endpoint) so no real e-mails or requests are sent. Do not explain the site. Record what they do and say.

| Step | Script | What to watch |
|---|---|---|
| 1. **Blink test** | Show the home page for 3 seconds, then hide it. "What is this company? What did you notice?" | Do they say car rental, airport, calm, nice? Anything about "template" or "AI" is a fail signal |
| 2. **Task A** | "You land in Alger on Saturday and need a car for 3 days. Find a car and see the price." | Time, hesitation, mis-taps |
| 3. **Task B** | "Send a reservation request for it." | Where they stumble, error clarity |
| 4. **Task C** | "What happens if the car breaks down?" | Findability of the answer |
| 5. **Task D** | "How do you contact the company on WhatsApp?" | WhatsApp visibility |
| 6. **Feelings (1 to 5)** | Alive? Smooth? Modern? Trustworthy? Luxury but simple? Comfortable to the eye? | Averages |
| 7. **Open questions** | "Where did it feel slow or strange?" "What would you tell a friend about it?" | Verbatim quotes |

**Pass criteria**: at least 4 of 5 complete Tasks A and B without help in under 3 minutes each; average "alive" at least 4.2 and "smooth" at least 4.2; nobody says it feels fake, empty or like a template; no one reports lag.

Save results in `reports/human-test.md` and fix the top three issues before the final checkpoint.

---

## 13. Evidence and reporting format

- `docs/redesign/reports/<name>/` with screenshots (5 viewports), a 10 to 20 s recording, `perf.md`, `notes.md`, and the `impeccable detect` output.
- **Checkpoint report** (`reports/checkpoint-<letter>.md`): what changed (with before and after images), decisions (with links to `DECISIONS.md`), numbers (performance and scorecard), open questions (maximum 5, each with your default), next steps.
- Commit messages say what and why. Every merge to the branch comes with passing `qa:content`, lint, type check and Playwright tests.

---

## 14. Global definition of done

- [ ] Structure unchanged (routes, section order, 3-step reservation workflow).
- [ ] All findings F-01 to F-30 resolved or explicitly justified.
- [ ] Facts register complete, every visible claim `verified`, no fake people, reviews, numbers or logos.
- [ ] French-only, no English leftovers, no banned words, content QA passes.
- [ ] Design system implemented (tokens, type decision, buttons and inputs with every state).
- [ ] Motion system implemented: reveals with variety, signature moments S1 to S12 that apply, cursor, preloader, page transitions, shared element, idle life, reduced-motion fallbacks.
- [ ] Aliveness scorecard at least 42 out of 50 with no criterion below 4.
- [ ] Lighthouse mobile at least 90 performance and 100 accessibility, best practices, SEO on Home, Fleet, Vehicle. LCP at most 2.5 s, CLS at most 0.02, INP at most 150 ms, at most 3% frames over 20 ms.
- [ ] Zero axe violations, keyboard-only and screen-reader flows pass.
- [ ] No horizontal scroll at 320 px, no console errors, no layout shift, no flash of invisible content.
- [ ] Human test passed.
- [ ] `npx impeccable detect` clean (or justified).
- [ ] Handover documents written (`README.md`, `CONTENT-GUIDE.md`, `DECISIONS.md`, `CLIENT-QUESTIONS.md`).
- [ ] The test of last resort: someone who has never seen the site calls it "alive" and "premium" without being prompted, and nobody guesses it was generated.
