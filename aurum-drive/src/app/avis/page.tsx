"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSiteConfig, parseReviews } from "@/lib/use-site-config";
import { ROUTES, BRAND } from "@/lib/config";
import { Star, ArrowRight, CheckCircle2, Search, ExternalLink } from "lucide-react";
import { ReviewsModal } from "@/components/reviews/ReviewsModal";

const INITIAL_VISIBLE = 9;
const INCREMENT_VISIBLE = 9;
const TRUNCATE_LIMIT = 140;

export default function ReviewsPage() {
  const config = useSiteConfig();
  const allReviews = parseReviews(config);

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const badgeText = config.reviews_badge || "Avis Vérifiés Google";
  const titleText = config.reviews_title || "Avis de nos Clients";
  const subtitleText =
    config.reviews_subtitle ||
    `${allReviews.length} avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.`;

  const openReviewModal = (reviewId?: string) => {
    setSelectedReviewId(reviewId || null);
    setIsModalOpen(true);
  };

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return allReviews;
    const q = searchQuery.toLowerCase();
    return allReviews.filter(
      (r) =>
        r.author.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        (r.vehicle &&
          r.vehicle !== "IZEM MOTORS Alger" &&
          r.vehicle.toLowerCase().includes(q))
    );
  }, [allReviews, searchQuery]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  return (
    <main
      id="main"
      className="min-h-screen bg-[#F8FAFC] text-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div data-pop="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 mb-3">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span>{badgeText}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight m-0">
              {titleText.includes("Clients") ? (
                <>
                  {titleText.replace("Clients", "")}
                  <span className="text-[#044E54]">Clients</span>
                </>
              ) : (
                titleText
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-normal max-w-xl mt-2 leading-relaxed m-0">
              {subtitleText}
            </p>
          </div>

          {/* Google Aggregate Rating Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                5,0
                <span className="text-sm font-normal text-slate-400">/5</span>
              </div>
              <div>
                <div className="flex gap-1 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-900 m-0">
                  {allReviews.length} avis Google vérifiés
                </p>
                <p className="text-[11px] text-slate-400 m-0">
                  Fiche officielle IZEM MOTORS Alger
                </p>
              </div>
            </div>

            <a
              href={BRAND.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#FAFAFC] hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl py-2 px-3.5 text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Consulter sur Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ── Search Bar & Modal Trigger ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Rechercher par client ou mot-clé..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(INITIAL_VISIBLE);
              }}
              className="w-full bg-[#FAFAFC] border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 px-2">
              {filteredReviews.length} avis
            </span>
            <button
              type="button"
              onClick={() => openReviewModal()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Ouvrir en fenêtre</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ── Reviews Grid ────────────────────────────────────────────── */}
        {visibleReviews.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 text-slate-500 text-sm mb-12 shadow-xs">
            Aucun avis ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {visibleReviews.map((rev, i) => {
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
                  data-pop="up"
                  data-pop-stagger={String((i % 6) + 1)}
                  onClick={() => openReviewModal(rev.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openReviewModal(rev.id);
                    }
                  }}
                  className="group bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div>
                    {/* Stars + date */}
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

                    {/* Review text with truncation */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal m-0 min-h-[4rem]">
                      &ldquo;{displayText}&rdquo;
                    </p>

                    {/* Hint to open modal */}
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                        <span>{isLong ? "Lire la suite" : "Ouvrir l'avis"}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-3">
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
                        Client vérifié Google Maps
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Load More / Pagination ──────────────────────────────────── */}
        {hasMore && (
          <div className="text-center mb-16">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INCREMENT_VISIBLE)}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Afficher plus d&apos;avis ({filteredReviews.length - visibleCount} restants)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <div className="text-center bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight m-0 mb-3">
            Prêt à réserver votre véhicule à Alger ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-lg mx-auto mb-6 leading-relaxed">
            Profitez d&apos;une livraison gratuite à l&apos;Aéroport d&apos;Alger avec remise des clés immédiate sans paiement en ligne préalable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.fleet}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <span>Choisir un véhicule</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href={BRAND.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Voir la fiche Google</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Small Window Modal (With cool filter background) ─────────── */}
      <ReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviews={allReviews}
        initialSelectedId={selectedReviewId}
      />
    </main>
  );
}
