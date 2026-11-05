"use client";

import { stats } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function StatsStrip() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} style={{ padding: "clamp(2.5rem, 5vw, 5rem) var(--gutter)", maxWidth: "var(--container)", margin: "0 auto" }}>
      <div
        data-reveal="scale"
        style={{
          position: "relative",
          borderRadius: "var(--r-xl)",
          background: "var(--night-850)",
          border: "1px solid rgba(255,255,255,.07)",
          padding: "clamp(2rem, 4vw, 4rem)",
          overflow: "hidden",
        }}
      >
        {/* Decorative tachometer arc — very subtle */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", top: "-50%", right: "-25%", width: 600, height: 600, color: "rgba(194,165,107,.04)", pointerEvents: "none" }}
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="85" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(1.5rem, 3vw, 3rem)", position: "relative", zIndex: 1 }} className="stats-grid">
          {stats.map((item, index) => (
            <div
              key={index}
              data-reveal="fade-up"
              data-reveal-delay={String(index * 90)}
              style={{ textAlign: "left" }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-display)", color: "var(--gold)", fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em", lineHeight: 1 }}>
                {item.value.toLocaleString("fr-DZ")}
                <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-h3)", color: "var(--ivory)", fontWeight: 400 }}>{item.suffix}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", color: "var(--ivory-mute)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: ".375rem" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>
    </section>
  );
}
