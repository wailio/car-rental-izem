# DZ Rent Car: Redesign Pack for Antigravity

Version 2, October 2026.
Put this whole folder in the project at `docs/redesign/` and put `AGENTS.md` at the project root.

If `ANTIGRAVITY-BRIEF-luxury-car-rental.md` is in the project, treat it as the structural baseline (routes, section order, the LOVEHA-style reservation workflow). **Where it conflicts with this pack, this pack wins.**

---

## 1. Situation in five lines

1. The website exists (Next.js). The client, **DZ Rent Car** (TikTok `@dz.rent.car`), is a practical, friendly car-rental company in Algeria.
2. The person commissioning the redesign says the site looks like **AI slop**, feels **dead**, and is **not smooth**, even after many edits.
3. They want it to feel **alive, creative, free, spacious, comfortable to the eye, luxury but simple, and clearly made by a human designer**.
4. The **structure stays** (pages, routes, section order, reservation workflow). Everything about how it looks, moves, reads and responds changes.
5. This pack tells you what is wrong (verified), what to build, how to build it, how to test it, and how to prove it is done.

---

## 2. Kickoff prompt (the person pastes this into Antigravity)

```text
You are the lead designer-engineer redesigning the DZ Rent Car website in this project.

1. Read every file in docs/redesign/ in the order given in 00-START-HERE.md, and AGENTS.md at the root.
2. Confirm the skills listed in section 4 of 00-START-HERE.md are loaded. If one is missing, tell me and fix the install before going on.
3. Start with Phase 0 of 01-MASTER-PLAN.md (read-only audit). Write docs/redesign/AUDIT.md using the template in 02-AUDIT-AND-ROOT-CAUSES.md.
4. Work phase by phase. Stop and wait for my approval ONLY at the checkpoints marked STOP in 01-MASTER-PLAN.md. At every other checkpoint, write the report and continue.
5. Prove every "done" with evidence (screenshots at 5 viewports, a short screen recording, performance numbers, impeccable detect output).
6. Never invent facts about the company. Use docs/redesign/03-BRAND-AND-CONTENT.md and the facts register. Unknown means TODO:CLIENT and neutral wording.
7. Take as long as the quality needs. Quality beats speed. Do one element at a time, test it, compare, then move on.
```

---

## 3. Reading order

| # | File | What it is | Read it when |
|---|---|---|---|
| 0 | `AGENTS.md` (project root) | Short always-on rules | Always |
| 1 | `00-START-HERE.md` | This file | First |
| 2 | `01-MASTER-PLAN.md` | Step-by-step phases, gates, checkpoints | Before any work |
| 3 | `02-AUDIT-AND-ROOT-CAUSES.md` | Verified problems on the live site, why it feels dead, audit procedure | Phase 0 |
| 4 | `03-BRAND-AND-CONTENT.md` | Brand truth, voice, facts register, French copy deck, microcopy | Phase 0 and 1 |
| 5 | `04-ART-DIRECTION-AND-DESIGN-SYSTEM.md` | Concept, colour, type, space, buttons, components, imagery | Phase 2 |
| 6 | `05-MOTION-AND-ALIVENESS.md` | The motion engine, signature moments, cursor, performance | Phase 2 and 3 |
| 7 | `06-PAGE-SPECS.md` | Every section and page, desktop and mobile | Phase 3 to 6 |
| 8 | `07-IDEAS-LAB.md` | Creative ideas and how to experiment | Phase 3, whenever a decision is open |
| 9 | `08-TEST-AND-QA.md` | How to test and how to know you nailed it | Every phase, and Phase 8 |

---

## 4. Skills to have loaded (check before starting)

The person installs these from the terminal at the project root (commands are in the chat message and repeated here).

| Skill | Why it matters here | Install |
|---|---|---|
| **impeccable** (Paul Bakaus) | A design vocabulary (audit, critique, polish, distill, animate, typeset, bolder, quieter) and a **deterministic AI-slop detector**. | `npx skills add pbakaus/impeccable --agent antigravity` |
| **GSAP official skills** (GreenSock) | Correct ScrollTrigger, timelines, SplitText, Flip, performance, React cleanup. | `npx skills add https://github.com/greensock/gsap-skills --agent antigravity` |
| **emil-design-eng** (Emil Kowalski) | Easing, timing, springs, interruptible animation, scale-not-zero entrances, review checklist. | `npx skills add emilkowalski/skills --skill emil-design-eng --agent antigravity` |
| *(optional)* **UI/UX Pro Max** | A catalogue of font pairings and palettes, used **only** to compare options. Our direction overrides it. | `npm install -g uipro-cli` then `uipro init --ai antigravity` |
| *(already there)* **Chrome DevTools tools** | Performance traces, Lighthouse, screenshots. Bundled with Antigravity 2.0. If missing, add the MCP server `chrome-devtools-mcp`. | MCP config: command `npx`, args `-y chrome-devtools-mcp@latest` |

**Verify the skills loaded.** Ask yourself (the agent) to list every skill you can load and show each `SKILL.md` path. You should see `impeccable`, the `gsap-*` skills and `emil-design-eng`. If not, copy the skill folders into `.agents/skills/` (or `.agent/skills/` on older builds), restart Antigravity, and check again.

**How to use them.** Invoke by name in your own reasoning and in commit notes: "Using the impeccable skill: critique", "Using gsap-scrolltrigger", "Using emil-design-eng review table". Run `npx impeccable detect src/` as an objective AI-slop gate (details in `08-TEST-AND-QA.md`). If impeccable asks to create `PRODUCT.md` and `DESIGN.md`, answer its questions from files 03 and 04, then keep those two files short and link back here so there is one source of truth.

---

## 5. The north star

**One concept: "Arrivée".** The company's real superpower is that the car is waiting for you at the airport, free of charge, with 24/7 assistance and full insurance. The whole site is the feeling of **landing in Algiers at night and finding everything ready**: calm dark surfaces, warm gold light like headlights and runway lights, a cool deep night-blue black, quiet confidence, nothing shouting.

Three words for every decision: **Arrivée. Calme. Vivant.**

- **Arrivée**: airport and road vocabulary (runway dashes, gauges, odometer digits, boarding-pass confirmation).
- **Calme**: space, restraint, one memorable thing per section, no decoration without a job.
- **Vivant**: the page responds to the cursor, the scroll, time and touch, with physical motion that never lags.

---

## 6. Non-negotiables

1. **Keep the structure**: all routes, the section order, and the 3-step reservation workflow (details in `06-PAGE-SPECS.md`).
2. **Never invent facts.** Every claim comes from the facts register (`03`). Unverified claims are hidden or neutral until the client confirms.
3. **No fake people, reviews, numbers, or logos.** No template names, no stock avatars.
4. **French-only interface**, i18n-ready, zero English leftovers.
5. **Dark, luxury, simple, spacious.** Space is a feature. One bold thing per section.
6. **"Alive" is measured**, not felt. Use the aliveness scorecard in `02` and the gates in `08`.
7. **60 fps and fast.** Performance and accessibility gates are pass or fail.
8. **Evidence for every "done".**
9. **Learn techniques from references, never copy** code, text, images or fonts.
10. **Take your time.** One element at a time. Test, compare, fix, then move on.

---

## 7. Working agreement

- Create a git tag `pre-redesign` and a branch `redesign/alive` before changing anything.
- Commit small and often with messages that say what changed and why.
- Keep a running log in `docs/redesign/PROGRESS.md` (done, next, blocked) and `docs/redesign/DECISIONS.md` (each decision with the alternatives tried and the evidence).
- **Questions for the person**: batch them (maximum 5 at a time), each with your default answer so work never stalls.
- **Questions for the client** (facts, photos, videos): collect in `docs/redesign/CLIENT-QUESTIONS.md`. The person forwards them. Continue with placeholders flagged `TODO:CLIENT`.
- If a gate fails twice, stop, write down why, propose two alternatives, and ask.
- Before removing a section, feature or route, write the reason in `DECISIONS.md`.

---

## 8. What success looks like (read this twice)

A visitor lands on the site and, within three seconds, feels that it is **alive**: light moves, the car arrives, the cursor and scroll answer them, text appears with weight and timing, nothing jumps or lags. They also feel it is **calm and expensive** without a single claim of "prestige". The copy is plain, specific and true. The site loads fast on a mid-range Android phone. Nobody could guess it was generated.
