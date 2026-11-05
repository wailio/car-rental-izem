"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/config";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  Navigation,
  Menu,
  X,
} from "lucide-react";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";
import { IzemBrandLockup } from "@/components/common/IzemBrandLockup";

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "Location standard",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Solid placement scroll effect: locks image relative to viewport during scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        subject: "Location standard",
        message: "",
      });
    }, 700);
  };

  const waUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Bonjour IZEM MOTORS, je souhaite des renseignements sur la location d'un véhicule à l'aéroport d'Alger."
  )}`;

  return (
    <main id="main" className="min-h-screen bg-white">
      {/* ── Framed Hero Banner (Exact 75% Compact Height & Solid Placement Effect) ── */}
      <section className="relative w-full px-3.5 sm:px-4 lg:px-[15px] pt-3 sm:pt-[15px]">
        <div className="relative w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#0A0D12] h-[310px] sm:h-[340px] lg:h-[365px] flex flex-col justify-between shadow-2xl border border-white/10">
          {/* Background Image: Smooth Parallax Solid Placement Scroll Effect */}
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            style={{
              transform: `translate3d(0, ${Math.min(scrollY * 0.24, 90)}px, 0)`,
              willChange: "transform",
            }}
          >
            <div
              className="absolute inset-x-0 w-full h-[145%] -top-[20%] bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url('/images/bbg.jpg')",
                backgroundPosition: "center 48%",
              }}
            />
          </div>

          {/* Cinematic Scrims: Anchored to card frame for rock-solid contrast */}
          <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[#0A0D12]/75 via-black/25 to-[#0A0D12]/80" />
          <div className="absolute inset-0 pointer-events-none z-[1] bg-radial-at-c from-transparent via-transparent to-[#0A0D12]/40" />

          {/* ── Embedded Navigation Header (Transparent, Blending In) ────────── */}
          <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-12 py-3.5 sm:py-4 border-b border-white/10">
            {/* Logo */}
            <Link href="/" className="flex items-center text-white no-underline group">
              <IzemBrandLockup theme="dark" size="md" />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/90">
              <Link href="/" className="hover:text-[#0B7584] transition-colors">
                Accueil
              </Link>
              <Link href={ROUTES.fleet} className="hover:text-[#0B7584] transition-colors">
                Flotte
              </Link>
              <Link href={ROUTES.services} className="hover:text-[#0B7584] transition-colors">
                Prestations
              </Link>
              <Link href={ROUTES.about} className="hover:text-[#0B7584] transition-colors">
                À Propos
              </Link>
              <Link href={ROUTES.faq} className="hover:text-[#0B7584] transition-colors">
                FAQ
              </Link>
              <Link href={ROUTES.contact} className="text-[#0B7584] font-semibold hover:text-white transition-colors">
                Contact
              </Link>
            </nav>

            {/* Header Action Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.fleet}
                className="hidden sm:inline-flex items-center gap-2 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  color: "#ffffff",
                  transition: "background var(--dur-hover, 180ms) ease-out, color var(--dur-hover, 180ms) ease-out",
                }}
              >
                <span className="w-5 h-5 rounded-full bg-[#0B7584] text-white flex items-center justify-center shrink-0">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
                <span>Réserver</span>
              </Link>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-white bg-white/10 border border-white/20"
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </header>

          {/* Mobile Menu Drawer */}
          <MobileMenuDrawer
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          {/* ── Center Content Area: Contactez-nous & Breadcrumb ─────────── */}
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto my-auto py-4 space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Contactez-nous
            </h1>

            {/* Breadcrumb badge */}
            <div className="pt-2">
              <div
                className="inline-flex items-center text-xs sm:text-sm font-semibold text-white tracking-wide"
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  borderRadius: "10px",
                  padding: "8px 18px",
                }}
              >
                <Link href="/" className="text-white hover:text-[#0B7584] transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-white/70">/</span>
                <span className="text-white">Contact Us</span>
              </div>
            </div>
          </div>

          {/* Bottom spacing anchor */}
          <div className="h-3" />
        </div>
      </section>

      {/* ── Main Section: 2 Columns (Compact 75% Scale Look) ──────────────── */}
      <section className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Client Image & Clean Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Rentgo Client Image with rounded corners */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <Image
                src="/images/contact-us-image.jpg"
                alt="Service client IZEM MOTORS"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>

            {/* Contact Information Heading */}
            <div>
              <h2 className="text-lg font-bold text-gray-950 tracking-tight">
                Coordonnées de l&apos;agence :
              </h2>
              <div className="w-12 h-0.5 bg-[#0B7584] mt-1.5 mb-5 rounded-full" />

              {/* Clean inline contact rows (Rentgo style, no bulky cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {/* Phone */}
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center gap-3.5 group p-1"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0B7584]/10 text-[#0B7584] group-hover:bg-[#0B7584] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Phone size={17} />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Téléphone direct 24/7 :
                    </div>
                    <div className="text-sm font-bold text-gray-950 group-hover:text-[#0B7584] transition-colors">
                      {BRAND.phone}
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-3.5 group p-1"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0B7584]/10 text-[#0B7584] group-hover:bg-[#0B7584] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Mail size={17} />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Courriel officiel :
                    </div>
                    <div className="text-sm font-bold text-gray-950 group-hover:text-[#0B7584] transition-colors">
                      {BRAND.email}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group p-1"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <MessageSquare size={17} />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                      <span>WhatsApp prioritaire :</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-sm font-bold text-gray-950 group-hover:text-emerald-600 transition-colors">
                      Discuter sur WhatsApp
                    </div>
                  </div>
                </a>

                {/* Showroom & Airport */}
                <div className="flex items-center gap-3.5 p-1">
                  <div className="w-10 h-10 rounded-full bg-[#0B7584]/10 text-[#0B7584] flex items-center justify-center shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Showroom & Aéroport Alger :
                    </div>
                    <div className="text-sm font-bold text-gray-950">
                      Terminal 1, Ouest & Kouba
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rentgo Contact Form Card (Clean & Compact) */}
          <div className="lg:col-span-7 bg-[#F7F8FA] border border-gray-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-xs">
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B7584]" />
                <span>Contactez-nous</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Prenez contact avec nous
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Que vous souhaitiez réserver un véhicule, vérifier une disponibilité ou organiser votre arrivée à l&apos;Aéroport d&apos;Alger, notre équipe est là pour vous accompagner.
              </p>
            </div>

            {submitted ? (
              <div className="p-7 rounded-xl bg-white border border-emerald-200 text-center space-y-3.5 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-950">
                    Message transmis avec succès !
                  </h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Merci. Notre conseiller étudie votre demande et vous contactera rapidement par téléphone ou par e-mail.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#0B7584] hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Prénom & Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Prénom*"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nom de famille*"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Téléphone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Numéro de téléphone*"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Adresse e-mail*"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Objet de la demande */}
                <div>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 outline-none transition-colors cursor-pointer"
                  >
                    <option value="Location standard">Location de courte durée</option>
                    <option value="Location longue durée">Location moyenne ou longue durée</option>
                    <option value="Livraison Aéroport Houari Boumediene">Livraison Aéroport Houari Boumediene</option>
                    <option value="Questions conditions">Conditions & caution</option>
                    <option value="Autre demande">Autre demande spécifique</option>
                  </select>
                </div>

                {/* Row 4: Message */}
                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Écrivez votre message ici..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-[#ECEEF2]/70 hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#0B7584] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-colors resize-y"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2.5 bg-[#0B7584] hover:bg-[#085A66] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md shadow-[#0B7584]/25 transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    <span>{sending ? "Envoi en cours..." : "Envoyer le message"}</span>
                    <span className="w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center shrink-0">
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Section: Points de retrait et de restitution (Style Rentgo) ─────── */}
      <section className="py-12 sm:py-16 bg-[#FBFBFC] border-t border-gray-100">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B7584]" />
              <span>Nos Points de Retrait</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Où récupérer votre voiture à Alger
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Pour votre sérénité dès l&apos;atterrissage, nos équipes vous accueillent sans attente aux terminaux ou dans notre agence showroom.
            </p>
          </div>

          {/* Interactive Map & Locations Box */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm bg-white grid grid-cols-1 lg:grid-cols-12">
            {/* Embedded Google Map — IZEM MOTORS exact location */}
            <div className="lg:col-span-8 min-h-[340px] relative bg-gray-100">
              <iframe
                title="Carte IZEM MOTORS Aéroport Alger"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12790.564220029748!2d3.1556189871582028!3d36.73118100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e5360434cb055%3A0x8f62ecf6fd289b6f!2sIZEM%20MOTORS%20%7C%20Location%20de%20voitures%20A%C3%A9roport%20Alger!5e0!3m2!1sfr!2sdz!4v1793465814167!5m2!1sfr!2sdz"
                className="w-full h-full min-h-[340px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Side locations quick list */}
            <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-[#FAFBFD] border-t lg:border-t-0 lg:border-l border-gray-200/80">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider text-xs">
                  Points stratégiques à Alger
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-950">
                      <Navigation size={13} className="text-[#0B7584]" />
                      <span>Aéroport Houari Boumediene</span>
                    </div>
                    <p className="text-[11px] text-gray-500 pl-5">
                      Terminaux 1 & Ouest — Livraison & reprise 24h/24, 7j/7 sans attente
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-950">
                      <MapPin size={13} className="text-[#0B7584]" />
                      <span>Agence IZEM MOTORS</span>
                    </div>
                    <p className="text-[11px] text-gray-500 pl-5">
                      Alger — Ouvert 7j/7 de 09h00 à 19h00
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-950">
                      <Clock size={13} className="text-[#0B7584]" />
                      <span>Livraison personnalisée</span>
                    </div>
                    <p className="text-[11px] text-gray-500 pl-5">
                      Dépose directe à votre hôtel ou résidence sur rendez-vous
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <Link
                  href={ROUTES.fleet}
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-white bg-[#14181F] hover:bg-[#0B7584] px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span>Choisir un véhicule</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
