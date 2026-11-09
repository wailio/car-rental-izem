"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/config";
import { stats } from "@/lib/data";
import { ShieldCheck, Award, ArrowUpRight, Plane } from "lucide-react";

export default function AboutPage() {
  return (
    <div id="main" className="min-h-screen py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-20">
      {/* Header */}
      <div data-pop="up" className="max-w-3xl space-y-3 sm:space-y-4">
        <div
          data-pop="badge"
          className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] uppercase tracking-[0.2em] font-semibold"
          style={{
            border: '1px solid rgba(194,165,107,.3)',
            background: 'rgba(194,165,107,.06)',
            color: 'var(--gold)',
          }}
        >
          <span>Notre Engagement</span>
        </div>
        <h1
          className="text-2xl sm:text-5xl lg:text-6xl font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ivory)' }}
        >
          Une agence de location humaine,{" "}
          <span className="italic font-normal" style={{ color: 'var(--gold)' }}>à Alger</span>.
        </h1>
        <p className="text-xs sm:text-base leading-relaxed font-light" style={{ color: 'var(--ivory-dim)' }}>
          IZEM MOTORS est née d&apos;un principe simple : louer un véhicule à Alger doit être clair, rapide et rassurant. Sans frais cachés ni mauvaise surprise.
        </p>
      </div>

      {/* Story Grid with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
        <div
          data-pop="left"
          className="lg:col-span-6 relative h-[240px] sm:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,.07)',
            background: 'var(--night-900)',
          }}
        >
          <Image
            src="/images/wee.png"
            alt="Flotte IZEM MOTORS Alger"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(6,8,12,.8), transparent)' }}
          />
        </div>

        <div data-pop="right" className="lg:col-span-6 space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--ivory)' }}
          >
            La simplicité dès votre descente d&apos;avion
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
            Nous avons supprimé les tracas habituels : finies les attentes interminables, les modèles modifiés au dernier moment ou les cautions floues. Chez IZEM MOTORS, vous conduisez le modèle que vous avez réservé, aux conditions convenues.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
            Nous livrons et reprenons les véhicules directement à l&apos;Aéroport d&apos;Alger Houari Boumediene sans supplément. Notre équipe est sur place 7j/7 pour vous remettre les clés dès votre atterrissage.
          </p>

          <div
            className="grid grid-cols-2 gap-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}
          >
            <div className="space-y-1">
              <Plane className="w-5 h-5" style={{ color: 'var(--gold)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--ivory)' }}>Livraison Aéroport</h3>
              <p className="text-xs" style={{ color: 'var(--ivory-mute)' }}>Prise en charge directe au terminal, 24h/24 et 7j/7.</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--ivory)' }}>Transparence Totale</h3>
              <p className="text-xs" style={{ color: 'var(--ivory-mute)' }}>Tarifs nets en Dinars, caution restituée au retour.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        data-pop="scale"
        className="rounded-3xl p-8 sm:p-12"
        style={{
          background: 'var(--night-850)',
          border: '1px solid rgba(255,255,255,.07)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {stats.map((s, idx) => (
            <div key={idx} data-pop="up" data-pop-stagger={String(idx + 1)} className="space-y-1">
              <div
                className="text-3xl sm:text-4xl font-bold tabular-nums"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                {s.value}{s.suffix}
              </div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--ivory-dim)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Call to Action */}
      <div data-pop="up" className="text-center space-y-4 py-8">
        <h2
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ivory)' }}
        >
          Une question avant de réserver ?
        </h2>
        <p className="text-sm" style={{ color: 'var(--ivory-dim)' }}>
          Notre équipe vous répond sur WhatsApp ou par téléphone sous 24 h.
        </p>
        <Link
          href={ROUTES.contact}
          className="btn-key inline-flex items-center gap-2"
        >
          <span>Prendre contact</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
