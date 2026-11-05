import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ServicesEditorialSection } from "@/components/home/ServicesEditorialSection";
import { FeaturedFleetSection } from "@/components/home/FeaturedFleetSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { VideoSection } from "@/components/home/VideoSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div
      id="main"
      className="flex flex-col w-full"
      style={{
        background: '#F5F5F7',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      {/* H1 — Héros Arrivée */}
      <HeroSection />

      {/* H2 — Bande de confiance (5 promesses vérifiées) */}
      <TrustStrip />

      {/* H3 — Catégories */}
      <CategoriesSection />

      {/* H4 — Nos prestations */}
      <ServicesEditorialSection />

      {/* H5 — La flotte */}
      <FeaturedFleetSection />

      {/* H6 — Pourquoi nous choisir */}
      <WhyChooseUsSection />

      {/* H7 — Vidéo (cachée si pas de vraies vidéos) */}
      <VideoSection />

      {/* H8 — Comment réserver */}
      <HowItWorksSection />

      {/* H9 — Témoignages */}
      <ReviewsSection />

      {/* H10 — FAQ */}
      <FAQSection />
    </div>
  );
}
