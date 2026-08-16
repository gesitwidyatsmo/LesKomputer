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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF5] text-slate-950">
      <TopAnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ValueProposition />
        <ProgramSection />
        <FasilitasSection />
        <TestimonialSection />
        <FaqSection />
        <CtaBannerSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
