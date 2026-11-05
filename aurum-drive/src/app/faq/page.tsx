"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { faqs } from "@/lib/data";
import { BRAND, ROUTES } from "@/lib/config";
import { Search, Plus, Minus, MessageSquare, Phone } from "lucide-react";

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  const themes = useMemo(() => {
    return Array.from(new Set(faqs.map((f) => f.theme)));
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (selectedTheme !== "all" && faq.theme !== selectedTheme) return false;
      if (
        searchQuery &&
        !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedTheme]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div
      id="main"
      className="min-h-screen py-6 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Title */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] uppercase tracking-[0.2em] font-semibold"
          style={{
            border: "1px solid rgba(194,165,107,.4)",
            background: "rgba(194,165,107,.06)",
            color: "var(--gold)",
          }}
        >
          <span>Centre d&apos;Aide &amp; FAQ</span>
        </div>
        <h1
          className="text-2xl sm:text-5xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--ivory)" }}
        >
          Questions{" "}
          <span
            className="italic font-normal"
            style={{ color: "var(--gold)" }}
          >
            Fréquentes
          </span>
        </h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--ivory-dim)" }}>
          Retrouvez toutes les précisions sur les conditions de location, le
          dépôt de caution et les modalités de remise des clés.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto pt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question, caution, permis..."
            className="w-full rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none"
            style={{
              background: "var(--night-850)",
              border: "1px solid rgba(255,255,255,.07)",
              color: "var(--ivory)",
              transition: "border-color var(--dur-hover) var(--ease-out-strong)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--gold)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,.07)")
            }
          />
          <Search
            className="w-5 h-5 absolute left-4 top-7"
            style={{ color: "var(--gold)" }}
          />
        </div>

        {/* Theme Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedTheme("all")}
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={
              selectedTheme === "all"
                ? {
                    background: "var(--gold)",
                    color: "var(--night-950)",
                    fontWeight: 700,
                    transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                  }
                : {
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "var(--ivory-dim)",
                    transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                  }
            }
          >
            Toutes
          </button>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className="px-4 py-1.5 rounded-full text-xs font-medium"
              style={
                selectedTheme === t
                  ? {
                      background: "var(--gold)",
                      color: "var(--night-950)",
                      fontWeight: 700,
                      transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                    }
                  : {
                      background: "rgba(255,255,255,.05)",
                      border: "1px solid rgba(255,255,255,.08)",
                      color: "var(--ivory-dim)",
                      transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                    }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,.07)",
                background: "var(--night-850)",
                transition: `border-color var(--dur-hover) var(--ease-out-strong)`,
              }}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                style={
                  isOpen
                    ? {
                        background: "rgba(194,165,107,.1)",
                        color: "var(--gold)",
                        transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                      }
                    : {
                        color: "var(--ivory)",
                        transition: `background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
                      }
                }
                onMouseEnter={(e) => {
                  if (!isOpen)
                    e.currentTarget.style.background = "rgba(255,255,255,.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) e.currentTarget.style.background = "";
                }}
              >
                <div className="space-y-1">
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: isOpen ? "rgba(194,165,107,.7)" : "var(--gold)" }}
                  >
                    {faq.theme}
                  </span>
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {faq.question}
                  </div>
                </div>

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={
                    isOpen
                      ? {
                          background: "var(--gold)",
                          color: "var(--night-950)",
                        }
                      : {
                          background: "rgba(255,255,255,.06)",
                          color: "var(--ivory-mute)",
                        }
                  }
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div
                  className="p-6 text-sm leading-relaxed"
                  style={{
                    background: "var(--night-900)",
                    borderTop: "1px solid rgba(255,255,255,.07)",
                    color: "var(--ivory-dim)",
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div
        className="rounded-3xl p-8 text-center space-y-4"
        style={{
          background: "var(--night-900)",
          border: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--ivory)" }}
        >
          Vous avez une question spécifique ?
        </h2>
        <p className="text-xs" style={{ color: "var(--ivory-dim)" }}>
          Notre équipe est joignable 7j/7 pour vous apporter toutes les réponses
          nécessaires.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp direct</span>
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>{BRAND.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
