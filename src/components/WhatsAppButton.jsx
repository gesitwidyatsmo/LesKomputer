"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatWhatsAppUrl } from "@/lib/landingService";

export default function WhatsAppButton({ data, globalWhatsapp }) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = data?.showTooltip !== false;
  const tooltipText = data?.tooltipText || "[ CHAT MENTOR GESIT >_ ]";
  const whatsappMessage = data?.whatsappMessage || "Halo Admin GWA Tech Course, saya ingin konsultasi jadwal dan program kursus.";

  const waLink = formatWhatsAppUrl(globalWhatsapp, whatsappMessage);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative group flex items-center">
        
        {/* Retro Tooltip Bubble on Left */}
        {showTooltip && tooltipText && (
          <div className="absolute right-full mr-3 bg-black text-amber-300 border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_#000] font-mono text-xs font-bold whitespace-nowrap pointer-events-none hidden md:flex items-center gap-2 group-hover:scale-105 transition-transform select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{tooltipText}</span>
          </div>
        )}

        {/* WhatsApp Tactical Neobrutalist Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-emerald-400 hover:bg-emerald-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          aria-label="Chat Mentor WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-black stroke-[2.5]" />
        </a>

      </div>
    </div>
  );
}
