"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Star, Clock, Ticket, Compass, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";
import CategoryTabs from "./CategoryTabs";
import { EmblaCarouselType } from "embla-carousel";
import ScrollReveal from "@/components/ScrollReveal";

const content = {
  az: {
    tag: "WONDERLAND THEME PARK",
    title: "Sehrli Dünya",
    subtitle: "Uşaqlar və gənclər üçün möhtəşəm əyləncə məkanı — sonsuz macəra və unudulmaz xatirələr.",
    hours: "10:00 – 21:00",
    season: "İl boyu açıqdır",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Pulsuz",
    labelAdult: "Yetkin",
    labelChild: "Uşaq (4-12)",
    labelInfant: "Körpə (0-3)",
    tickets: "Bilet Qiymətləri",
    specialOfferTitle: "AF Hotel Qonaqları",
    specialOfferDesc: "Hotel qonaqlarına Wonderland-da xüsusi 30% endirim tətbiq olunur.",
    discount: "30% Endirim",
    highlightsTitle: "Parkın Möhtəşəm Attrksionları",
    highlights: [
      { emoji: "🎡", title: "Böyük Dönən Çarx", desc: "Xəzər dənizi və şəhər panoraması ilə zövqlü uçuş" },
      { emoji: "🎢", title: "Mini Rusiya Dağları", desc: "Balaca qəhrəmanlar üçün həyəcanlı və təhlükəsiz sürüş" },
      { emoji: "🎠", title: "Atlı Karusel", desc: "Nağıllar aləmini xatırladan klassik musiqili karusel" },
      { emoji: "🏰", title: "Sehrli Qala", desc: "Gizli keçidlər, labirintlər və interaktiv xəzinə ovu" },
      { emoji: "🎯", title: "Oyun Arenaları", desc: "Müasir texnologiyalarla təchiz olunmuş 10+ oyun stansiyası" },
      { emoji: "🍭", title: "Şirniyyat Küçəsi", desc: "Rəngarəng pambıq şəkər, dondurma və dadlı qəlyanaltılar" },
    ],
    tabs: [
      {
        label: "Uşaqlar Zonu",
        items: [
          { name: "Atıcılıq Oyunu", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800&q=80", desc: "Hədəfi dəqiq vur, xüsusi mükafatlar qazan" },
          { name: "Mini Dəmir Yolu", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=800&q=80", desc: "Sehrli parkın ətrafında nağılvari qatar gəzintisi" },
          { name: "Kukla Teatrı", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80", desc: "Hər gün uşaqların sevimli personajları ilə canlı tamaşalar" },
          { name: "Batut Dünyası", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", desc: "Uşaqlar üçün təhlükəsiz və əyləncəli tullanma zonası" },
        ],
      },
      {
        label: "Gənclər & Adrenalin",
        items: [
          { name: "VR Arena", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80", desc: "Virtual reallıq dünyasında komanda oyunları (10+ yaş)" },
          { name: "Lazer Oyunu", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80", desc: "Xüsusi effektli qaranlıq arenada lazer tag döyüşü" },
          { name: "Trampolin Park", img: "https://images.unsplash.com/photo-1551632867-c58444c19343?w=800&q=80", desc: "Böyük akrobatika zonası və sərbəst tullanma sahəsi" },
        ],
      },
      {
        label: "Ailəvi Əyləncə",
        items: [
          { name: "Ailə Pikniyi", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", desc: "Yaşıllıqlar qoynunda xüsusi istirahət və barbecue zonaları" },
          { name: "4D Kino", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", desc: "Külək, su və hərəkət effektləri ilə tam immersion kino" },
          { name: "Fotozona", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", desc: "Peşəkar dekorasiyalarla bəzədilmiş xatirə guşələri" },
        ],
      },
    ],
  },
  en: {
    tag: "WONDERLAND THEME PARK",
    title: "Magical World",
    subtitle: "A magnificent entertainment center for children and youth — endless adventure and unforgettable memories.",
    hours: "10:00 – 21:00",
    season: "Open year-round",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Free",
    labelAdult: "Adult",
    labelChild: "Child (4-12)",
    labelInfant: "Infant (0-3)",
    tickets: "Ticket Prices",
    specialOfferTitle: "AF Hotel Guests",
    specialOfferDesc: "A special 30% discount applies to Wonderland for hotel guests.",
    discount: "30% Discount",
    highlightsTitle: "Grand Attractions of the Park",
    highlights: [
      { emoji: "🎡", title: "Big Ferris Wheel", desc: "Enjoyable flight with Caspian Sea and city panorama" },
      { emoji: "🎢", title: "Mini Roller Coaster", desc: "Exciting and safe ride for little heroes" },
      { emoji: "🎠", title: "Classic Carousel", desc: "Classic themed musical horse carousel from fairy tales" },
      { emoji: "🏰", title: "Magic Castle", desc: "Hidden passages, mazes, and interactive treasure hunts" },
      { emoji: "🎯", title: "Game Arenas", desc: "10+ interactive game stations equipped with modern tech" },
      { emoji: "🍭", title: "Candy Street", desc: "Colorful cotton candy, premium ice cream, and tasty snacks" },
    ],
    tabs: [
      {
        label: "Kids Zone",
        items: [
          { name: "Shooting Game", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800&q=80", desc: "Hit targets accurately and win special prizes" },
          { name: "Mini Railroad", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=800&q=80", desc: "A fairytale train ride around the magical park" },
          { name: "Puppet Theatre", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80", desc: "Daily live performances featuring children's favorite characters" },
          { name: "Trampoline World", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", desc: "Safe and fun jumping area for children" },
        ],
      },
      {
        label: "Youth & Adrenaline",
        items: [
          { name: "VR Arena", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80", desc: "Team games in the world of virtual reality (ages 10+)" },
          { name: "Laser Game", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80", desc: "Laser tag battle in a neon arena with special effects" },
          { name: "Trampolines", img: "https://images.unsplash.com/photo-1551632867-c58444c19343?w=800&q=80", desc: "Large acrobatics zone and free-jumping area" },
        ],
      },
      {
        label: "Family Fun",
        items: [
          { name: "Family Picnic", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", desc: "Special relaxation and barbecue zones surrounded by nature" },
          { name: "4D Cinema", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", desc: "Full immersion cinema with wind, water, and motion effects" },
          { name: "Photo Zone", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", desc: "Beautifully decorated corners for perfect family memories" },
        ],
      },
    ],
  },
  ru: {
    tag: "WONDERLAND THEME PARK",
    title: "Волшебный Мир",
    subtitle: "Грандиозный развлекательный центр для детей и молодежи — бесконечные приключения и яркие воспоминания.",
    hours: "10:00 – 21:00",
    season: "Открыт круглый год",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Бесплатно",
    labelAdult: "Взрослый",
    labelChild: "Ребёнок (4-12)",
    labelInfant: "Малыш (0-3)",
    tickets: "Стоимость билетов",
    specialOfferTitle: "Гости AF Hotel",
    specialOfferDesc: "Для проживающих в отеле гостей действует эксклюзивная скидка 30% на все аттракционы.",
    discount: "Скидка 30%",
    highlightsTitle: "Главные достопримечательности парка",
    highlights: [
      { emoji: "🎡", title: "Колесо обозрения", desc: "Завораживающий полет с панорамой Каспийского моря и города" },
      { emoji: "🎢", title: "Американские горки", desc: "Захватывающая и безопасная поездка для маленьких героев" },
      { emoji: "🎠", title: "Карусель", desc: "Классическая музыкальная карусель с лошадками из сказок" },
      { emoji: "🏰", title: "Волшебный замок", desc: "Потайные ходы, лабиринты и интерактивные поиски сокровищ" },
      { emoji: "🎯", title: "Игровые арены", desc: "10+ интерактивных игровых станций с новейшими технологиями" },
      { emoji: "🍭", title: "Улица сладостей", desc: "Яркая сладкая вата, премиальное мороженое и вкусные закуски" },
    ],
    tabs: [
      {
        label: "Детская Зона",
        items: [
          { name: "Тир и Аттракционы", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800&q=80", desc: "Порази цели точными выстрелами и выиграй суперпризы" },
          { name: "Mini-железная дорога", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=800&q=80", desc: "Сказочное путешествие на поезде по территории парка" },
          { name: "Кукольный театр", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80", desc: "Ежедневные живые представления с любимыми персонажами" },
          { name: "Батутный городок", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", desc: "Безопасная и веселая прыжковая зона для самых маленьких" },
        ],
      },
      {
        label: "Молодежь & Адреналин",
        items: [
          { name: "VR Арена", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80", desc: "Командные тактические игры в виртуальной реальности (10+)" },
          { name: "Лазертаг", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80", desc: "Динамичные бои в неоновой арене со спецэффектами" },
          { name: "Батутный комплекс", img: "https://images.unsplash.com/photo-1551632867-c58444c19343?w=800&q=80", desc: "Огромная зона для акробатики и свободных прыжков" },
        ],
      },
      {
        label: "Семейный Отдых",
        items: [
          { name: "Семейный пикник", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", desc: "Уютные беседки и оборурованные BBQ-зоны среди зелени" },
          { name: "4D Кинотеатр", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", desc: "Кино с эффектами ветра, брызг воды и симуляцией движения" },
          { name: "Фотозоны", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", desc: "Красиво декорированные локации для идеальных семейных фото" },
        ],
      },
    ],
  },
};

export default function Wonderland() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);

  // Инициализация Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
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

  const [wonderland, setWonderland] =
  useState<any>(null);

useEffect(() => {
  fetch("/api/wonderland")
    .then((res) => res.json())
    .then((data) =>
      setWonderland(
        data.wonderland,
      ),
    );
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

 const active =
  wonderland?.bigAttractions?.[
    activeTab
  ];
  return (
    <section id="wonderland" className="py-24 bg-[#faf9f6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-20">
        
        {/* Header & Tabs Container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <ScrollReveal direction="up" delay={0.1} className="space-y-4 text-left">
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block">
              {(wonderland?.tag as any)?.[l] || (wonderland?.tag as any)?.name || wonderland?.tag || "WONDERLAND"}
            </span>

            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif tracking-tight">
              {(wonderland?.title as any)?.[l] || (wonderland?.title as any)?.name || wonderland?.title || "Əyləncə Mərkəzi"}
            </h2>

            <p className="text-sm md:text-base text-stone-500 max-w-2xl font-light leading-relaxed">
              {(wonderland?.description as any)?.[l] || (wonderland?.description as any)?.name || wonderland?.description || "Description"}
            </p>
          </ScrollReveal>

          
        </div>

        {/* Attractions Grid / Highlights */}
        <ScrollReveal direction="up" delay={0.2} className="space-y-8">
          
          <h3 className="text-xs uppercase font-bold tracking-widest text-stone-400 text-center">
            {c.highlightsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {wonderland?.smallAttractions?.map((h:any, i:any) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[#faf8f5] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                 {h?.icon}
                </div>
                <h4 className="text-sm font-semibold text-[#1e325c] mt-2">{(h?.name as any)?.[l] || (h?.name as any)?.az || "Name"}</h4>
                <p className="text-xs text-stone-400 font-light leading-normal">{(h?.description as any)?.[l] || (h?.description as any)?.az || "Desc"}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Interactive Slider Section */}
        <ScrollReveal direction="up" delay={0.3} className="space-y-10 bg-white rounded-3xl p-8 lg:p-12 border border-stone-100 shadow-sm">
           
           {wonderland?.bigAttractions?.length > 0 && (
            <ScrollReveal direction="up" delay={0.2} className="flex-shrink-0">
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
                className="justify-start"
              />
            </ScrollReveal>
          )}
          {/* Slider Navigation Row (Buttons only, since Tabs are above) */}
          <div className="flex justify-end items-center gap-6 border-b border-stone-100 pb-6">

            {/* Slider Controls */}
            <div className="flex gap-2 self-end sm:self-auto">
              <button
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  prevBtnEnabled
                    ? "border-stone-200 text-[#1e325c] bg-[#faf8f5] hover:bg-stone-100"
                    : "border-stone-100 text-stone-300 cursor-not-allowed"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  nextBtnEnabled
                    ? "border-stone-200 text-[#1e325c] bg-[#faf8f5] hover:bg-stone-100"
                    : "border-stone-100 text-stone-300 cursor-not-allowed"
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embla Slider Window */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-6 pl-1">
            {active?.games?.map(
  (game: any, i: number) => (
    <div
      key={i}
      className="flex-none w-[85vw] sm:w-[45vw] md:w-[30vw] group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <Image
          src={game.image}
          alt={(game.name as any)?.[l] || (game.name as any)?.az || "Game"}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 space-y-2">
        <h3 className="font-bold text-base text-[#1e325c] flex items-center justify-between">
          {(game.name as any)?.[l] || (game.name as any)?.az || "Game"}

          <ArrowRight className="w-4 h-4 text-[#c5a880] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>

        <p className="text-xs text-stone-500 font-light leading-relaxed">
          {(game.description as any)?.[l] || (game as any)?.description || "Desc"}
        </p>
      </div>
    </div>
  )
)}
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom: Tickets + Special Offers */}
        <ScrollReveal direction="up" delay={0.4} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Tickets Pricing */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-stone-100 shadow-sm lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#1e325c] flex items-center gap-3">
                <Ticket className="w-6 h-6 text-[#c5a880]" />
                {c.tickets}
              </h3>
              <p className="text-xs text-stone-400 font-light">Parka giriş biletləri və yaş kateqoriyaları</p>
            </div>
            
           <div className="space-y-3 my-4">
  {wonderland?.tickets?.map(
    (ticket: any) => (
      <div
        key={ticket._id}
        className="flex justify-between items-center bg-[#faf9f6] px-6 py-4 rounded-xl border border-stone-100 hover:border-[#c5a880]/30 transition-colors"
      >
        <span className="text-sm font-medium text-stone-600">
          {(ticket.name as any)?.[l] || (ticket.name as any)?.az || ticket.name || "Ticket"}
        </span>

        <span className="text-lg font-bold text-[#1e325c]">
          {ticket.price}
        </span>
      </div>
    )
  )}
</div>
          </div>

          {/* Info & Special Offer Banner */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-stone-100 shadow-sm lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#1e325c] flex items-center gap-3">
                <Compass className="w-6 h-6 text-[#c5a880]" />
                Wonderland Info
              </h3>
              <div className="space-y-4 border-b border-stone-100 pb-6">
                <div className="flex items-center gap-4 text-sm text-stone-600">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-[#00b5d5]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium"><span>
  {wonderland?.workingHours}
</span></span>
                </div>
                
              </div>
            </div>

            {/* Special Discount Card */}
            {wonderland?.discount?.enabled && (
  <div className="rounded-2xl p-6 text-white bg-linear-to-br from-[#1e325c] to-[#0f1b35] relative overflow-hidden shadow-inner">
    <div className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none">
      <Sparkles className="w-36 h-36" />
    </div>

    <div className="relative space-y-2">
      <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest block">
        Xüsusi Təklif
      </span>

      <p className="text-3xl font-black text-[#c5a880] tracking-tight">
        {wonderland.discount.percentage}% Endirim
      </p>

      <p className="text-xs opacity-80 font-light leading-relaxed pt-1">
        AF Hotel qonaqları üçün Wonderland giriş biletlərində xüsusi endirim.
      </p>
    </div>
  </div>
)}

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}