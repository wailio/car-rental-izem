"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ArrowUpRight, MessageCircle, ChevronDown, Play } from "lucide-react";

/**
 * /lab/components — Phase 2.3
 *
 * All component variants with every interactive state designed.
 * Nothing left to browser defaults.
 * noindex — development only.
 */

// ── Accordion (FAQ) ──────────────────────────────────────────────────────────
function AccordionItem({
  number,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  number: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid var(--line)",
        background: isOpen ? "var(--night-800)" : "var(--night-850)",
        overflow: "hidden",
        transition: "background var(--dur-ui) var(--ease-out-strong)",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-small)",
            color: isOpen ? "var(--gold)" : "var(--ivory-mute)",
            transition: "color var(--dur-ui) var(--ease-out-strong)",
            minWidth: "1.5rem",
          }}
        >
          {number}
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body)",
            color: isOpen ? "var(--ivory)" : "var(--ivory-dim)",
            fontWeight: isOpen ? 600 : 400,
            transition: "color var(--dur-ui) var(--ease-out-strong)",
          }}
        >
          {question}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "var(--gold)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--dur-ui) var(--ease-out-strong)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Body — grid-template-rows trick for smooth height */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows var(--dur-panel) var(--ease-drawer)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              padding: "0 1.5rem 1.25rem calc(1.5rem + 1rem + 1.5rem)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-body)",
              lineHeight: 1.65,
              color: "var(--ivory-dim)",
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = "1rem", rounded = "var(--r-sm)" }: {
  width?: string; height?: string; rounded?: string;
}) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: rounded }}
      aria-hidden="true"
    />
  );
}

// ── Fleet Card ────────────────────────────────────────────────────────────────
function FleetCard({ name, brand, price, available }: {
  name: string; brand: string; price: string; available: boolean;
}) {
  return (
    <div
      className="spotlight-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "transform var(--dur-hover) var(--ease-out-strong)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
    >
      {/* Availability */}
      <span
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: ".375rem",
          fontSize: "var(--fs-micro)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: available ? "var(--ok)" : "var(--ivory-mute)",
          fontFamily: "var(--font-body)",
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: available ? "var(--ok)" : "var(--ivory-mute)",
          }}
        />
        {available ? "Disponible" : "Indisponible"}
      </span>

      {/* Car placeholder */}
      <div
        style={{
          height: "120px",
          background: "var(--night-900)",
          borderRadius: "var(--r-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ivory-mute)",
          fontSize: "var(--fs-small)",
          fontFamily: "var(--font-body)",
        }}
      >
        [photo véhicule]
      </div>

      {/* Brand + Name */}
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: ".25rem" }}>
          {brand}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "var(--ivory)", lineHeight: 1.1 }}>
          {name}
        </p>
      </div>

      {/* Chips */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {["5 places", "Automatique", "Essence"].map((chip) => (
          <span key={chip} style={{
            fontSize: "var(--fs-micro)", letterSpacing: ".04em",
            border: "1px solid var(--line)", borderRadius: "var(--r-pill)",
            padding: ".25rem .625rem", color: "var(--ivory-dim)",
            fontFamily: "var(--font-body)",
          }}>
            {chip}
          </span>
        ))}
      </div>

      {/* Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.625rem",
            color: "var(--gold)",
            fontVariantNumeric: "tabular-nums lining-nums",
          }}>
            {price}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-mute)", marginLeft: ".375rem" }}>DA/jour</span>
        </div>
        <button
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: "50%",
            background: "var(--gold)", border: "none", cursor: "pointer",
            color: "var(--night-950)",
            transition: "transform var(--dur-hover) var(--ease-out-strong)",
          }}
          aria-label={`Réserver ${name}`}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ComponentsLabPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Puis-je réserver sans paiement en ligne ?",
      answer: "Oui. Aucun paiement en ligne n'est requis. La réservation est confirmée par WhatsApp ou téléphone, et le règlement se fait directement à la remise des clés.",
    },
    {
      question: "La livraison à l'aéroport est-elle incluse ?",
      answer: "La livraison et le retour à l'aéroport Houari Boumediene d'Alger sont inclus dans le tarif. Notre chauffeur vous attend au terminal à l'heure convenue.",
    },
    {
      question: "Quelle caution est demandée ?",
      answer: "La caution varie selon la catégorie du véhicule. Elle est restituée intégralement à la restitution du véhicule en bon état.",
    },
  ];

  const section = (title: string, children: React.ReactNode) => (
    <section style={{ marginBottom: "5rem" }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "var(--fs-h3)",
        color: "var(--ivory)", marginBottom: "2rem",
        borderBottom: "1px solid var(--line)", paddingBottom: "1rem",
      }}>
        {title}
      </h2>
      {children}
    </section>
  );

  const row = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-mute)", minWidth: "120px" }}>
        {label}
      </span>
      {children}
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--night-950)", padding: "4rem var(--gutter)", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
          <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
            Lab / Phase 2.3
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ivory)" }}>
            Composants — États Complets
          </h1>
        </div>

        {/* ── BUTTONS ─────────────────────────────────────────────────────── */}
        {section("Boutons", <>
          {row("Primaire (repos)", (
            <button className="btn-key">
              Voir les voitures
              <span className="chip"><ArrowUpRight size={16} /></span>
            </button>
          ))}
          {row("Primaire (hover →)", (
            <button className="btn-key" style={{ boxShadow: "0 14px 50px -10px rgba(194,165,107,.65)" }}>
              Réserver maintenant
              <span className="chip"><ArrowUpRight size={16} /></span>
            </button>
          ))}
          {row("Primaire (désactivé)", (
            <button className="btn-key" disabled aria-disabled="true">
              Indisponible
              <span className="chip"><ArrowUpRight size={16} /></span>
            </button>
          ))}
          {row("Secondaire", (
            <button className="btn-secondary">
              <MessageCircle size={16} />
              Écrire sur WhatsApp
            </button>
          ))}
          {row("Secondaire (hover →)", (
            <button className="btn-secondary" style={{ borderColor: "rgba(255,255,255,.35)", background: "rgba(255,255,255,.05)" }}>
              Voir la flotte
            </button>
          ))}
          {row("Lien texte", (
            <a href="#" style={{
              fontFamily: "var(--font-body)", fontSize: "var(--fs-body)",
              color: "var(--ivory)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: ".375rem",
              borderBottom: "1px solid var(--line-gold)", paddingBottom: "2px",
            }}>
              Toutes les questions <ArrowUpRight size={14} />
            </a>
          ))}
          {row("Icon button", (
            <>
              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid var(--line)", background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--ivory-dim)",
              }} aria-label="Lire la vidéo">
                <Play size={18} />
              </button>
              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid var(--line)", background: "var(--night-800)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--ivory)",
              }} aria-label="Lire la vidéo (hover)">
                <Play size={18} />
              </button>
            </>
          ))}
          {row("Pill / chip", (
            <>
              {["Citadine", "SUV", "Berline"].map((label) => (
                <button key={label} style={{
                  height: 32, padding: "0 .875rem", borderRadius: "var(--r-pill)",
                  border: "1px solid var(--line)", background: "transparent",
                  color: "var(--ivory-dim)", fontSize: "var(--fs-small)",
                  fontFamily: "var(--font-body)", cursor: "pointer",
                }}>
                  {label}
                </button>
              ))}
              <button style={{
                height: 32, padding: "0 .875rem", borderRadius: "var(--r-pill)",
                border: "1px solid var(--gold)", background: "rgba(194,165,107,.12)",
                color: "var(--gold)", fontSize: "var(--fs-small)",
                fontFamily: "var(--font-body)", cursor: "pointer",
              }}>
                Économique ✓
              </button>
            </>
          ))}
        </>)}

        {/* ── STATUS CHIPS ─────────────────────────────────────────────────── */}
        {section("Statuts & Badges", <>
          {row("Statuts", (
            <>
              {[
                { label: "Disponible",   color: "var(--ok)" },
                { label: "Indisponible", color: "var(--ivory-mute)" },
                { label: "Confirmée",    color: "var(--ok)" },
                { label: "Erreur",       color: "var(--err)" },
                { label: "Attention",    color: "var(--warn)" },
              ].map(({ label, color }) => (
                <span key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: ".375rem",
                  fontSize: "var(--fs-micro)", letterSpacing: ".08em", textTransform: "uppercase",
                  color, fontFamily: "var(--font-body)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </>
          ))}
        </>)}

        {/* ── FLEET CARDS ──────────────────────────────────────────────────── */}
        {section("Carte Véhicule — Ticket", (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            <FleetCard name="Golf 7" brand="Volkswagen" price="3 500" available={true} />
            <FleetCard name="Picanto" brand="Kia" price="2 200" available={true} />
            <FleetCard name="T-Cross" brand="Volkswagen" price="17 000" available={true} />
          </div>
        ))}

        {/* ── SKELETON ─────────────────────────────────────────────────────── */}
        {section("Skeleton — Shimmer", (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: "var(--night-850)", border: "1px solid var(--line)",
                borderRadius: "var(--r-card)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem"
              }}>
                <Skeleton height="1.5rem" width="60%" />
                <Skeleton height="120px" rounded="var(--r-sm)" />
                <Skeleton height="1rem" width="40%" />
                <Skeleton height="1.5rem" width="80%" />
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <Skeleton height="1.5rem" width="5rem" />
                  <Skeleton height="1.5rem" width="5rem" />
                  <Skeleton height="1.5rem" width="4rem" />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* ── ACCORDION ────────────────────────────────────────────────────── */}
        {section("Accordéon — FAQ", (
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", maxWidth: "720px" }}>
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                number={String(i + 1).padStart(2, "0")}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        ))}

        {/* ── FORM INPUTS ──────────────────────────────────────────────────── */}
        {section("Formulaire — Champs", (
          <div style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Text input — idle */}
            <div style={{ position: "relative" }}>
              <label style={{
                position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)",
                color: "var(--ivory-mute)", fontSize: "var(--fs-body)", pointerEvents: "none",
                transition: "all var(--dur-hover) var(--ease-out-strong)",
              }}>
                Nom complet
              </label>
              <input
                type="text"
                placeholder=" "
                style={{
                  width: "100%", height: "56px",
                  background: "var(--night-800)", border: "1px solid var(--line)",
                  borderRadius: "var(--r-input)", color: "var(--ivory)",
                  padding: "0 1rem", fontSize: "var(--fs-body)",
                  fontFamily: "var(--font-body)", outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(194,165,107,.14)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
              />
            </div>

            {/* Phone input */}
            <input
              type="tel"
              placeholder="0555 12 34 56"
              style={{
                width: "100%", height: "56px",
                background: "var(--night-800)", border: "1px solid var(--line)",
                borderRadius: "var(--r-input)", color: "var(--ivory)",
                padding: "0 1rem", fontSize: "var(--fs-body)",
                fontFamily: "var(--font-body)", outline: "none",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(194,165,107,.14)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
            />

            {/* Error state */}
            <div>
              <input
                type="tel"
                defaultValue="06 xx xx"
                style={{
                  width: "100%", height: "56px",
                  background: "var(--night-800)", border: "1px solid var(--err)",
                  borderRadius: "var(--r-input)", color: "var(--ivory)",
                  padding: "0 1rem", fontSize: "var(--fs-body)",
                  fontFamily: "var(--font-body)", outline: "none",
                  boxShadow: "0 0 0 4px rgba(229,103,90,.10)",
                }}
              />
              <p style={{ color: "var(--err)", fontSize: "var(--fs-small)", marginTop: ".375rem", fontFamily: "var(--font-body)" }}>
                Numéro invalide. Format attendu : 0555 12 34 56
              </p>
            </div>
          </div>
        ))}

        {/* ── COLOUR PALETTE ───────────────────────────────────────────────── */}
        {section("Palette de Couleurs", (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
            {[
              { name: "--night-950", value: "#06080C" },
              { name: "--night-900", value: "#0B0E14" },
              { name: "--night-850", value: "#10141C" },
              { name: "--night-800", value: "#161B25" },
              { name: "--night-700", value: "#1E2430" },
              { name: "--night-600", value: "#2A3140" },
              { name: "--ivory", value: "#F4EFE6" },
              { name: "--ivory-dim", value: "#B5B0A5" },
              { name: "--ivory-mute", value: "#8B8A86" },
              { name: "--gold", value: "#0B7584" },
              { name: "--gold-hi", value: "#E6CD96" },
              { name: "--gold-lo", value: "#8E7544" },
              { name: "--headlight", value: "#FFF1D0" },
              { name: "--ok", value: "#2FA37A" },
              { name: "--err", value: "#E5675A" },
              { name: "--warn", value: "#E3B04B" },
            ].map(({ name, value }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: ".5rem", alignItems: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "var(--r-md)",
                  background: value, border: "1px solid var(--line)",
                }} />
                <code style={{ fontSize: ".65rem", color: "var(--ivory-mute)", fontFamily: "monospace" }}>
                  {name}
                </code>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
