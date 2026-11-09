"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ExternalLink, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteConfig, parseReviews } from "@/lib/use-site-config";
import { BRAND } from "@/lib/config";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReviewsModal } from "@/components/reviews/ReviewsModal";

const TRUNCATE_LIMIT = 135;
const AUTO_SLIDE_INTERVAL = 3000; // 3 seconds auto slide

export function ReviewsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const config = useSiteConfig();
  const allReviews = parseReviews(config);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stepPx, setStepPx] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  // Measure card width + gap for pixel-perfect smooth transform
  const updateStep = useCallback(() => {
    if (containerRef.current) {
      const firstCard = containerRef.current.querySelector<HTMLElement>("[data-review-card]");
      if (firstCard) {
        // Gap is 20px (1.25rem)
        const gap = 20;
        setStepPx(firstCard.offsetWidth + gap);
      }
    }
  }, []);

  useEffect(() => {
    updateStep();
    window.addEventListener("resize", updateStep);
    return () => window.removeEventListener("resize", updateStep);
  }, [updateStep, allReviews.length]);

  // Next / Prev slide handlers
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 >= allReviews.length ? 0 : prev + 1));
  }, [allReviews.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? allReviews.length - 1 : prev - 1));
  }, [allReviews.length]);

  // Auto slide every 2 seconds (paused when user hovers or modal is open)
  useEffect(() => {
    if (isPaused || isModalOpen || allReviews.length <= 1) return;

    const timer = setInterval(() => {
      next();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, isModalOpen, next, allReviews.length]);

  // Touch gesture support for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (diff > 40) next();
      else if (diff < -40) prev();
      touchStartX.current = null;
    }
    setIsPaused(false);
  };

  const openReviewModal = (reviewId?: string) => {
    setSelectedReviewId(reviewId || null);
    setIsModalOpen(true);
  };

  const titleText = config.reviews_title || "Avis de nos Clients";
  const badgeText = config.reviews_badge || "Avis Vérifiés Google";

  return (
    <>
      <section
        ref={sectionRef}
        className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-200/80 text-slate-900 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Section Header ────────────────────────────────────── */}
          <div data-pop="up" className="text-center mb-8 sm:mb-10">
            <div data-pop="badge" className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 mb-3">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight m-0">
              {titleText.includes("Clients") ? (
                <>
                  {titleText.replace("Clients", "")}
                  <span className="text-[#044E54]">Clients</span>
                </>
              ) : (
                titleText
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-500 font-normal max-w-xl mx-auto mt-2 leading-relaxed">
              {config.reviews_subtitle ||
                `${allReviews.length} avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.`}
            </p>

            {/* Google aggregate chip */}
            <div data-pop="scale" className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-slate-200/90 rounded-full px-4 py-2 shadow-xs">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">
                5,0 / 5 · {allReviews.length} avis Google
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <a
                href={BRAND.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
              >
                <span>Fiche officielle</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* ── Carousel Header Controls ──────────────────────────── */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2">
              <span>Avis {currentIndex + 1} sur {allReviews.length}</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs hidden sm:inline">Défilement auto toutes les 3s</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Avis précédent"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Avis suivant"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* ── 3.5 Cards Sliding Carousel Container ──────────────── */}
          <div
            ref={containerRef}
            data-pop="up"
            className="relative overflow-hidden mb-8 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex gap-5 transition-transform duration-1200 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transitionDuration: "1200ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transform: stepPx
                  ? `translateX(-${currentIndex * stepPx}px)`
                  : `translateX(-${currentIndex * 28}%)`,
                willChange: "transform",
              }}
            >
              {allReviews.map((rev) => {
                const isLong = rev.text.length > TRUNCATE_LIMIT;
                const displayText = isLong
                  ? rev.text.slice(0, TRUNCATE_LIMIT).trim() + "....."
                  : rev.text;

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
                    data-review-card
                    onClick={() => openReviewModal(rev.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openReviewModal(rev.id);
                      }
                    }}
                    className="group bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 text-left
                      w-[calc(100%-2rem)] sm:w-[calc((100%-20px)/2.2)] lg:w-[calc((100%-60px)/3.5)]"
                  >
                    <div>
                      {/* Top row: stars + date */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex gap-0.5 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400">
                          {rev.date || "Avis Google vérifié"}
                        </span>
                      </div>

                      {/* Review text with truncation dots '.....' */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal m-0 min-h-[4.5rem]">
                        &ldquo;{displayText}&rdquo;
                      </p>

                      {/* Hint to expand in modal */}
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                          <span>{isLong ? "Lire la suite" : "Ouvrir l'avis"}</span>
                          <ArrowRight
                            size={12}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </span>
                      </div>
                    </div>

                    {/* Card footer: Author info */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials || "C"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm truncate">
                            {rev.author}
                          </span>
                          <CheckCircle2
                            size={13}
                            className="text-emerald-500 shrink-0"
                            aria-label="Avis vérifié"
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal truncate block">
                          Client vérifié Google Maps
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Section Actions ───────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => openReviewModal()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{`Voir tous les avis en fenêtre (${allReviews.length})`}</span>
              <ArrowRight size={14} />
            </button>

            <a
              href={BRAND.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <span>Consulter sur Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Small Window Modal (With cool filter background) ───── */}
      <ReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviews={allReviews}
        initialSelectedId={selectedReviewId}
      />
    </>
  );
}
