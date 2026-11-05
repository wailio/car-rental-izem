"use client";

import Link from "next/link";

const labs = [
  {
    href: "/lab/type",
    title: "Typographie",
    desc: "Duel Candidat A vs B — Newsreader ou Instrument Serif",
    phase: "2.2",
  },
  {
    href: "/lab/motion",
    title: "Motion",
    desc: "Terrain de jeu — durée, easing, stagger en direct",
    phase: "2.4",
  },
  {
    href: "/lab/components",
    title: "Composants",
    desc: "Tous les états — boutons, cartes, accordion, skeleton",
    phase: "2.3",
  },
];

export function LabGrid() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--night-950)",
        padding: "4rem var(--gutter)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
            IZEM MOTORS — Redesign
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ivory)", marginBottom: ".75rem" }}>
            Lab
          </h1>
          <p style={{ color: "var(--ivory-dim)", fontSize: "var(--fs-body)" }}>
            Environnement de test — non indexé. Phase 2 : Fondations.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {labs.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              style={{
                display: "block",
                background: "var(--night-850)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-card)",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "border-color var(--dur-hover) var(--ease-out-strong), background var(--dur-hover) var(--ease-out-strong)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--line-gold)";
                el.style.background = "var(--night-800)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "";
                el.style.background = "";
              }}
            >
              <p style={{ color: "var(--gold)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
                Phase {lab.phase}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h3)", color: "var(--ivory)", marginBottom: ".5rem" }}>
                {lab.title}
              </p>
              <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-small)" }}>
                {lab.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
