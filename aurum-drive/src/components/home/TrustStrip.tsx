"use client";

import { Plane, Clock, Shield, Car, Receipt } from "lucide-react";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

const PROMISES = [
  { icon: Plane,   text: "Livraison et retour gratuits à l'aéroport" },
  { icon: Clock,   text: "Assistance 24 h/24, 7 j/7" },
  { icon: Shield,  text: "Assurance tous risques incluse" },
  { icon: Car,     text: "Voitures récentes, auto ou manuelles" },
  { icon: Receipt, text: "Tarifs clairs, caution restituée" },
] as const;

/* Duplicate the list so the loop is seamless */
const TRACK = [...PROMISES, ...PROMISES];

function Pill({ icon: Icon, text }: { icon: typeof Plane; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 18px",
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        fontFamily: SF,
        flexShrink: 0,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "rgba(11, 117, 132,0.08)",
          color: "#0B7584",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#1D1D1F", lineHeight: 1.4, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section
      aria-label="Nos engagements"
      style={{
        marginTop: 20,
        marginBottom: 8,
        overflow: "hidden",
        /* Fade mask — cards dissolve exactly at the container edge, not the viewport edge */
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {/* Inject keyframe animation via a style tag */}
      <style>{`
        @keyframes trust-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-track { animation-play-state: paused !important; }
        }
      `}</style>

      {/* The track is 200% wide (original + duplicate) — animates exactly one copy width */}
      <div
        className="trust-track"
        style={{
          display: "flex",
          gap: 10,
          width: "max-content",
          animation: "trust-scroll 28s linear infinite",
          paddingLeft: 10,
        }}
      >
        {TRACK.map((item, i) => (
          <Pill key={i} icon={item.icon} text={item.text} />
        ))}
      </div>
    </section>
  );
}
