"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Vehicle } from "@/content/fleet";
import { BRAND, ROUTES } from "@/lib/config";
import {
  X,
  Users,
  Fuel,
  SlidersHorizontal,
  Check,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

export interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', sans-serif";

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date) {
  const aNorm = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bNorm = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return aNorm < bNorm;
}

// Generate deterministic reserved date ranges per vehicle
// Uses vehicle.id as seed so every car has different reserved blocks
function getReservedDates(vehicleId: number): Set<string> {
  const reserved = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Seed-based blocks: 2-3 blocks of 2-5 days within next 60 days
  const seed = vehicleId * 7919; // prime multiplier for spread
  const blocks = [
    { offset: (seed % 8) + 3,        length: (seed % 4) + 2 },
    { offset: (seed % 12) + 14,      length: (seed % 3) + 2 },
    { offset: (seed % 10) + 30,      length: (seed % 5) + 3 },
  ];

  for (const block of blocks) {
    for (let i = 0; i < block.length; i++) {
      const d = addDays(today, block.offset + i);
      reserved.add(toISO(d));
    }
  }
  return reserved;
}

// ─── Calendar Component ───────────────────────────────────────────────────────

const DAYS_FR = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

interface CalendarProps {
  vehicleId: number;
  onRangeChange: (start: Date | null, end: Date | null) => void;
}

function AvailabilityCalendar({ vehicleId, onRangeChange }: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const reservedDates = useMemo(() => getReservedDates(vehicleId), [vehicleId]);

  // Build calendar grid for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Monday-first: 0=Mon … 6=Sun
    let startWeekday = firstDay.getDay(); // 0=Sun in JS
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (Date | null)[] = [];

    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    return cells;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function isReserved(d: Date) {
    return reservedDates.has(toISO(d));
  }

  function isPast(d: Date) {
    return isBefore(d, today);
  }

  function isDisabled(d: Date) {
    return isPast(d) || isReserved(d);
  }

  function isStart(d: Date) {
    return startDate ? sameDay(d, startDate) : false;
  }

  function isEnd(d: Date) {
    return endDate ? sameDay(d, endDate) : false;
  }

  function isInRange(d: Date) {
    const rangeEnd = endDate ?? hoverDate;
    if (!startDate || !rangeEnd) return false;
    const s = startDate.getTime();
    const e = rangeEnd.getTime();
    const t = d.getTime();
    return t > Math.min(s, e) && t < Math.max(s, e);
  }

  function handleDayClick(d: Date) {
    if (isDisabled(d)) return;

    // First click OR both already set → reset and start new
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      onRangeChange(d, null);
      return;
    }

    // Second click
    if (sameDay(d, startDate)) return; // ignore same day

    // Ensure start < end
    if (isBefore(d, startDate)) {
      // Check no reserved in between
      const noBlock = !hasReservedInRange(d, startDate);
      if (!noBlock) return;
      setStartDate(d);
      setEndDate(startDate);
      onRangeChange(d, startDate);
    } else {
      const noBlock = !hasReservedInRange(startDate, d);
      if (!noBlock) return;
      setEndDate(d);
      onRangeChange(startDate, d);
    }
  }

  function hasReservedInRange(a: Date, b: Date) {
    let cur = addDays(a, 1);
    while (isBefore(cur, b)) {
      if (reservedDates.has(toISO(cur))) return true;
      cur = addDays(cur, 1);
    }
    return false;
  }

  // ── Light iOS calendar ──
  return (
    <div style={{
      marginBottom: 16,
      borderRadius: 18,
      background: "#F5F5F7",
      border: "1px solid rgba(0,0,0,0.07)",
      overflow: "hidden",
      fontFamily: SF,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "14px 18px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "#0B7584", marginBottom: 3 }}>
            Étape 1
          </div>
          <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.2, color: "#1D1D1F" }}>
            <span style={{ fontWeight: 300 }}>Choisissez vos </span>
            <span style={{ fontWeight: 800 }}>dates</span>
          </h3>
        </div>
        {/* Live state pill */}
        <div style={{
          padding: "5px 13px",
          borderRadius: 99,
          background: startDate && endDate ? "#0B7584" : "rgba(0,0,0,0.07)",
          color: startDate && endDate ? "#fff" : "#6E6E73",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.01em",
          transition: "background 0.25s ease, color 0.25s ease",
          whiteSpace: "nowrap",
        }}>
          {startDate && endDate
            ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)} nuit${Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) > 1 ? "s" : ""}`
            : startDate ? "→ retour ?" : "Sélectionnez"}
        </div>
      </div>

      {/* ── Month nav ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px 8px",
      }}>
        <button onClick={prevMonth} aria-label="Mois précédent" style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
          color: "#1D1D1F", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "background 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F7")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>

        <span style={{ fontSize: 17, color: "#1D1D1F", lineHeight: 1, letterSpacing: "-0.02em" }}>
          <span style={{ fontWeight: 300 }}>{MONTHS_FR[viewMonth]} </span>
          <span style={{ fontWeight: 800 }}>{viewYear}</span>
        </span>

        <button onClick={nextMonth} aria-label="Mois suivant" style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
          color: "#1D1D1F", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "background 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F7")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 6px" }}>
        {DAYS_FR.map(day => (
          <div key={day} style={{
            textAlign: "center", fontSize: 10, fontWeight: 800,
            color: "#AEAEB2", letterSpacing: "0.07em", padding: "2px 0",
          }}>{day}</div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 10px", rowGap: 2 }}>
        {calendarDays.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;

          const reserved = isReserved(d);
          const past = isPast(d);
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          const isToday = sameDay(d, today);
          const disabled = past || reserved;

          // Circle styling
          let circleBg = "transparent";
          let circleColor = "#1D1D1F";
          let circleBorder = "none";
          let circleFW = 400;
          let circleOpacity = 1;
          let textDeco = "none";
          let shadow = "none";

          if (past) {
            circleColor = "#C7C7CC";
            circleOpacity = 0.5;
          } else if (reserved) {
            // OBVIOUS: coral background + strikethrough
            circleBg = "rgba(255,59,48,0.12)";
            circleColor = "#C08080";
            textDeco = "line-through";
            circleFW = 500;
          } else if (start || end) {
            circleBg = "#0B7584";
            circleColor = "#FFFFFF";
            circleFW = 800;
            shadow = "0 4px 12px rgba(11, 117, 132,0.4)";
          } else if (inRange) {
            circleColor = "#0B7584";
            circleFW = 600;
          } else if (isToday) {
            circleBorder = "2px solid #0B7584";
            circleColor = "#0B7584";
            circleFW = 700;
          }

          // Range strip background on wrapper
          const stripBg = inRange ? "rgba(11, 117, 132,0.09)" : "transparent";
          const stripRadius = start ? "50% 0 0 50%" : end ? "0 50% 50% 0" : inRange ? "0" : undefined;

          // Dot color
          const dotColor = reserved ? "#FF453A" : (past || start || end || inRange) ? "transparent" : "#34C759";

          return (
            <div
              key={toISO(d)}
              className="day-cell"
              data-day={d.getDate()}
              data-date={toISO(d)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                background: stripBg,
                borderRadius: stripRadius,
                padding: "2px 0",
              }}
              onMouseEnter={() => { if (!disabled && startDate && !endDate) setHoverDate(d); }}
              onMouseLeave={() => setHoverDate(null)}
              onClick={() => handleDayClick(d)}
            >
              <div
                className="day-circle"
                style={{
                width: 34, height: 34, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13.5,
                fontWeight: circleFW,
                cursor: disabled ? "not-allowed" : "pointer",
                background: circleBg,
                color: circleColor,
                border: circleBorder,
                opacity: circleOpacity,
                textDecoration: textDeco,
                transition: "background 0.12s ease, transform 0.1s ease, box-shadow 0.12s ease",
                flexShrink: 0,
                userSelect: "none",
                boxShadow: shadow,
                transform: (start || end) ? "scale(1.08)" : "scale(1)",
              }}>
                {d.getDate()}
              </div>
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: dotColor, flexShrink: 0,
              }} />
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 18px 12px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        flexWrap: "wrap",
      }}>
        {/* Réservé */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF453A" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Réservé</span>
        </div>
        {/* Disponible */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34C759" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Disponible</span>
        </div>
        {/* Sélectionné */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0B7584", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Sélectionné</span>
        </div>
      </div>

      {/* ── Selected summary bar ── */}
      {startDate && (
        <div style={{
          margin: "0 12px 12px",
          padding: "12px 16px",
          borderRadius: 12,
          background: startDate && endDate ? "#FFFFFF" : "rgba(11, 117, 132,0.04)",
          border: startDate && endDate ? "1px solid rgba(11, 117, 132,0.18)" : "1.5px dashed rgba(11, 117, 132,0.22)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          transition: "all 0.2s ease",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#0B7584", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>
              {startDate && endDate ? "Période confirmée" : "Départ sélectionné"}
            </div>
            <div style={{ fontSize: 13.5, color: "#1D1D1F", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800 }}>
                {startDate.toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
              </span>
              {endDate ? (
                <>
                  <span style={{ color: "#0B7584", fontWeight: 300, fontSize: 18, lineHeight: 1 }}>→</span>
                  <span style={{ fontWeight: 800 }}>
                    {endDate.toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
                  </span>
                </>
              ) : (
                <span style={{ fontWeight: 300, color: "#AEAEB2", fontStyle: "italic", fontSize: 12 }}>
                  → cliquez la date de retour
                </span>
              )}
            </div>
          </div>
          {startDate && endDate && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1D1D1F", lineHeight: 1 }}>
                {Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)}
                <span style={{ fontSize: 12, fontWeight: 300, color: "#AEAEB2" }}> nuits</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  // Reset dates when vehicle changes
  useEffect(() => {
    setPickupDate(null);
    setReturnDate(null);
  }, [vehicle?.id]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 220);
  }, [isClosing, onClose]);

  // Background scroll lock
  useEffect(() => {
    if (!vehicle) return;
    const scrollY = window.scrollY || 0;
    const prev = {
      pos: document.body.style.position,
      top: document.body.style.top,
      w: document.body.style.width,
      ovf: document.body.style.overflow,
      htmlOvf: document.documentElement.style.overflow,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev.htmlOvf;
      document.body.style.position = prev.pos;
      document.body.style.top = prev.top;
      document.body.style.width = prev.w;
      document.body.style.overflow = prev.ovf;
      window.scrollTo(0, scrollY);
    };
  }, [vehicle]);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [handleClose]);

  if (!vehicle) return null;

  const modelPart = vehicle.name.startsWith(vehicle.brand)
    ? vehicle.name.slice(vehicle.brand.length).trim()
    : vehicle.name;

  // Build reserve href with dates
  const pad = (n: number) => String(n).padStart(2, "0");
  function toDateTimeLocal(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
  }

  const reserveHref = ROUTES.reserve(
    vehicle.id,
    pickupDate ? toDateTimeLocal(pickupDate) : undefined,
    returnDate ? toDateTimeLocal(returnDate) : undefined,
  );

  const waText = encodeURIComponent(`Bonjour, je souhaite réserver le véhicule ${vehicle.name}.`);
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${waText}`;
  const detailHref = ROUTES.vehicle(vehicle.slug);

  const totalDays = pickupDate && returnDate
    ? Math.ceil((returnDate.getTime() - pickupDate.getTime()) / 86400000)
    : null;
  const totalPrice = totalDays ? totalDays * vehicle.pricePerDay : null;

  return (
    <>
      <style>{`
        @keyframes ios-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ios-modal-in {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .vm-btn-reserve {
          flex: 1 1 180px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0B7584;
          color: #FFFFFF;
          border-radius: 99px;
          padding: 13px 20px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 16px -4px rgba(11, 117, 132, 0.4);
          cursor: pointer;
          transition: background 0.18s ease, transform 0.15s ease;
          font-family: ${SF};
          border: none;
        }
        .vm-btn-reserve:hover { background: #00878A; transform: translateY(-1px); }
        .vm-btn-reserve:active { transform: scale(0.97); }
        .vm-btn-wa {
          flex: 0 1 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 99px;
          padding: 13px 20px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 14px -4px rgba(15, 23, 42, 0.25);
          cursor: pointer;
          transition: background 0.18s ease;
          white-space: nowrap;
          font-family: ${SF};
          border: none;
        }
        .vm-btn-wa:hover { background: #1E293B; }
        .ios-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.2) transparent;
        }
        .ios-modal-scroll::-webkit-scrollbar { width: 5px; }
        .ios-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .ios-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.2);
          border-radius: 99px;
        }
        .day-cell, .day-circle {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        aria-modal="true"
        role="dialog"
        aria-label={`Détails du véhicule ${vehicle.name}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(15, 23, 42, 0.48)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(12px, 3vw, 24px) clamp(16px, 4vw, 24px)",
          overflowY: "auto",
          overscrollBehavior: "contain",
          opacity: isClosing ? 0 : 1,
          animation: !isClosing ? "ios-backdrop-in 0.22s ease-out forwards" : "none",
          transition: "opacity 0.22s ease-out",
          cursor: "default",
        }}
      >
        {/* Modal card */}
        <div
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          className="ios-modal-scroll"
          style={{
            position: "relative",
            width: "min(620px, calc(100vw - 32px))",
            maxHeight: "min(88vh, 840px)",
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            borderRadius: "clamp(18px, 3vw, 24px)",
            background: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 28px 70px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)",
            fontFamily: SF,
            cursor: "default",
            animation: !isClosing ? "ios-modal-in 0.28s cubic-bezier(0.32, 0.72, 0, 1) forwards" : "none",
            transform: isClosing ? "scale(0.94)" : "scale(1)",
            opacity: isClosing ? 0 : 1,
            transition: "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease-out",
          }}
        >
          {/* ── Header image ── */}
          <div style={{
            position: "relative",
            height: "clamp(135px, 28vw, 210px)",
            width: "100%",
            background: "#F1F5F9",
            overflow: "hidden",
            borderTopLeftRadius: "clamp(18px, 3vw, 24px)",
            borderTopRightRadius: "clamp(18px, 3vw, 24px)",
          }}>
            <img
              src={vehicle.images[0] || "/cars/audi-a3-sportback.jpg"}
              alt={vehicle.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            {/* Availability badge */}
            <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 8,
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                backdropFilter: "blur(14px) saturate(1.5)",
                WebkitBackdropFilter: "blur(14px) saturate(1.5)",
                background: vehicle.available ? "rgba(20, 83, 45, 0.85)" : "rgba(127, 29, 29, 0.80)",
                border: vehicle.available ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(252,165,165,0.2)",
                color: vehicle.available ? "rgba(220,252,231,0.98)" : "rgba(254,226,226,0.95)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: vehicle.available ? "#4ADE80" : "#F87171" }} />
                {vehicle.available ? "Disponible" : "Indisponible"}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer la fenêtre"
              style={{
                position: "absolute", top: 12, right: 12, zIndex: 3,
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#0F172A",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; }}
            >
              <X size={15} strokeWidth={2.4} />
            </button>

            {/* Brand tag */}
            <div style={{ position: "absolute", bottom: 10, left: 12, zIndex: 2 }}>
              <span style={{
                fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#FFFFFF", background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)", padding: "3px 8px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>{vehicle.brand}</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "clamp(12px, 2.5vw, 20px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 24px)" }}>

            {/* Name + price */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              gap: 10, borderBottom: "1px solid #F1F5F9",
              paddingBottom: "clamp(10px, 1.5vw, 16px)",
              marginBottom: "clamp(10px, 1.5vw, 16px)",
            }}>
              <div>
                <h2 style={{
                  fontSize: "clamp(1.15rem, 2.2vw, 1.7rem)",
                  color: "#0F172A", lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em",
                }}>
                  <span style={{ fontWeight: 300 }}>{vehicle.brand} </span>
                  <span style={{ fontWeight: 800 }}>{modelPart}</span>
                </h2>
                <p style={{ fontSize: 11, color: "#64748B", margin: "3px 0 0" }}>
                  Assurance tous risques incluse · Kilométrage selon contrat
                </p>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontFamily: "ui-monospace, 'SF Mono', monospace",
                  fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 800, color: "#0F172A", lineHeight: 1,
                }}>
                  {vehicle.pricePerDay.toLocaleString("fr-DZ")}{" "}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0B7584", fontFamily: SF }}>DA</span>
                </div>
                <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>par jour</span>
                {/* Total if dates selected */}
                {totalPrice !== null && (
                  <div style={{ marginTop: 3, fontSize: 10.5, color: "#0B7584", fontWeight: 700 }}>
                    = {totalPrice.toLocaleString("fr-DZ")} DA ({totalDays}j)
                  </div>
                )}
              </div>
            </div>

            {/* Specs grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(4px, 1vw, 8px)", marginBottom: "clamp(10px, 1.5vw, 16px)" }}>
              {[
                { icon: <SlidersHorizontal size={12} strokeWidth={2.2} />, label: "Boîte", val: vehicle.specs.gearbox },
                { icon: <Fuel size={12} strokeWidth={2.2} />, label: "Carburant", val: vehicle.specs.fuel },
                { icon: <Users size={12} strokeWidth={2.2} />, label: "Places", val: `${vehicle.specs.seats} places` },
              ].map((s, idx) => (
                <div key={idx} style={{
                  background: "#F8FAFC", border: "1px solid #E2E8F0",
                  borderRadius: 10, padding: "clamp(5px, 1vw, 8px) clamp(6px, 1.2vw, 12px)",
                }}>
                  <div style={{
                    fontSize: "clamp(8.5px, 0.9vw, 10px)", color: "#94A3B8", textTransform: "uppercase",
                    letterSpacing: "0.04em", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <span style={{ color: "#64748B" }}>{s.icon}</span>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "clamp(10.5px, 1.1vw, 12px)", fontWeight: 700, color: "#0F172A", marginTop: 3 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* ── Availability Calendar ── */}
            <AvailabilityCalendar
              vehicleId={vehicle.id}
              onRangeChange={(s, e) => { setPickupDate(s); setReturnDate(e); }}
            />

            {/* Pricing rates bar */}
            {(vehicle.pricePerWeek || vehicle.pricePerMonth) && (
              <div style={{
                marginBottom: 16, padding: "9px 12px", borderRadius: 10,
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 11.5, color: "#64748B", flexWrap: "wrap", gap: 8,
              }}>
                {vehicle.pricePerWeek && (
                  <span>
                    Semaine :{" "}
                    <strong style={{ color: "#0F172A", fontFamily: "ui-monospace, monospace" }}>
                      {vehicle.pricePerWeek.toLocaleString("fr-DZ")} DA
                    </strong>
                  </span>
                )}
                {vehicle.pricePerMonth && (
                  <span>
                    Mois :{" "}
                    <strong style={{ color: "#0F172A", fontFamily: "ui-monospace, monospace" }}>
                      {vehicle.pricePerMonth.toLocaleString("fr-DZ")} DA
                    </strong>
                  </span>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0F172A", fontWeight: 600 }}>
                  <ShieldCheck size={13} style={{ color: "#0B7584" }} /> Caution restituée
                </span>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <p style={{
                fontSize: 12.5, color: "#475569", lineHeight: 1.6, margin: "0 0 16px",
                display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {vehicle.description}
              </p>
            )}

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {vehicle.features.slice(0, 4).map((feat, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, fontWeight: 600, color: "#334155",
                    padding: "4px 9px", borderRadius: 8,
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                  }}>
                    <Check size={11} strokeWidth={2.6} style={{ color: "#0B7584" }} />
                    {feat}
                  </span>
                ))}
              </div>
            )}

            {/* CTA hint if no dates */}
            {!pickupDate && (
              <div style={{
                marginBottom: 12, padding: "9px 12px", borderRadius: 10,
                background: "#F4F8F9", border: "1px solid rgba(11, 117, 132,0.2)",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 12, color: "#92400E",
              }}>
                <CalendarDays size={14} style={{ color: "#0B7584", flexShrink: 0 }} />
                <span>Sélectionnez vos dates dans le calendrier pour voir le prix total et procéder à la réservation.</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={reserveHref}
                  className="vm-btn-reserve"
                >
                  <span>
                    {pickupDate && returnDate
                      ? `Réserver · ${totalDays} jour${totalDays! > 1 ? "s" : ""}`
                      : "Réserver ce véhicule"}
                  </span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vm-btn-wa"
                  aria-label={`Contacter via WhatsApp pour ${vehicle.name}`}
                >
                  <MessageCircle size={16} strokeWidth={2.4} style={{ color: "#25D366" }} />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div style={{ textAlign: "center", paddingTop: 4 }}>
                <Link
                  href={detailHref}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 12, fontWeight: 600, color: "#64748B",
                    textDecoration: "none", transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0B7584")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
                >
                  <span>Consulter la page détaillée &amp; photos de ce modèle</span>
                  <ArrowUpRight size={13} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
