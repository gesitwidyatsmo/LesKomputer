import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import ProgramSection from "@/components/ProgramSection";
import FasilitasSection from "@/components/FasilitasSection";
import TestimonialSection from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqSection";
import CtaBannerSection from "@/components/CtaBannerSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getLandingPageConfig } from "@/lib/landingService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: config } = await getLandingPageConfig();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF5] text-slate-950">
      {config.announcement?.is_visible !== false && (
        <TopAnnouncementBar data={config.announcement?.content} />
      )}
      <Navbar />
      <main className="flex-1">
        {config.hero?.is_visible !== false && (
          <HeroSection data={config.hero?.content} />
        )}
        {config.values?.is_visible !== false && (
          <ValueProposition data={config.values?.content} />
        )}
        {config.programs?.is_visible !== false && (
          <ProgramSection data={config.programs?.content} />
        )}
        {config.fasilitas?.is_visible !== false && (
          <FasilitasSection data={config.fasilitas?.content} />
        )}
        {config.testimonials?.is_visible !== false && (
          <TestimonialSection data={config.testimonials?.content} />
        )}
        {config.faq?.is_visible !== false && (
          <FaqSection data={config.faq?.content} />
        )}
        {config.cta_banner?.is_visible !== false && (
          <CtaBannerSection data={config.cta_banner?.content} />
        )}
      </main>
      {config.footer?.is_visible !== false && (
        <Footer data={config.footer?.content} />
      )}
      {config.floating_wa?.is_visible !== false && (
        <WhatsAppButton data={config.floating_wa?.content} />
      )}
    </div>
  );
}
