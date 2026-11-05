import { BRAND } from "@/lib/config";

const S: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--fs-small)",
  color: "var(--ivory-dim)",
  lineHeight: 1.75,
};

const H2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--fs-h3)",
  color: "var(--gold)",
  margin: "0 0 .625rem",
};

export default function MentionsLegalesPage() {
  return (
    <main id="main" style={{ minHeight: "100svh", padding: "clamp(3rem, 6vw, 6rem) var(--gutter)", maxWidth: "52rem", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", color: "var(--ivory)", marginBottom: "2rem" }}>
        Mentions Légales
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", background: "var(--night-850)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "var(--r-xl)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <section>
          <h2 style={H2}>1. Éditeur de la Plateforme</h2>
          <p style={S}>
            Le site web <strong style={{ color: "var(--ivory)" }}>{BRAND.name}</strong> est édité par la société IZEM MOTORS SARL, immatriculée au Registre du Commerce d&apos;Alger sous le numéro RC-16/00-1234567B.
          </p>
          <p style={{ ...S, marginTop: ".75rem" }}>
            Siège social : {BRAND.address}<br />
            Téléphone : {BRAND.phone}<br />
            E-mail : {BRAND.email}
          </p>
        </section>

        <section>
          <h2 style={H2}>2. Hébergement</h2>
          <p style={S}>
            Le site est hébergé sur une infrastructure Cloud haute disponibilité avec des serveurs sécurisés et conformes aux normes internationales de protection des données.
          </p>
        </section>

        <section>
          <h2 style={H2}>3. Propriété Intellectuelle</h2>
          <p style={S}>
            L&apos;ensemble des contenus, marques, logos, photographies et éléments graphiques figurant sur ce site sont la propriété exclusive de IZEM MOTORS ou font l&apos;objet d&apos;une licence d&apos;exploitation. Toute reproduction totale ou partielle sans accord préalable écrit est formellement prohibée.
          </p>
        </section>
      </div>
    </main>
  );
}
