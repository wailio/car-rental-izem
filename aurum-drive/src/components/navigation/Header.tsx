"use client";

/**
 * Header — Phase 3 / Global Shell
 *
 * Spec (06 §0):
 * - Top info bar (desktop only, 36px): slides up on scroll > 40px
 * - Sticky header: glass on scroll
 * - Mobile menu: full-screen overlay
 * - Phone number is tel: link; mobile shows phone icon next to menu
 * - Active nav link: gold underline, no transition: all
 * - CTA button uses .btn-key class
 * - Zero hardcoded colours — tokens only
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, ROUTES } from "@/lib/config";
import { categories } from "@/lib/data";
import { Phone, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { IzemBrandLockup } from "@/components/common/IzemBrandLockup";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fleetDropdownOpen, setFleetDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => (y > 60 ? true : y < 20 ? false : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setFleetDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const navLinkStyle = (path: string): React.CSSProperties => ({
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    color: isActive(path) ? "#0B7584" : "#374151",
    fontWeight: isActive(path) ? 700 : 500,
    textDecoration: "none",
    padding: ".25rem 0",
    position: "relative",
    transition: `color var(--dur-hover) var(--ease-out-strong)`,
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
      }}
    >
      {/* ── Sticky header (Clean task bar without top info bar) ────────────────── */}
      <header
        role="banner"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 40,
          background: scrolled
            ? "rgba(255, 255, 255, 0.96)"
            : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,.06)" : "none",
          transition: `background var(--dur-panel) var(--ease-out-strong), border-color var(--dur-panel) var(--ease-out-strong), box-shadow var(--dur-panel) var(--ease-out-strong)`,
        }}
      >
        {/* Skip link */}
        <a
          href="#main"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 100,
            background: "var(--gold)",
            color: "var(--night-950)",
            padding: ".5rem 1rem",
            borderRadius: "var(--r-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-small)",
            transform: "translateY(-200%)",
            transition: `transform var(--dur-hover) var(--ease-out-strong)`,
          }}
          onFocus={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          onBlur={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-200%)")}
        >
          Aller au contenu principal
        </a>

        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0.875rem var(--gutter)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <Link
            href={ROUTES.home}
            aria-label="IZEM MOTORS — Accueil"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <IzemBrandLockup theme="light" size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex"
            aria-label="Navigation principale"
            style={{ alignItems: "center", gap: "2rem" }}
          >
            {/* Home */}
            <Link href={ROUTES.home} style={navLinkStyle("/")} aria-current={pathname === "/" ? "page" : undefined}>
              Accueil
              {isActive("/") && (
                <span aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "var(--gold)", borderRadius: 2 }} />
              )}
            </Link>

            {/* Fleet dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setFleetDropdownOpen(true)}
              onMouseLeave={() => setFleetDropdownOpen(false)}
            >
              <Link
                href={ROUTES.fleet}
                style={{ ...navLinkStyle("/vehicules"), display: "flex", alignItems: "center", gap: ".25rem" }}
                aria-haspopup="true"
                aria-expanded={fleetDropdownOpen}
              >
                Véhicules
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  style={{
                    transform: fleetDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: `transform var(--dur-hover) var(--ease-out-strong)`,
                  }}
                />
                {isActive("/vehicules") && (
                  <span aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 16, height: 2, background: "var(--gold)", borderRadius: 2 }} />
                )}
              </Link>

              {/* Dropdown */}
              {fleetDropdownOpen && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + .5rem)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 260,
                    background: "rgba(16,20,28,.96)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,.08)",
                    borderRadius: "var(--r-lg)",
                    boxShadow: "var(--elev-3)",
                    padding: ".5rem",
                    zIndex: 100,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ivory-mute)", padding: ".375rem .75rem .5rem", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: ".375rem" }}>
                    Catégories
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`${ROUTES.fleet}?category=${cat.id}`}
                      role="menuitem"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: ".5rem .75rem",
                        borderRadius: "var(--r-sm)",
                        textDecoration: "none",
                        transition: `background var(--dur-hover) var(--ease-out-strong)`,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)", color: "var(--ivory)" }}>{cat.name}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", color: "var(--ivory-mute)" }}>dès {cat.priceFrom.toLocaleString("fr-DZ")} DA/j</span>
                    </Link>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", marginTop: ".375rem", paddingTop: ".375rem" }}>
                    <Link
                      href={ROUTES.fleet}
                      role="menuitem"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".5rem .75rem", borderRadius: "var(--r-sm)", textDecoration: "none", color: "var(--gold)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(194,165,107,.08)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-small)" }}>Toute la flotte</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {[
              { href: ROUTES.services, label: "Services" },
              { href: ROUTES.about, label: "À propos" },
              { href: ROUTES.faq, label: "FAQ" },
              { href: ROUTES.contact, label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={navLinkStyle(href)} aria-current={isActive(href) ? "page" : undefined}>
                {label}
                {isActive(href) && (
                  <span aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "var(--gold)", borderRadius: 2 }} />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex" style={{ alignItems: "center", flexShrink: 0 }}>
            <Link href={ROUTES.fleet} className="btn-key" aria-label="Réserver un véhicule">
              Réserver
              <span className="chip" aria-hidden="true"><ArrowUpRight size={15} /></span>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden" style={{ alignItems: "center", gap: ".75rem" }}>
            <a
              href={`tel:${BRAND.phone}`}
              aria-label={`Appeler ${BRAND.phone}`}
              style={{ color: "var(--ivory-dim)", display: "flex", alignItems: "center" }}
            >
              <Phone size={20} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              style={{ padding: ".25rem", color: "var(--ivory-dim)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Horizon hairline (at top, visible when not scrolled) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(194,165,107,.3) 30%, rgba(194,165,107,.5) 50%, rgba(194,165,107,.3) 70%, transparent)",
            opacity: scrolled ? 0 : 1,
            transition: `opacity var(--dur-panel) var(--ease-out-strong)`,
            pointerEvents: "none",
          }}
        />
      </header>

      {/* ── Modern Mobile Menu Drawer (iOS/Admin SaaS style) ────────────────── */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
