"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/config";
import { MessageSquare, Home, Printer } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingData {
  fullName?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  category?: string;
  pickupAt?: string;
  returnAt?: string;
  pickupLieu?: string;
  returnLieu?: string;
  rentalDays?: number;
  totalEstimated?: number;
  deposit?: number;
  agency?: string;
}

// ─── Status timeline steps ────────────────────────────────────────────────────

const STEPS = [
  { label: "Demande reçue", done: true },
  { label: "Étude par l'agence", done: false },
  { label: "Réponse écrite", done: false },
  { label: "Remise des clés", done: false },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-DZ", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const resolvedParams = use(params);
  const ref = resolvedParams.ref;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(ref);
      if (saved) {
        try {
          setBookingData(JSON.parse(saved));
        } catch {
          // sessionStorage value unreadable — show neutral state
        }
      }
    }
  }, [ref]);

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je vous contacte concernant ma réservation ref : ${ref}`,
  );
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${whatsappMsg}`;

  return (
    <main
      id="main"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 6vw, 80px) clamp(16px, 4vw, 32px)",
        background: "var(--night-950)",
      }}
    >
      {/* ── Boarding pass card ────────────────────────────────────────── */}
      <article
        aria-label="Confirmation de réservation"
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "var(--night-850)",
          borderRadius: "var(--r-xl)",
          overflow: "hidden",
          boxShadow: "var(--elev-3)",
        }}
      >
        {/* Gold hairline accent */}
        <div
          aria-hidden="true"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-hi) 50%, var(--gold) 70%, transparent 100%)",
          }}
        />

        {/* Card header: reference + status */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
            padding: "clamp(24px, 4vw, 48px) clamp(20px, 4vw, 40px) 0",
            flexWrap: "wrap",
          }}
        >
          {/* Left: ref + vehicle */}
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            {/* Label */}
            <p
              style={{
                fontSize: "var(--fs-micro)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--ivory-mute)",
                marginBottom: "6px",
                fontFamily: "var(--font-body)",
              }}
            >
              Référence
            </p>

            {/* Reference number — prominent, monospaced */}
            <p
              style={{
                fontFamily: "monospace, var(--font-display)",
                fontSize: "clamp(1.25rem, 1rem + 1vw, 1.75rem)",
                fontWeight: 700,
                color: "var(--gold)",
                letterSpacing: "0.05em",
                marginBottom: "16px",
                wordBreak: "break-all",
              }}
            >
              {ref}
            </p>

            {/* Vehicle name */}
            {bookingData?.vehicle && (
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1rem, 0.85rem + 0.8vw, 1.375rem)",
                  fontWeight: 600,
                  color: "var(--ivory)",
                  marginBottom: "8px",
                }}
              >
                {bookingData.vehicle}
              </p>
            )}

            {/* Dates */}
            {(bookingData?.pickupAt || bookingData?.returnAt) && (
              <p
                style={{
                  fontSize: "var(--fs-small)",
                  color: "var(--ivory-dim)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {formatDate(bookingData.pickupAt)}
                {" → "}
                {formatDate(bookingData.returnAt)}
                {bookingData.rentalDays
                  ? ` · ${bookingData.rentalDays} jours`
                  : ""}
              </p>
            )}

            {/* Lieu */}
            {bookingData?.pickupLieu && (
              <p
                style={{
                  fontSize: "var(--fs-micro)",
                  color: "var(--ivory-mute)",
                  fontFamily: "var(--font-body)",
                  marginTop: "4px",
                }}
              >
                {bookingData.pickupLieu}
                {bookingData.returnLieu &&
                bookingData.returnLieu !== bookingData.pickupLieu
                  ? ` → ${bookingData.returnLieu}`
                  : ""}
              </p>
            )}
          </div>

          {/* Right: status badge */}
          <div
            style={{
              flexShrink: 0,
              paddingTop: "4px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              {/* Green dot */}
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--ok)",
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px rgba(47, 163, 122, 0.18)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--fs-small)",
                  fontWeight: 600,
                  color: "var(--ok)",
                }}
              >
                Demande reçue
              </span>
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "rgba(255,255,255,.07)",
            margin: "clamp(20px, 3vw, 32px) clamp(20px, 4vw, 40px)",
          }}
        />

        {/* ── Confirmation heading (screen reader announcement) ────────── */}
        <div
          style={{
            padding: "0 clamp(20px, 4vw, 40px)",
          }}
        >
          <h1
            role="status"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.5rem)",
              fontWeight: 700,
              color: "var(--ivory)",
              marginBottom: "8px",
            }}
          >
            {bookingData
              ? `Merci, ${bookingData.fullName || "cher client"}.`
              : "Confirmation"}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-small)",
              color: "var(--ivory-dim)",
              lineHeight: 1.6,
              maxWidth: "480px",
            }}
          >
            {bookingData
              ? "Notre équipe étudie actuellement votre dossier. Vous recevrez une réponse écrite sous 24h."
              : "Votre demande a été transmise. Notre équipe vous contactera sous 24h."}
          </p>
        </div>

        {/* Hairline divider */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "rgba(255,255,255,.07)",
            margin: "clamp(20px, 3vw, 32px) clamp(20px, 4vw, 40px)",
          }}
        />

        {/* ── 4-step status timeline ────────────────────────────────────── */}
        <div
          style={{
            padding: "0 clamp(20px, 4vw, 40px)",
          }}
        >
          <p
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-micro)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--ivory-mute)",
              marginBottom: "20px",
              fontWeight: 600,
            }}
          >
            Étapes de traitement
          </p>

          <ol
            role="list"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {STEPS.map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  paddingBottom: i < STEPS.length - 1 ? "20px" : 0,
                  position: "relative",
                }}
              >
                {/* Connector line (between dots) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "9px",
                      top: "22px",
                      bottom: 0,
                      width: "2px",
                      background: step.done
                        ? "var(--line-gold)"
                        : "rgba(255,255,255,.07)",
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  aria-hidden="true"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "1px",
                    background: step.done
                      ? "var(--gold)"
                      : "transparent",
                    border: step.done
                      ? "none"
                      : "1.5px solid rgba(255,255,255,.15)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: step.done ? "var(--night-950)" : "var(--ivory-mute)",
                    zIndex: 1,
                  }}
                >
                  {step.done ? "✓" : i + 1}
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-small)",
                    fontWeight: step.done ? 600 : 400,
                    color: step.done ? "var(--ivory)" : "var(--ivory-mute)",
                    paddingTop: "1px",
                    margin: 0,
                  }}
                >
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Booking recap (only when data is available) */}
        {bookingData && (
          <>
            <div
              aria-hidden="true"
              style={{
                height: "1px",
                background: "rgba(255,255,255,.07)",
                margin: "clamp(20px, 3vw, 32px) clamp(20px, 4vw, 40px)",
              }}
            />
            <div
              style={{
                padding: "0 clamp(20px, 4vw, 40px)",
              }}
            >
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 16px",
                  margin: 0,
                }}
              >
                {bookingData.totalEstimated != null && (
                  <>
                    <dt
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--fs-micro)",
                        color: "var(--ivory-mute)",
                        alignSelf: "center",
                      }}
                    >
                      Total prévisionnel
                    </dt>
                    <dd
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--fs-small)",
                        fontWeight: 700,
                        color: "var(--gold)",
                        textAlign: "right",
                        margin: 0,
                      }}
                    >
                      {bookingData.totalEstimated.toLocaleString("fr-DZ")} DA
                    </dd>
                  </>
                )}
                {bookingData.deposit != null && (
                  <>
                    <dt
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--fs-micro)",
                        color: "var(--ivory-mute)",
                        alignSelf: "center",
                      }}
                    >
                      Caution à la prise en charge
                    </dt>
                    <dd
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--fs-small)",
                        fontWeight: 600,
                        color: "var(--ivory-dim)",
                        textAlign: "right",
                        margin: 0,
                      }}
                    >
                      {bookingData.deposit.toLocaleString("fr-DZ")} DA
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </>
        )}

        {/* ── Reassurance line ─────────────────────────────────────────── */}
        <div
          style={{
            margin: "clamp(16px, 2.5vw, 28px) clamp(20px, 4vw, 40px) 0",
            padding: "12px 16px",
            borderRadius: "var(--r-sm)",
            background: "rgba(47, 163, 122, 0.06)",
            border: "1px solid rgba(47, 163, 122, 0.18)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-micro)",
              color: "var(--ok)",
              textAlign: "center",
              margin: 0,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Aucun paiement maintenant. Règlement sur place.
          </p>
        </div>

        {/* ── Action buttons ───────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding:
              "clamp(24px, 3vw, 36px) clamp(20px, 4vw, 40px) clamp(24px, 3vw, 40px)",
          }}
        >
          {/* WhatsApp — btn-secondary */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            aria-label="Suivre ma réservation sur WhatsApp"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <MessageSquare
              aria-hidden="true"
              style={{ width: "18px", height: "18px", flexShrink: 0 }}
            />
            <span>Suivre sur WhatsApp</span>
          </a>

          {/* Retour à l'accueil — btn-key */}
          <Link
            href={ROUTES.home}
            className="btn-key"
            aria-label="Retourner à la page d'accueil"
            style={{ fontFamily: "var(--font-body)", textDecoration: "none" }}
          >
            <Home
              aria-hidden="true"
              style={{ width: "18px", height: "18px" }}
            />
            <span>Retour à l&apos;accueil</span>
            <span className="chip" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>

          {/* Imprimer — text only, small */}
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Imprimer cette confirmation"
            style={{
              background: "none",
              border: "none",
              padding: "8px 4px",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-micro)",
              color: "var(--ivory-mute)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color var(--dur-hover) var(--ease-out-strong)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--ivory-dim)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ivory-mute)")
            }
          >
            <Printer aria-hidden="true" style={{ width: "13px", height: "13px" }} />
            Imprimer
          </button>
        </div>
      </article>
    </main>
  );
}
