"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Star, X, Search, ExternalLink, CheckCircle2 } from "lucide-react";
import { ReviewItem } from "@/lib/site-config";
import { BRAND } from "@/lib/config";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ReviewItem[];
  initialSelectedId?: string | null;
}

export function ReviewsModal({
  isOpen,
  onClose,
  reviews,
  initialSelectedId,
}: ReviewsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prevent background website scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Auto-scroll to selected review if specified
    if (initialSelectedId && itemRefs.current[initialSelectedId]) {
      setTimeout(() => {
        itemRefs.current[initialSelectedId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, initialSelectedId, onClose]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return reviews;
    const q = searchQuery.toLowerCase();
    return reviews.filter(
      (r) =>
        r.author.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        (r.vehicle &&
          r.vehicle !== "IZEM MOTORS Alger" &&
          r.vehicle.toLowerCase().includes(q))
    );
  }, [reviews, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200 overscroll-contain"
        style={{ overscrollBehavior: "contain" }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#FAFAFC]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 mb-2">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                <span>5,0 / 5 · {reviews.length} avis vérifiés</span>
              </div>
              <h2
                id="modal-title"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0"
              >
                Avis Clients IZEM MOTORS
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal m-0 mt-0.5">
                Retours d&apos;expérience authentiques issus de notre fiche Google Maps officielle.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={BRAND.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
              >
                <span>Fiche Google</span>
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la fenêtre d'avis"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Rechercher par client ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-24 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200/60 transition-all shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 pointer-events-none">
              {filtered.length} avis
            </span>
          </div>
        </div>

        {/* ── Modal Body (All Reviews) ───────────────────────────── */}
        <div
          className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-[#F8FAFC] overscroll-contain"
          style={{ overscrollBehavior: "contain" }}
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Aucun avis ne correspond à votre recherche.
            </div>
          ) : (
            filtered.map((rev) => {
              const isHighlighted = initialSelectedId === rev.id;
              const initials = rev.author
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={rev.id}
                  ref={(el) => {
                    itemRefs.current[rev.id] = el;
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isHighlighted
                      ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials || "C"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {rev.author}
                          </span>
                          <CheckCircle2
                            size={13}
                            className="text-emerald-500 shrink-0"
                            aria-label="Avis vérifié"
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {rev.date || "Avis Google vérifié"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  {/* Full review text without cut */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal m-0 whitespace-pre-line">
                    {rev.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* ── Modal Footer ────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] sm:text-xs text-slate-500">
            Fiche officielle vérifiée sur Google Maps ({reviews.length} avis · 5,0/5).
          </div>
          <div className="flex items-center gap-2">
            <a
              href={BRAND.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors shadow-xs"
            >
              <span>Voir sur Google Maps</span>
              <ExternalLink size={12} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
