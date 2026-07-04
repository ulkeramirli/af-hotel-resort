"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Clock, Ticket, ArrowRight, ArrowLeft, Wand2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";
import CategoryTabs from "./CategoryTabs";
import { EmblaCarouselType } from "embla-carousel";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";

const content = {
  az: { highlightsTitle: "Parkın Möhtəşəm Attrksionları", tickets: "Bilet Qiymətləri" },
  en: { highlightsTitle: "Grand Attractions of the Park", tickets: "Ticket Prices" },
  ru: { highlightsTitle: "Главные достопримечательности парка", tickets: "Стоимость билетов" },
};

export default function Wonderland() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  const [wonderland, setWonderland] = useState<any>(null);

  useEffect(() => {
    fetch("/api/wonderland")
      .then((res) => res.json())
      .then((data) => setWonderland(data.wonderland));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    requestAnimationFrame(() => {
      if (emblaApi) onSelect(emblaApi);
    });
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, activeTab]);

  const active = wonderland?.bigAttractions?.[activeTab];

  return (
    <section id="wonderland" className="py-24 md:py-32 relative overflow-hidden scroll-mt-10 bg-[#f8fafc] perspective-1000">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-[#00b5d5]/10 to-[#ff6c02]/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-[#ff6c02]/10 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-20 md:space-y-28">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <ScrollReveal type="dropIn" delay={0.1}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-[#00b5d5]/20 shadow-[0_4px_20px_rgba(0,181,213,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00b5d5]/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <Wand2 className="w-5 h-5 text-[#ff6c02] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1e325c]">
                {(wonderland?.tag as any)?.[l] || (wonderland?.tag as any)?.name || wonderland?.tag || "WONDERLAND"}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal type="flipUp" delay={0.2}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#1e325c] tracking-tight font-serif leading-tight relative inline-block">
              {(wonderland?.title as any)?.[l] || (wonderland?.title as any)?.name || wonderland?.title || "Əyləncə Mərkəzi"}
              <Sparkles className="absolute -top-5 -right-7 w-10 h-10 text-[#ff6c02] opacity-70" />
            </h2>
          </ScrollReveal>

          <ScrollReveal type="zoomIn" delay={0.3}>
            <div className="text-sm md:text-lg text-stone-500 font-medium leading-relaxed prose prose-stone max-w-2xl mx-auto [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: (wonderland?.description as any)?.[l] || (wonderland?.description as any)?.name || wonderland?.description || "Description" }} />
          </ScrollReveal>
        </div>

        {/* Highlights / Small Attractions */}
        <div className="space-y-10">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#00b5d5]/60 to-transparent" />
            <h3 className="text-xs uppercase font-semibold tracking-[0.2em] text-stone-500">
              {c.highlightsTitle}
            </h3>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#ff6c02]/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {wonderland?.smallAttractions?.map((h:any, i:any) => (
              <TiltCard key={i} tiltAmount={3}>
                <ScrollReveal type="zoomIn" delay={i * 0.15}
                  className="h-full relative group bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 hover:border-[#00b5d5]/30 shadow-[0_4px_20px_rgba(30,50,92,0.03)] overflow-hidden transition-all duration-700 hover:shadow-[0_16px_40px_rgba(0,181,213,0.08)]"
                >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-[#00b5d5]/10 to-transparent rounded-full blur-2xl group-hover:bg-[#ff6c02]/10 transition-colors duration-700" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-[1.25rem] bg-stone-50 flex items-center justify-center text-2xl border border-stone-100 shadow-inner group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-gradient-to-br group-hover:from-[#00b5d5]/10 group-hover:to-transparent transition-all duration-500">
                    {h?.icon}
                  </div>
                  <div className="flex-1 sm:pt-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#1e325c] mb-1.5 group-hover:text-[#00b5d5] transition-colors leading-tight">{(h?.name as any)?.[l] || (h?.name as any)?.az || "Name"}</h4>
                    <div className="text-[13px] text-stone-500 font-medium leading-relaxed prose prose-stone [&>p]:mb-0 line-clamp-2" dangerouslySetInnerHTML={{ __html: (h?.description as any)?.[l] || (h?.description as any)?.az || "Desc" }} />
                  </div>
                </div>
                </ScrollReveal>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Dynamic Attractions Slider */}
        <ScrollReveal type="flipUp" delay={0.2} className="relative z-20">
          <div className="bg-white rounded-[3rem] p-6 md:p-12 lg:p-16 border border-stone-100 shadow-[0_20px_60px_rgba(30,50,92,0.06)] relative overflow-hidden">
            
            {/* Background glowing blob for slider area */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#00b5d5]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
              {wonderland?.bigAttractions?.length > 0 && (
                <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                  <CategoryTabs
                    categories={wonderland.bigAttractions.map((t:any, i:any) => ({
                      id: String(i),
                      label: (t.title as any)?.[l] || (t as any).title || "Tab"
                    }))}
                    activeId={String(activeTab)}
                    onSelect={(id) => {
                      setActiveTab(Number(id));
                      emblaApi?.scrollTo(0);
                    }}
                    className="justify-center lg:justify-start gap-3"
                  />
                </div>
              )}

              <div className="flex gap-2 shrink-0">
                <button onClick={scrollPrev} disabled={!prevBtnEnabled} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${prevBtnEnabled ? "bg-white border border-stone-200 hover:border-[#1e325c] text-stone-500 hover:text-[#1e325c] shadow-sm hover:scale-105" : "bg-stone-50/50 text-stone-200 border border-stone-100 cursor-not-allowed"}`}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={scrollNext} disabled={!nextBtnEnabled} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${nextBtnEnabled ? "bg-[#1e325c] hover:bg-[#162545] text-white shadow-md hover:scale-105" : "bg-stone-50/50 text-stone-200 border border-stone-100 cursor-not-allowed"}`}>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16" ref={emblaRef}>
              <div className="flex gap-6 md:gap-10 py-6">
                {active?.games?.map((game: any, i: number) => (
                  <div key={i} className="flex-none w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[32vw] group relative rounded-[2.5rem] cursor-grab active:cursor-grabbing hover:-translate-y-4 transition-all duration-500 ease-out perspective-1000">
                    <div className="absolute inset-0 bg-[#ff6c02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl scale-95 -z-10" />
                    
                    <div className="relative bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_10px_30px_rgba(30,50,92,0.08)] group-hover:shadow-[0_30px_60px_rgba(0,181,213,0.15)] h-full flex flex-col overflow-hidden transition-all duration-500 transform-gpu group-hover:rotate-y-2 group-hover:rotate-x-2">
                      
                      {/* Image Container */}
                      <div className="relative h-72 md:h-80 overflow-hidden bg-stone-100">
                        <Image src={game.image} alt={(game.name as any)?.[l] || (game.name as any)?.az || "Game"} fill sizes="(max-width: 640px) 85vw, 40vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e325c]/90 via-[#1e325c]/20 to-transparent" />
                        
                        {/* Title overlaying image for dramatic effect */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="font-serif font-semibold text-2xl text-white group-hover:text-[#00b5d5] transition-colors drop-shadow-lg">
                        {(game.name as any)?.[l] || (game.name as any)?.az || "Game"}
                      </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 flex-1 bg-white relative">
                        <div className="absolute -top-4 right-8 w-12 h-12 bg-[#ff6c02] rounded-2xl rotate-12 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,108,2,0.4)] group-hover:rotate-[24deg] group-hover:scale-110 transition-all duration-500">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div className="text-sm md:text-base text-stone-500 font-medium leading-relaxed prose prose-stone [&>p]:mb-0 pt-2" dangerouslySetInnerHTML={{ __html: (game.description as any)?.[l] || (game as any)?.description || "Desc" }} />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Tickets & Info Area */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Tickets */}
          <ScrollReveal type="slideRight" delay={0.3} className="xl:col-span-7 bg-white border border-stone-100 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-[0_15px_50px_rgba(30,50,92,0.05)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00b5d5]/5 rounded-full blur-3xl group-hover:bg-[#00b5d5]/15 transition-colors duration-1000" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10 border-b border-stone-100 pb-6">
              <h3 className="font-serif text-3xl text-[#1e325c] flex items-center gap-3 font-semibold">
                <Ticket className="w-8 h-8 text-[#ff6c02]" />
                {c.tickets}
              </h3>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10">
              {wonderland?.tickets?.map((ticket: any) => (
                <div key={ticket._id} className="relative bg-stone-50 rounded-2xl border border-stone-200 hover:border-[#00b5d5] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 overflow-hidden group/ticket flex flex-col justify-center min-h-[70px]">
                  
                  {/* Perforations for real ticket look */}
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-r border-stone-200 group-hover/ticket:border-[#00b5d5] transition-colors" />
                  <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-l border-stone-200 group-hover/ticket:border-[#00b5d5] transition-colors" />
                  
                  <div className="flex justify-between items-center px-6 py-4 border-l-2 border-dashed border-stone-200 group-hover/ticket:border-[#ff6c02]/50 ml-3 transition-colors">
                    <span className="text-sm md:text-base font-bold text-[#1e325c] pr-4">
                      {(ticket.name as any)?.[l] || (ticket.name as any)?.az || ticket.name || "Ticket"}
                    </span>
                    <span className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6c02] to-[#e55f00] drop-shadow-sm whitespace-nowrap">
                      {ticket.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Special Offer & Info */}
          <ScrollReveal type="slideLeft" delay={0.4} className="xl:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-stone-100 flex items-center gap-6 shadow-[0_15px_50px_rgba(30,50,92,0.05)] hover:shadow-[0_20px_60px_rgba(0,181,213,0.1)] hover:border-[#00b5d5]/30 transition-all duration-500 group">
              <div className="w-20 h-20 rounded-[1.5rem] bg-[#1e325c]/5 flex items-center justify-center text-[#1e325c] shrink-0 border border-[#1e325c]/10 group-hover:bg-[#1e325c] group-hover:text-white transition-colors duration-500">
                <Clock className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#00b5d5] font-black mb-1">İş Saatları</p>
                <p className="text-xl font-semibold text-[#1e325c] tracking-tight">{wonderland?.workingHours}</p>
              </div>
            </div>

            {wonderland?.discount?.enabled && (
              <div className="flex-1 rounded-[3rem] p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#1e325c] via-[#162545] to-[#0a1628] shadow-[0_25px_50px_rgba(30,50,92,0.4)] group cursor-default border border-[#00b5d5]/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b5d5]/15 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff6c02]/10 rounded-full blur-3xl" />
                <Sparkles className="absolute -bottom-10 -right-10 w-56 h-56 text-[#00b5d5]/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                
                <div className="relative z-10 flex flex-col h-full justify-center text-white">
                  <span className="inline-block px-5 py-2 bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-full w-fit mb-6 shadow-sm backdrop-blur-md border border-white/20">
                    Xüsusi Təklif
                  </span>
                  <h4 className="text-white text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
                    {wonderland.discount.percentage}% Endirim
                  </h4>
                  <p className="text-white text-sm font-medium mb-8 max-w-[200px] leading-relaxed">
                    {(wonderland as any)?.specialOffer?.text?.[l] || "Xüsusi təklif mətni"}
                  </p>
                  <MagneticButton>
                    <button className="flex items-center gap-2 bg-[#00b5d5] hover:bg-[#009ab8] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-[#00b5d5]/30 hover:shadow-[#00b5d5]/50 hover:-translate-y-1 mt-2">
                      <Ticket className="w-5 h-5" />
                      {(wonderland as any)?.specialOffer?.btnText?.[l] || "Buy Tickets"}
                    </button>
                  </MagneticButton>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}