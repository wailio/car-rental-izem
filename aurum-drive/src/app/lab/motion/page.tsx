"use client";

import type { Metadata } from "next";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * /lab/motion — Phase 2.4 Motion Playground
 *
 * Live sliders for duration, ease and stagger.
 * Tests the reveal system and motion tokens on real elements.
 * noindex — development only.
 */

const EASINGS = [
  { label: "expo.out (reveals)", value: "expo.out" },
  { label: "power4.out (hover/UI)", value: "power4.out" },
  { label: "expo.inOut (wipes)", value: "expo.inOut" },
  { label: "power3.inOut (drawers)", value: "power3.inOut" },
  { label: "elastic.out(1,0.5) (magnetic)", value: "elastic.out(1, 0.5)" },
  { label: "linear", value: "linear" },
];

export default function MotionLabPage() {
  const [duration, setDuration] = useState(0.9);
  const [stagger, setStagger] = useState(0.07);
  const [easeIndex, setEaseIndex] = useState(0);
  const [key, setKey] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);

  const selectedEase = EASINGS[easeIndex].value;

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = Array.from(cardsRef.current.children) as HTMLElement[];

      gsap.fromTo(
        cards,
        { opacity: 0, y: 32, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration,
          ease: selectedEase,
          stagger,
          clearProps: "all",
        }
      );
    },
    { scope: cardsRef, dependencies: [key, duration, stagger, easeIndex] }
  );

  const replay = () => setKey((k) => k + 1);

  const input = {
    width: "100%",
    accentColor: "var(--gold)",
  } as React.CSSProperties;

  const label = {
    display: "flex",
    justifyContent: "space-between",
    color: "var(--ivory-dim)",
    fontSize: "var(--fs-small)",
    marginBottom: ".5rem",
    fontFamily: "var(--font-body)",
  } as React.CSSProperties;

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
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
            Lab / Phase 2.4
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ivory)", marginBottom: "1rem" }}>
            Terrain de Jeu — Motion
          </h1>
        </div>

        {/* Controls */}
        <div
          style={{
            background: "var(--night-850)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-card)",
            padding: "2rem",
            marginBottom: "3rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Duration */}
          <div>
            <div style={label}>
              <span>Durée (reveal)</span>
              <code style={{ color: "var(--gold)" }}>{duration}s</code>
            </div>
            <input
              type="range" min="0.1" max="2" step="0.05"
              value={duration}
              onChange={(e) => { setDuration(parseFloat(e.target.value)); setKey(k => k + 1); }}
              style={input}
            />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-mute)", fontSize: ".7rem", marginTop: ".25rem" }}>
              <span>press (0.1)</span>
              <span>reveal (0.9)</span>
              <span>hero (1.4)</span>
            </div>
          </div>

          {/* Stagger */}
          <div>
            <div style={label}>
              <span>Stagger entre cartes</span>
              <code style={{ color: "var(--gold)" }}>{stagger}s</code>
            </div>
            <input
              type="range" min="0" max="0.25" step="0.01"
              value={stagger}
              onChange={(e) => { setStagger(parseFloat(e.target.value)); setKey(k => k + 1); }}
              style={input}
            />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-mute)", fontSize: ".7rem", marginTop: ".25rem" }}>
              <span>0</span>
              <span>cartes (0.1)</span>
              <span>0.25</span>
            </div>
          </div>

          {/* Easing */}
          <div>
            <div style={label}>
              <span>Easing</span>
              <code style={{ color: "var(--gold)" }}>{selectedEase}</code>
            </div>
            <select
              value={easeIndex}
              onChange={(e) => { setEaseIndex(Number(e.target.value)); setKey(k => k + 1); }}
              style={{
                width: "100%",
                background: "var(--night-800)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-input)",
                color: "var(--ivory)",
                padding: ".75rem 1rem",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-small)",
              }}
            >
              {EASINGS.map((e, i) => (
                <option key={e.value} value={i}>{e.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Replay button */}
        <button
          onClick={replay}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(180deg, #D8BF88 0%, var(--gold) 55%, #B39559 100%)",
            color: "var(--night-950)", fontWeight: 600, fontSize: "1rem",
            padding: ".75rem 1.5rem", borderRadius: "var(--r-pill)",
            border: "none", cursor: "pointer", marginBottom: "3rem",
            boxShadow: "var(--glow-gold)",
          }}
        >
          ↺ Rejouer l&apos;animation
        </button>

        {/* Cards stage */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          {["Audi A3", "MG 7", "T-Cross", "Coolray", "Sonet", "MG 5", "GX3 Pro"].map((name, i) => (
            <div
              key={`${name}-${key}`}
              style={{
                background: "var(--night-850)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-card)",
                padding: "1.5rem",
                opacity: 0,
              }}
            >
              <p style={{ color: "var(--gold)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>
                Véhicule {i + 1}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--ivory)" }}>
                {name}
              </p>
              <p style={{ color: "var(--ivory-mute)", fontSize: "var(--fs-small)", marginTop: ".25rem" }}>
                à partir de {(2200 + i * 500).toLocaleString("fr-DZ")} DA/j
              </p>
            </div>
          ))}
        </div>

        {/* Token reference */}
        <div
          style={{
            background: "var(--night-850)", border: "1px solid var(--line)",
            borderRadius: "var(--r-card)", padding: "2rem"
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h3)", color: "var(--ivory)", marginBottom: "1.5rem" }}>
            Jetons de motion (référence)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: ".75rem", fontFamily: "var(--font-body)", fontSize: "var(--fs-small)" }}>
            {[
              ["--dur-press", "100ms"],
              ["--dur-hover", "220ms"],
              ["--dur-ui", "300ms"],
              ["--dur-panel", "480ms"],
              ["--dur-reveal", "900ms"],
              ["--dur-hero", "1400ms"],
              ["--dur-exit", "540ms"],
              ["--ease-out-expo", "cubic-bezier(.16,1,.3,1)"],
              ["--ease-out-strong", "cubic-bezier(.23,1,.32,1)"],
              ["--ease-in-out-strong", "cubic-bezier(.77,0,.175,1)"],
              ["--ease-drawer", "cubic-bezier(.32,.72,0,1)"],
            ].map(([name, value]) => (
              <div key={name} style={{ background: "var(--night-900)", borderRadius: "var(--r-sm)", padding: ".75rem" }}>
                <code style={{ color: "var(--gold)", display: "block", marginBottom: ".25rem" }}>{name}</code>
                <span style={{ color: "var(--ivory-dim)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
