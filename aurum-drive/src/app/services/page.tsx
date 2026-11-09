"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES, BRAND } from "@/lib/config";
import { ArrowUpRight, Plane, CalendarCheck, ShieldCheck, Clock, Check } from "lucide-react";

export default function ServicesPage() {
  const serviceDetails = [
    {
      title: "Livraison & retour à l'Aéroport d'Alger",
      tagline: "Vos clés vous attendent à l'arrivée au terminal.",
      image: "/cars/audi-a3-sportback.jpg",
      description:
        "Finie l'attente après le vol. Dès votre sortie du terminal de l'Aéroport Houari Boumediene, notre équipe vous remet le véhicule réservé avec les papiers prêts. Au retour, nous récupérons la voiture au même endroit. Service gratuit 24h/24 et 7j/7.",
      perks: [
        "Accueil à la sortie du terminal",
        "Prise en charge même en cas de vol tardif",
        "Restitution rapide au retour",
        "Zéro supplément aéroport",
      ],
    },
    {
      title: "Location courte, moyenne et longue durée",
      tagline: "Des formules souples avec tarifs dégressifs transparents.",
      image: "/cars/volkswagen-t-cross.jpg",
      description:
        "Que vous restiez quelques jours pour affaires ou plusieurs semaines en famille, profitez de tarifs dégressifs clairs. Pas de frais cachés, un kilométrage adapté et une transparence totale sur le dépôt de garantie.",
      perks: [
        "Tarifs dégressifs à partir de 7 jours",
        "Formules mensuelles pour professionnels",
        "Prolongation facilitée sur simple message",
        "Contrat clair et détaillé",
      ],
    },
    {
      title: "Assistance routière 24h/24 et 7j/7",
      tagline: "Une équipe locale joignable à tout moment.",
      image: "/cars/geely-coolray.jpg",
      description:
        "Parce qu'un imprévu peut arriver sur la route, notre assistance téléphonique et WhatsApp reste active 24h/24 et 7j/7. Nous coordonnons rapidement l'aide nécessaire pour que vous puissiez poursuivre votre trajet sereinement.",
      perks: [
        "Ligne d'assistance dédiée 7j/7",
        "Prise en charge rapide sur le réseau routier",
        "Assurance tous risques incluse",
        "Équipe réactive basée à Alger",
      ],
    },
    {
      title: "Véhicules pour événements et déplacements familiaux",
      tagline: "Des voitures impeccables pour vos moments importants.",
      image: "/cars/mg-7.png",
      description:
        "Nos SUV et berlines récents sont minutieusement nettoyés et contrôlés pour vos fêtes de famille, cortèges ou rendez-vous importants. Contactez-nous pour réserver les modèles de votre choix.",
      perks: [
        "Véhicules nettoyés intérieur et extérieur",
        "Climatisation et confort de route vérifiés",
        "Possibilité de réserver plusieurs véhicules",
        "Accompagnement par notre équipe",
      ],
    },
  ];

  return (
    <div id="main" className="min-h-screen py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
      {/* Page Header */}
      <div data-pop="up" className="space-y-3 sm:space-y-4 max-w-2xl">
        <div
          data-pop="badge"
          className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] uppercase tracking-[0.2em] font-semibold"
          style={{
            border: '1px solid rgba(194,165,107,.3)',
            background: 'rgba(194,165,107,.06)',
            color: 'var(--gold)',
          }}
        >
          <span>Nos Prestations</span>
        </div>
        <h1
          className="text-2xl sm:text-5xl font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ivory)' }}
        >
          Des services simples et fiables pour{' '}
          <span className="italic font-normal" style={{ color: 'var(--gold)' }}>vos trajets</span>
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
          IZEM MOTORS vous accompagne à chaque étape de votre voyage en Algérie, avec livraison aéroport gratuite et assistance continue.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-6 sm:space-y-16">
        {serviceDetails.map((service, index) => (
          <div
            key={index}
            data-reveal="fade-up"
            data-reveal-delay={String(index * 100)}
            data-pop="up"
            data-pop-stagger={String((index % 4) + 1)}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center p-4 sm:p-12 rounded-2xl sm:rounded-3xl ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
            style={{
              background: 'var(--night-850)',
              border: '1px solid rgba(255,255,255,.07)',
            }}
          >
            {/* Image (Span 5) */}
            <div
              className={`lg:col-span-5 relative h-52 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}
              style={{ background: 'var(--night-900)' }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(24,23,21,.6), transparent)' }}
              />
            </div>

            {/* Content (Span 7) */}
            <div className={`lg:col-span-7 space-y-5 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>
                  Prestation 0{index + 1}
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--ivory)' }}
                >
                  {service.title}
                </h2>
                <p
                  className="text-sm italic"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
                >
                  {service.tagline}
                </p>
              </div>

              <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--ivory-dim)' }}>
                {service.description}
              </p>

              {/* Perks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {service.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ivory)' }}>
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href={ROUTES.contact}
                  className="btn-key inline-flex items-center gap-2"
                >
                  <span>Nous contacter pour ce service</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
