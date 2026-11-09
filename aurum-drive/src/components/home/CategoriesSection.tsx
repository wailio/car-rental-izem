"use client";

import React, { useRef, useState } from "react";
import { categories } from "@/lib/data";
import { fleet, Vehicle } from "@/content/fleet";
import { VehicleModal } from "@/components/ui/VehicleModal";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal<HTMLElement>();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const categoryImages: Record<string, string> = {
    economique: "/cars/geely-gx3-pro.jpg",
    compacte: "/cars/kia-sonet.jpg",
    berline: "/cars/mg-5.jpg",
    suv: "/cars/geely-coolray.jpg",
    premium: "/cars/audi-a3-sportback.jpg",
    utilitaire: "/cars/volkswagen-t-cross.jpg",
  };

  // Map category to representative fleet car
  const categoryVehicleMap: Record<string, number> = {
    economique: 7, // Geely GX3 Pro
    compacte: 5,   // Kia Sonet
    berline: 6,    // MG 5
    suv: 4,        // Geely Coolray
    premium: 1,    // Audi A3 Sportback
    utilitaire: 3, // Volkswagen T-Cross
  };

  const handleSelectCategory = (categoryId: string) => {
    const targetId = categoryVehicleMap[categoryId];
    const targetVehicle =
      fleet.find((v) => v.id === targetId) ||
      fleet.find((v) => v.categoryId === categoryId) ||
      fleet[0];
    setSelectedVehicle(targetVehicle);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(48px,6vw,72px) 0",
        maxWidth: 1280,
        margin: "0 auto",
        paddingLeft: "clamp(16px,4vw,32px)",
        paddingRight: "clamp(16px,4vw,32px)",
        fontFamily: SF,
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 36,
        }}
      >
        <div data-pop="left" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            data-pop="badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(11, 117, 132,0.08)",
              color: "#0B7584",
              width: "fit-content",
            }}
          >
            Catégories
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem,3vw,2.6rem)",
              fontWeight: 300,
              color: "#0F172A",
              margin: 0,
              lineHeight: 1.15,
              fontFamily: SF,
            }}
          >
            <span style={{ fontWeight: 300 }}>Choisissez votre </span>
            <span style={{ fontWeight: 800, color: "#0B7584" }}>catégorie</span>
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              maxWidth: 480,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            De la citadine agile pour Alger centre au SUV spacieux pour vos longs trajets, explorez notre gamme complète.
          </p>
        </div>

        {/* Carousel Nav */}
        <div data-pop="right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NavButton onClick={scrollLeft} label="Catégorie précédente" rotate>
            <ChevronRight size={18} />
          </NavButton>
          <NavButton onClick={scrollRight} label="Catégorie suivante">
            <ChevronRight size={18} />
          </NavButton>
        </div>
      </div>

      {/* Horizontal Rail */}
      <div
        ref={scrollRef}
        className="carousel-rail"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          paddingBottom: 12,
          scrollbarWidth: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            index={i}
            imageSrc={categoryImages[cat.id] || categoryImages.berline}
            onSelect={() => handleSelectCategory(cat.id)}
          />
        ))}
      </div>

      {/* Reusable Apple-Style Vehicle Quick-View Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </section>
  );
}

/* ─────────────────────────────── sub-components ────────────────────────── */

function NavButton({
  onClick,
  label,
  children,
  rotate,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  rotate?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.12)",
        background: hovered ? "#F3F4F6" : "#FFFFFF",
        color: "#374151",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.18s ease",
        transform: rotate ? "rotate(180deg)" : "none",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function CategoryCard({
  cat,
  index,
  imageSrc,
  onSelect,
}: {
  cat: { id: string; name: string; priceFrom: number; minAge: number; licenceYears: number };
  index: number;
  imageSrc: string;
  onSelect: () => void;
}) {
  const [cardHovered, setCardHovered] = useState(false);
  const [arrowHovered, setArrowHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      data-reveal="fade-up"
      data-reveal-delay={String(index * 60)}
      data-pop="up"
      data-pop-stagger={String((index % 6) + 1)}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => {
        setCardHovered(false);
        setArrowHovered(false);
      }}
      style={{
        minWidth: 260,
        maxWidth: 300,
        flexShrink: 0,
        scrollSnapAlign: "start",
        background: "#FFFFFF",
        border: cardHovered ? "1px solid rgba(11, 117, 132,0.35)" : "1px solid rgba(0,0,0,0.06)",
        borderRadius: 22,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        userSelect: "none",
        outline: "none",
        boxShadow: cardHovered
          ? "0 20px 42px -10px rgba(15,23,42,0.14), 0 6px 16px -4px rgba(15,23,42,0.06), 0 0 0 1.5px rgba(11, 117, 132,0.4)"
          : "0 8px 24px -6px rgba(15,23,42,0.08), 0 2px 6px -1px rgba(15,23,42,0.04), 0 0 0 1px rgba(0,0,0,0.06)",
        transform: cardHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      {/* Image wrapper */}
      <div
        style={{
          height: 168,
          borderRadius: 14,
          background: "#F1F5F9",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img
          src={imageSrc}
          alt={cat.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.5s ease",
            transform: cardHovered ? "scale(1.05)" : "scale(1)",
          }}
          loading="lazy"
        />
        {/* Price pill */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Dès{" "}
          <span style={{ color: "#0B7584", fontWeight: 700 }}>
            {cat.priceFrom.toLocaleString("fr-DZ")} DA
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
            {" "}/ jour
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            }}
          >
            {cat.name}
          </h3>
          <span
            onMouseEnter={() => setArrowHovered(true)}
            onMouseLeave={() => setArrowHovered(false)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: arrowHovered || cardHovered ? "#0B7584" : "rgba(11, 117, 132,0.08)",
              color: arrowHovered || cardHovered ? "#FFFFFF" : "#0B7584",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.18s ease, color 0.18s ease",
            }}
          >
            <ArrowRight size={13} strokeWidth={2.4} />
          </span>
        </div>

        <p
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "#64748B",
            margin: 0,
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          Idéal pour la ville ou l&apos;autoroute. Véhicules climatisés, récents et parfaitement entretenus.
        </p>

        {/* Meta row */}
        <div
          style={{
            paddingTop: 10,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#94A3B8",
          }}
        >
          <span>Dès {cat.minAge} ans</span>
          <span>Permis : {cat.licenceYears} an{cat.licenceYears > 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
