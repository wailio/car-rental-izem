"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, ROUTES } from "@/lib/config";
import { IzemBrandLockup } from "@/components/common/IzemBrandLockup";
import {
  X,
  Home,
  Car,
  Sparkles,
  Info,
  HelpCircle,
  Mail,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: ROUTES.home, label: "Accueil", icon: Home },
  { href: ROUTES.fleet, label: "Notre Flotte", icon: Car },
  { href: ROUTES.services, label: "Nos Prestations", icon: Sparkles },
  { href: ROUTES.about, label: "À Propos", icon: Info },
  { href: ROUTES.faq, label: "Questions fréquentes", icon: HelpCircle },
  { href: ROUTES.contact, label: "Contact & Agence", icon: Mail },
];

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // Close only on actual route change
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      className="fixed inset-0 z-[9999] lg:hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Drawer Panel — slides in from the right */}
      <aside
        className="fixed top-0 bottom-0 right-0 w-[min(320px,85vw)] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-[10000] animate-in slide-in-from-right duration-250 ease-out"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center text-slate-900 no-underline"
          >
            <IzemBrandLockup theme="light" size="sm" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase px-3 py-1.5">
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition-all ${
                  active
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-white" : "text-slate-400"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B7584] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/60 shrink-0">
          <Link
            href={ROUTES.fleet}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B7584] hover:bg-[#085A66] text-white text-xs font-bold shadow-xs transition-colors no-underline"
          >
            <span>Réserver un véhicule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold transition-colors no-underline"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Conseiller</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
