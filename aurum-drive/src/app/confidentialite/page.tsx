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

export default function ConfidentialitePage() {
  return (
    <main id="main" style={{ minHeight: "100svh", padding: "clamp(3rem, 6vw, 6rem) var(--gutter)", maxWidth: "52rem", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", color: "var(--ivory)", marginBottom: "2rem" }}>
        Politique de Confidentialité
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", background: "var(--night-850)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "var(--r-xl)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <section>
          <h2 style={H2}>1. Collecte des Données Personnelles</h2>
          <p style={S}>
            Dans le cadre de votre demande de réservation, nous collectons votre nom, prénom, numéro de téléphone, adresse e-mail ainsi que les informations relatives à votre permis de conduire (date d&apos;obtention et date de naissance) aux fins exclusives de traitement de votre dossier.
          </p>
        </section>

        <section>
          <h2 style={H2}>2. Utilisation &amp; Confidentialité</h2>
          <p style={S}>
            Vos données personnelles ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales. Elles sont conservées de manière sécurisée et ne sont accessibles qu&apos;aux membres habilités de notre équipe pour la gestion de votre location.
          </p>
        </section>

        <section>
          <h2 style={H2}>3. Vos Droits</h2>
          <p style={S}>
            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles sur simple demande par e-mail adressée à {BRAND.email}.
          </p>
        </section>
      </div>
    </main>
  );
}
