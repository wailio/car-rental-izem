# AGENTS.md: DZ Rent Car redesign (always on)

At the start of every session, read `docs/redesign/00-START-HERE.md`, then `docs/redesign/PROGRESS.md`. Re-read the relevant spec before touching a section.

## Mission
Redesign the DZ Rent Car website so it looks human-designed, luxury but simple, spacious, comfortable to the eye, and **alive** (responsive, physical, smooth). **Keep the structure**: all routes, the home section order, and the 3-step reservation workflow. Concept: **"Arrivée"** (landing at night in Algiers, the car is waiting). Words: **Arrivée. Calme. Vivant.**

## Skills (use them, name them in your notes)
- **impeccable**: audit, critique, polish, typeset, distill. Run `npx impeccable detect src/` as a gate.
- **gsap-*** skills: ScrollTrigger, timelines, SplitText, Flip, React cleanup, performance.
- **emil-design-eng**: easing, timing, springs, interruptible animation, review checklist.

## Hard rules
1. **Never invent facts** about the company. Claims come from `src/content/site-facts.ts`; only `verified` facts render in production. Unknown means `TODO:CLIENT` and neutral wording. No fake people, reviews, numbers or logos.
2. **French only** in the interface, no English leftovers, no banned words (`03-BRAND-AND-CONTENT.md`). Run `npm run qa:content` before every commit.
3. **Design**: dark night base, gold used as light (one hot element per viewport), one light source, generous space, asymmetry, tempo that varies by section. Tokens only (`04`). No purple gradients, glow blobs, gradient text, emoji icons, identical card grids, or default AI fonts (Inter, Space Grotesk, Playfair, Cormorant, Poppins, DM Sans) unless the type duel chooses them.
4. **Motion**: use motion tokens only. Animate `transform`, `opacity`, `clip-path` only. Never `transition: all`, never CSS `ease`, never `ease-in` for entrances, entrances start at `scale(.95)`, exits are faster than entrances, everything is interruptible. Hero content is never hidden waiting for JavaScript. Honour `prefers-reduced-motion`. Touch devices keep native scroll and lose cursor, tilt and magnetic effects.
5. **Performance and accessibility are gates**: LCP at most 2.5 s, CLS at most 0.02, INP at most 150 ms, at most 3% frames over 20 ms in a 10 s scroll at 4x CPU throttle, Lighthouse accessibility 100, visible focus, keyboard operable, names on every link and button.
6. **Evidence for every "done"**: screenshots at 1440, 1024, 768, 390, 320, a short recording, performance numbers, `impeccable detect` output (see `01-MASTER-PLAN.md`).
7. **Do not copy** code, text, images or fonts from reference sites. Learn techniques only.
8. **Never submit forms** on third-party sites. Use a test mode for our own reservation endpoint.

## Process
- Branch `redesign/alive`, tag `pre-redesign`. Small commits that say what and why.
- One element at a time: build, test states, record, measure, compare, critique, **remove one accessory**, fix, then move on (`08-TEST-AND-QA.md`, section 2).
- Stop and wait for the person **only** at checkpoints A, D and F (`01-MASTER-PLAN.md`). Otherwise write the report and continue.
- Batch questions (maximum 5, each with a default). Client questions go to `docs/redesign/CLIENT-QUESTIONS.md`.
- Log decisions with alternatives and evidence in `docs/redesign/DECISIONS.md`.
- If a gate fails twice, stop, explain why, propose two alternatives, ask.
- Take as long as the quality needs. Quality beats speed.
