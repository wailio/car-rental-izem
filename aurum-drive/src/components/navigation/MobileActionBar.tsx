"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, ROUTES } from "@/lib/config";
import { Phone, Calendar, MessageSquare } from "lucide-react";

export function MobileActionBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
          // Scrolling down
          setVisible(false);
        } else if (lastScrollY - currentScrollY > 10) {
          // Scrolling up
          setVisible(true);
        }
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ transition: "transform 300ms var(--ease-out-strong)" }}
    >
      <div style={{ background: "rgba(11,14,20,.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "var(--r-card)", padding: ".5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem", maxWidth: 28 + "rem", margin: "0 auto" }}>
        {/* Call button */}
        <a
          href={`tel:${BRAND.phone}`}
          aria-label={`Appeler le ${BRAND.phone}`}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem", padding: ".625rem .75rem", borderRadius: "var(--r-sm)", background: "var(--night-850)", border: "1px solid rgba(255,255,255,.07)", fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", fontWeight: 500, color: "var(--ivory)", textDecoration: "none", transition: `color var(--dur-hover) var(--ease-out-strong)` }}
        >
          <Phone style={{ width: 14, height: 14, color: "var(--gold)", flexShrink: 0 }} />
          <span>Appeler</span>
        </a>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/${BRAND.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem", padding: ".625rem .75rem", borderRadius: "var(--r-sm)", background: "var(--night-850)", border: "1px solid rgba(255,255,255,.07)", fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", fontWeight: 500, color: "var(--ok)", textDecoration: "none" }}
        >
          <MessageSquare style={{ width: 14, height: 14, flexShrink: 0 }} />
          <span>WhatsApp</span>
        </a>

        {/* Primary Reserve button */}
        <Link
          href={ROUTES.fleet}
          aria-label="Voir la flotte et réserver"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem", padding: ".625rem .75rem", borderRadius: "var(--r-sm)", background: "var(--gold)", color: "var(--night-950)", fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", fontWeight: 700, textDecoration: "none" }}
        >
          <Calendar style={{ width: 14, height: 14, flexShrink: 0 }} />
          <span>Réserver</span>
        </Link>
      </div>
    </div>
  );
}
