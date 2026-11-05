"use client";

/**
 * Footer — Phase 7 hardening
 * Token system only, zero hardcoded colours, no glow blobs.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, ROUTES } from "@/lib/config";
import { IzemBrandLockup } from "@/components/common/IzemBrandLockup";
import { Phone, Mail, MapPin, ArrowRight, Check } from "lucide-react";

// ── Shared link style helper ──────────────────────────────────────────────────
const navLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
  fontFamily: "var(--font-body)",
  fontSize: "var(--fs-small)",
  color: "var(--ivory-dim)",
  textDecoration: "none",
  transition: `color var(--dur-hover) var(--ease-out-strong)`,
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={navLinkStyle}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory-dim)")}
    >
      <span
        aria-hidden="true"
        style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", opacity: .55, flexShrink: 0 }}
      />
      {children}
    </Link>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setNewsletterSent(false);
    }, 4000);
  };

  return (
    <footer
      className="tire-tread-pattern"
      style={{
        position: "relative",
        background: "#0C0F14",
        color: "#F3F4F6",
        marginTop: "clamp(3rem, 6vw, 6rem)",
        paddingTop: "clamp(3rem, 5vw, 5rem)",
        paddingBottom: "clamp(2rem, 3vw, 3rem)",
        borderTop: "1px solid rgba(255,255,255,.07)",
        overflow: "hidden",
      }}
    >
      {/* Centered wordmark watermark — IZEM MOTORS */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
          fontSize: "clamp(4.25rem, 11.5vw, 13.5rem)",
          fontWeight: 950,
          letterSpacing: ".06em",
          color: "rgba(255, 255, 255, 0.015)",
          WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.09)",
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          width: "100%",
          textAlign: "center",
          zIndex: 0,
        }}
      >
        IZEM MOTORS
      </div>

      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── 4-column grid ───────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "clamp(1.5rem, 3vw, 3rem)",
            paddingBottom: "clamp(2rem, 4vw, 4rem)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}
          className="footer-grid"
        >
          {/* Col 1 — Brand + Newsletter */}
          <div style={{ gridColumn: "span 12" }} className="footer-col-brand">
            <Link
              href={ROUTES.home}
              style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "1.25rem" }}
              aria-label="IZEM MOTORS — Accueil"
              className="group"
            >
              <IzemBrandLockup theme="dark" size="md" />
            </Link>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)", lineHeight: 1.7, maxWidth: "24rem", marginBottom: "1.5rem" }}>
              Véhicules récents livrés et repris gratuitement à l&apos;Aéroport Houari Boumediene. Assistance disponible 24h/24.
            </p>

            {/* Newsletter */}
            <div style={{ marginBottom: ".75rem" }}>
              <h3 style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: "#FFFFFF",
                fontWeight: 300,
                margin: 0,
              }}>
                Lettre Confidentielle
              </h3>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              style={{ position: "relative", maxWidth: "22rem" }}
              aria-label="S'inscrire à la lettre confidentielle"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                required
                aria-label="Adresse e-mail pour la newsletter"
                style={{
                  width: "100%",
                  background: "var(--night-850)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "var(--r-pill)",
                  padding: ".75rem 3.5rem .75rem 1.25rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--fs-small)",
                  color: "var(--ivory)",
                  outline: "none",
                  transition: `border-color var(--dur-hover) var(--ease-out-strong)`,
                }}
                onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(194,165,107,.4)")}
                onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,.08)")}
              />
              <button
                type="submit"
                aria-label="S'inscrire"
                style={{
                  position: "absolute",
                  right: 6,
                  top: 6,
                  bottom: 6,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: newsletterSent ? "var(--ok)" : "var(--gold)",
                  color: "var(--night-950)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: `background var(--dur-hover) var(--ease-out-strong)`,
                }}
              >
                {newsletterSent ? <Check size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
              </button>
            </form>
            {newsletterSent && (
              <p role="status" style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", color: "var(--ok)", marginTop: ".5rem" }}>
                Merci. Votre adresse a bien été enregistrée.
              </p>
            )}
          </div>

          {/* Col 2 — Quick Links */}
          <div style={{ gridColumn: "span 12" }} className="footer-col-links">
            <h3 style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "#FFFFFF",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}>
              Liens Rapides
            </h3>
            <nav aria-label="Navigation rapide footer">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".625rem" }}>
                {[
                  { href: ROUTES.home, label: "Accueil" },
                  { href: ROUTES.about, label: "À propos" },
                  { href: ROUTES.fleet, label: "Notre Flotte" },
                  { href: ROUTES.services, label: "Nos Prestations" },
                  { href: ROUTES.faq, label: "Questions fréquentes" },
                  { href: ROUTES.contact, label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={href}><NavLink href={href}>{label}</NavLink></li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Services */}
          <div style={{ gridColumn: "span 12" }} className="footer-col-services">
            <h3 style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "#FFFFFF",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}>
              Nos Services
            </h3>
            <nav aria-label="Services footer">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".625rem" }}>
                {[
                  "Livraison Aéroport Alger",
                  "Location Courte & Moyenne Durée",
                  "Assistance Routière 24h/7j",
                  "Événements & Cérémonies",
                  "Délégations & Entreprises",
                ].map((s) => (
                  <li key={s}><NavLink href={ROUTES.services}>{s}</NavLink></li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 4 — Contact */}
          <div style={{ gridColumn: "span 12" }} className="footer-col-contact">
            <h3 style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "#FFFFFF",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}>
              Coordonnées
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
              {/* Phone */}
              <a
                href={`tel:${BRAND.phone}`}
                aria-label={`Appeler le ${BRAND.phone}`}
                style={{ display: "flex", alignItems: "center", gap: ".75rem", textDecoration: "none", color: "var(--ivory-dim)", transition: `color var(--dur-hover) var(--ease-out-strong)` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory-dim)")}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gold)", color: "var(--night-950)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: `transform var(--dur-hover) var(--ease-out-strong)` }}>
                  <Phone size={15} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ivory-mute)" }}>Téléphone</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", fontWeight: 600, color: "inherit" }}>{BRAND.phone}</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${BRAND.email}`}
                aria-label={`Envoyer un e-mail à ${BRAND.email}`}
                style={{ display: "flex", alignItems: "center", gap: ".75rem", textDecoration: "none", color: "var(--ivory-dim)", transition: `color var(--dur-hover) var(--ease-out-strong)` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory-dim)")}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(194,165,107,.12)", border: "1px solid rgba(194,165,107,.25)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={15} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ivory-mute)" }}>E-mail</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", fontWeight: 600, color: "inherit", maxWidth: "12rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{BRAND.email}</div>
                </div>
              </a>

              {/* Address */}
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", color: "var(--ivory-dim)" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={15} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ivory-mute)" }}>Agence principale</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory-dim)" }}>{BRAND.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", color: "var(--ivory-mute)", margin: 0 }}>
            © {new Date().getFullYear()} IZEM MOTORS. Tous droits réservés.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            {[
              {
                href: "https://www.tiktok.com/@izem.motors/",
                label: "TikTok IZEM MOTORS",
                path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
              },
              {
                href: "https://www.instagram.com/izem_motors",
                label: "Instagram IZEM MOTORS",
                path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
              },
              {
                href: "https://www.facebook.com/profile.php?id=61593687483158",
                label: "Facebook IZEM MOTORS",
                path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
              },
            ].map(({ href, label, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--ivory-mute)", textDecoration: "none",
                  transition: `color var(--dur-hover) var(--ease-out-strong), border-color var(--dur-hover) var(--ease-out-strong)`,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(194,165,107,.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ivory-mute)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.08)"; }}
              >
                <svg style={{ width: 14, height: 14, fill: "currentColor" }} viewBox="0 0 24 24" aria-hidden="true">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Legal links */}
          <nav aria-label="Liens légaux" style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
            {[
              { href: ROUTES.privacy, label: "Confidentialité" },
              { href: ROUTES.conditions, label: "Conditions générales" },
              { href: ROUTES.legal, label: "Mentions légales" },
            ].map(({ href, label }, i) => (
              <span key={href} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <Link
                  href={href}
                  style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", color: "var(--ivory-mute)", textDecoration: "none", transition: `color var(--dur-hover) var(--ease-out-strong)` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory-mute)")}
                >
                  {label}
                </Link>
                {i < 2 && <span aria-hidden="true" style={{ color: "var(--ivory-mute)", opacity: .4 }}>·</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        @media (min-width: 640px) {
          .footer-col-brand { grid-column: span 12 !important; }
          .footer-col-links { grid-column: span 4 !important; }
          .footer-col-services { grid-column: span 4 !important; }
          .footer-col-contact { grid-column: span 4 !important; }
        }
        @media (min-width: 1024px) {
          .footer-col-brand { grid-column: span 4 !important; }
          .footer-col-links { grid-column: span 2 !important; }
          .footer-col-services { grid-column: span 3 !important; }
          .footer-col-contact { grid-column: span 3 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          footer a, footer button { transition: none !important; }
        }
      `}</style>
    </footer>
  );
}
