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

export default function ConditionsPage() {
  return (
    <main id="main" style={{ minHeight: "100svh", padding: "clamp(3rem, 6vw, 6rem) var(--gutter)", maxWidth: "52rem", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", color: "var(--ivory)", marginBottom: "2rem" }}>
        Conditions Générales de Location
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", background: "var(--night-850)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "var(--r-xl)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <section>
          <h2 style={H2}>1. Conditions d&apos;Éligibilité du Conducteur</h2>
          <p style={S}>
            Le locataire et tout conducteur autorisé doivent être âgés au minimum de 21 ans (23 ans pour les Berlines et SUV, 25 ans pour la catégorie Premium) et être titulaires d&apos;un permis de conduire valide depuis au moins 1 à 3 ans selon la catégorie du véhicule loué.
          </p>
        </section>

        <section>
          <h2 style={H2}>2. Réservation &amp; Confirmation</h2>
          <p style={S}>
            Toute demande effectuée via le site Internet constitue une pré-réservation sans paiement immédiat. La réservation ne devient définitive qu&apos;après confirmation écrite émise par {BRAND.name} par e-mail ou WhatsApp.
          </p>
        </section>

        <section>
          <h2 style={H2}>3. Caution &amp; Règlement</h2>
          <p style={S}>
            Une caution sous forme de chèque certifié, pré-autorisation de carte bancaire ou espèces est déposée au moment de la prise en charge du véhicule. Cette caution est intégralement restituée à la restitution du véhicule après constat contradictoire de l&apos;état des lieux.
          </p>
        </section>

        <section>
          <h2 style={H2}>4. Utilisation du Véhicule</h2>
          <p style={S}>
            Le véhicule doit être conduit sur les voies carrossables autorisées et dans le strict respect du Code de la Route en vigueur en République Algérienne Démocratique et Populaire.
          </p>
        </section>
      </div>
    </main>
  );
}
