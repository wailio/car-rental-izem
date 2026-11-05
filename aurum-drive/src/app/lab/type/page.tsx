import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab — Typographie",
  robots: { index: false, follow: false },
};

/**
 * /lab/type — Phase 2.2 Type Duel
 *
 * Tests Candidate A (Newsreader + Hanken Grotesk) vs
 * Candidate B (Instrument Serif + Instrument Sans)
 * on the real content: hero headline, fleet card, price block, form field.
 *
 * Score each candidate with the rubric from 07-IDEAS-LAB.md.
 * Log the winner in DECISIONS.md under D-06.
 */
export default function TypeLabPage() {
  const sampleCars = [
    { brand: "Volkswagen", name: "Golf 7", price: "3 500" },
    { brand: "Kia", name: "Picanto", price: "2 200" },
    { brand: "Renault", name: "Clio 4", price: "2 800" },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--night-900)", padding: "4rem var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem", borderBottom: "1px solid var(--line)", paddingBottom: "2rem" }}>
          <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
            Lab / Phase 2.2
          </p>
          <h1 style={{ fontSize: "var(--fs-h3)", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "1rem" }}>
            Duel Typographique
          </h1>
          <p style={{ color: "var(--ivory-dim)", fontSize: "var(--fs-body)" }}>
            Candidat A — Newsreader + Hanken Grotesk (éditorial, calme, sérieux)
            <br />
            Candidat B — Instrument Serif + Instrument Sans (élégant, condensé, moderne)
          </p>
        </div>

        {/* ── CANDIDATE A ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "6rem" }}>
          <span style={{
            display: "inline-block",
            background: "var(--night-800)", border: "1px solid var(--line-gold)",
            color: "var(--gold)", fontSize: "var(--fs-micro)", letterSpacing: ".1em",
            textTransform: "uppercase", padding: ".25rem .75rem", borderRadius: "var(--r-pill)",
            marginBottom: "2rem"
          }}>
            Candidat A — Newsreader + Hanken Grotesk
          </span>

          {/* Hero headline — Candidate A */}
          <div style={{ fontFamily: "var(--font-newsreader)", marginBottom: "3rem" }}>
            <p style={{ color: "var(--ivory-mute)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".75rem" }}>
              Titre héros (112 px)
            </p>
            <p style={{ fontSize: "var(--fs-hero)", lineHeight: 1.0, letterSpacing: "-0.025em", color: "var(--ivory)", fontWeight: 500 }}>
              Atterrissez.
              <br />
              <em style={{ fontStyle: "italic" }}>Votre voiture</em>
              <br />
              vous attend.
            </p>
          </div>

          {/* Fleet card — Candidate A */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "var(--ivory-mute)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".75rem" }}>
              Carte véhicule
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {sampleCars.map((car) => (
                <div key={car.name} style={{
                  background: "var(--night-850)", border: "1px solid var(--line)",
                  borderRadius: "var(--r-card)", padding: "1.5rem", minWidth: "220px"
                }}>
                  <p style={{ fontFamily: "var(--font-hanken)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: ".25rem" }}>
                    {car.brand}
                  </p>
                  <p style={{ fontFamily: "var(--font-newsreader)", fontSize: "1.5rem", fontWeight: 600, color: "var(--ivory)", marginBottom: ".5rem" }}>
                    {car.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-hanken)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)" }}>
                    à partir de
                  </p>
                  <p style={{ fontFamily: "var(--font-newsreader)", fontSize: "1.75rem", fontWeight: 700, color: "var(--gold)", fontVariantNumeric: "tabular-nums lining-nums" }}>
                    {car.price} <span style={{ fontSize: "1rem", fontWeight: 400 }}>DA/j</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Body text — Candidate A */}
          <p style={{ fontFamily: "var(--font-hanken)", fontSize: "var(--fs-body)", lineHeight: 1.65, color: "var(--ivory-dim)", maxWidth: "60ch" }}>
            Votre véhicule vous attend à l&apos;aéroport d&apos;Alger Houari Boumediene, clés en main. Livraison directe au terminal, sans file d&apos;attente. Assistance disponible à toute heure.
          </p>
        </section>

        <hr style={{ borderColor: "var(--line)", marginBottom: "6rem" }} />

        {/* ── CANDIDATE B ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "6rem" }}>
          <span style={{
            display: "inline-block",
            background: "var(--gold-lo)", border: "1px solid var(--gold)",
            color: "var(--night-950)", fontSize: "var(--fs-micro)", letterSpacing: ".1em",
            textTransform: "uppercase", padding: ".25rem .75rem", borderRadius: "var(--r-pill)",
            marginBottom: "2rem"
          }}>
            Candidat B — Instrument Serif + Instrument Sans ← Sélection active
          </span>

          {/* Hero headline — Candidate B */}
          <div style={{ fontFamily: "var(--font-instrument-serif)", marginBottom: "3rem" }}>
            <p style={{ color: "var(--ivory-mute)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".75rem", fontFamily: "var(--font-instrument-sans)" }}>
              Titre héros (112 px)
            </p>
            <p style={{ fontSize: "var(--fs-hero)", lineHeight: 1.0, letterSpacing: "-0.025em", color: "var(--ivory)", fontWeight: 400 }}>
              Atterrissez.
              <br />
              <em style={{ fontStyle: "italic" }}>Votre voiture</em>
              <br />
              vous attend.
            </p>
          </div>

          {/* Fleet card — Candidate B */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-instrument-sans)", color: "var(--ivory-mute)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".75rem" }}>
              Carte véhicule
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {sampleCars.map((car) => (
                <div key={car.name} style={{
                  background: "var(--night-850)", border: "1px solid var(--line)",
                  borderRadius: "var(--r-card)", padding: "1.5rem", minWidth: "220px"
                }}>
                  <p style={{ fontFamily: "var(--font-instrument-sans)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: ".25rem" }}>
                    {car.brand}
                  </p>
                  <p style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--ivory)", marginBottom: ".5rem" }}>
                    {car.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-instrument-sans)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)" }}>
                    à partir de
                  </p>
                  <p style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--gold)", fontVariantNumeric: "tabular-nums lining-nums" }}>
                    {car.price} <span style={{ fontFamily: "var(--font-instrument-sans)", fontSize: "1rem" }}>DA/j</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Body text — Candidate B */}
          <p style={{ fontFamily: "var(--font-instrument-sans)", fontSize: "var(--fs-body)", lineHeight: 1.65, color: "var(--ivory-dim)", maxWidth: "60ch" }}>
            Votre véhicule vous attend à l&apos;aéroport d&apos;Alger Houari Boumediene, clés en main. Livraison directe au terminal, sans file d&apos;attente. Assistance disponible à toute heure.
          </p>
        </section>

        {/* ── SCORING RUBRIC ───────────────────────────────────────────────── */}
        <section style={{ background: "var(--night-850)", borderRadius: "var(--r-card)", padding: "2rem", border: "1px solid var(--line)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h3)", color: "var(--ivory)", marginBottom: "1.5rem" }}>
            Rubrique de score
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                <th style={{ textAlign: "left", padding: ".5rem 1rem .5rem 0", color: "var(--ivory)" }}>Critère</th>
                <th style={{ textAlign: "center", padding: ".5rem", color: "var(--ivory)" }}>A — Newsreader</th>
                <th style={{ textAlign: "center", padding: ".5rem", color: "var(--gold)" }}>B — Instrument</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Lisibilité à 16 px (corps)", "✓", "✓"],
                ["Rendu à 112 px (titre héros)", "✓", "✓"],
                ["Couverture française complète (éàç œ etc.)", "✓", "✓"],
                ["Chiffres tabulaires pour les prix", "✓", "✓"],
                ["Distinctif / non-générique", "✓", "✓✓"],
                ["Cohérence serif × sans-serif", "✓", "✓✓"],
                ["Poids de fichier woff2 < 70 KB/style", "~60 KB", "~55 KB"],
                ["Partenaire arabe potentiel", "✓", "✓"],
              ].map(([criterion, a, b]) => (
                <tr key={String(criterion)} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: ".5rem 1rem .5rem 0" }}>{criterion}</td>
                  <td style={{ textAlign: "center", padding: ".5rem" }}>{a}</td>
                  <td style={{ textAlign: "center", padding: ".5rem", color: "var(--gold)" }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)" }}>
            <strong style={{ color: "var(--ivory)" }}>Décision D-06 :</strong> Candidat B sélectionné. Instrument Serif offre un caractère plus distinctif au titre héros — son italique est naturel et élégant. Instrument Sans est neutre et propre en corps, sans les erreurs de lecture d&apos;Inter ou Poppins. Logger dans DECISIONS.md.
          </p>
        </section>
      </div>
    </main>
  );
}
