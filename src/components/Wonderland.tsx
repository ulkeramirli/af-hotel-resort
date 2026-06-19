"use client";
import { useState } from "react";
import Image from "next/image";
import { Sparkles, Star, Clock, Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: {
    tag: "WONDERLAND",
    title: "Sehrli Dünya",
    subtitle: "Uşaqlar üçün ayrıca mövzu parkı — sonsuz əyləncə və macəra",
    children: "Uşaqlar",
    extreme: "Gənclər",
    family: "Ailə",
    hours: "10:00 – 21:00",
    season: "İl boyu açıqdır",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Pulsuz",
    labelAdult: "Yetkin",
    labelChild: "Uşaq (4-12)",
    labelInfant: "Körpə (0-3)",
    tickets: "Bilet Qiymətləri",
    highlights: [
      { emoji: "🎡", title: "Böyük Dönən Çarx", desc: "Şəhər panoraması ilə zövqlü uçuş" },
      { emoji: "🎢", title: "Mini Rusiya Dağları", desc: "Uşaqlar üçün həyəcanlı sürüş" },
      { emoji: "🎠", title: "Atlı Karusel", desc: "Klassik mövzu atlı karusel" },
      { emoji: "🏰", title: "Sehrli Qala", desc: "Labirint, gizli keçidlər, xəzinə" },
      { emoji: "🎯", title: "Oyun Arenaları", desc: "10+ interaktiv oyun stansiyası" },
      { emoji: "🍭", title: "Şirniyyat Küçəsi", desc: "Pambıq şəkər, dondurma, qəlyanaltı" },
    ],
    tabs: [
      {
        label: "Uşaqlar",
        items: [
          { name: "Atıcılıq Oyunu", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&q=80", desc: "Hədəf at, mükafat qazan" },
          { name: "Mini Dəmir Yolu", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=600&q=80", desc: "Parkın ətrafında mini qatar gəzintisi" },
          { name: "Kukla Teatrı", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80", desc: "Gündəlik tamaşalar, uşaqlar üçün" },
        ],
      },
      {
        label: "Gənclər",
        items: [
          { name: "VR Arena", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&q=80", desc: "Virtual reallıq oyunları, 10+ yaş" },
          { name: "Lazer Oyunu", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80", desc: "Lazer tag arena, komanda oyunu" },
          { name: "Trampolin Park", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", desc: "Trampolinlər, akrobatika zonası" },
        ],
      },
      {
        label: "Ailə",
        items: [
          { name: "Ailə Pikniyi", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&q=80", desc: "Xüsusi piknik zonaları, barbecue" },
          { name: "4D Kino", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80", desc: "Hiss edilən effektlərlə 4D kino" },
          { name: "Fotozona", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", desc: "Peşəkar foto burchaqları, yaddaşlar" },
        ],
      },
    ],
  },
  en: {
    tag: "WONDERLAND",
    title: "Magical World",
    subtitle: "A dedicated theme park for children — endless fun and adventure",
    children: "Children",
    extreme: "Youth",
    family: "Family",
    hours: "10:00 – 21:00",
    season: "Open year-round",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Free",
    labelAdult: "Adult",
    labelChild: "Child (4-12)",
    labelInfant: "Infant (0-3)",
    tickets: "Ticket Prices",
    highlights: [
      { emoji: "🎡", title: "Big Ferris Wheel", desc: "Enjoyable flight with city panorama" },
      { emoji: "🎢", title: "Mini Roller Coaster", desc: "Exciting ride for children" },
      { emoji: "🎠", title: "Classic Carousel", desc: "Classic themed horse carousel" },
      { emoji: "🏰", title: "Magic Castle", desc: "Maze, hidden passages, treasure" },
      { emoji: "🎯", title: "Game Arenas", desc: "10+ interactive game stations" },
      { emoji: "🍭", title: "Candy Street", desc: "Cotton candy, ice cream, snacks" },
    ],
    tabs: [
      {
        label: "Children",
        items: [
          { name: "Shooting Game", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&q=80", desc: "Hit targets, win prizes" },
          { name: "Mini Railroad", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=600&q=80", desc: "Mini train ride around the park" },
          { name: "Puppet Theatre", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80", desc: "Daily shows for children" },
        ],
      },
      {
        label: "Youth",
        items: [
          { name: "VR Arena", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&q=80", desc: "Virtual reality games, ages 10+" },
          { name: "Laser Game", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80", desc: "Laser tag arena, team game" },
          { name: "Trampoline Park", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", desc: "Trampolines, acrobatics zone" },
        ],
      },
      {
        label: "Family",
        items: [
          { name: "Family Picnic", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&q=80", desc: "Special picnic areas, barbecue" },
          { name: "4D Cinema", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80", desc: "4D cinema with felt effects" },
          { name: "Photo Zone", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", desc: "Professional photo corners, memories" },
        ],
      },
    ],
  },
  ru: {
    tag: "WONDERLAND",
    title: "Волшебный Мир",
    subtitle: "Отдельный тематический парк для детей — бесконечные развлечения",
    children: "Дети",
    extreme: "Молодёжь",
    family: "Семья",
    hours: "10:00 – 21:00",
    season: "Открыт круглый год",
    priceAdult: "20 AZN",
    priceChild: "12 AZN",
    priceInfant: "Бесплатно",
    labelAdult: "Взрослый",
    labelChild: "Ребёнок (4-12)",
    labelInfant: "Малыш (0-3)",
    tickets: "Стоимость билетов",
    highlights: [
      { emoji: "🎡", title: "Большое колесо", desc: "Приятный полёт с видом на город" },
      { emoji: "🎢", title: "Мини американские горки", desc: "Захватывающая поездка для детей" },
      { emoji: "🎠", title: "Карусель", desc: "Классическая тематическая карусель" },
      { emoji: "🏰", title: "Волшебный замок", desc: "Лабиринт, тайные ходы, клад" },
      { emoji: "🎯", title: "Игровые арены", desc: "10+ интерактивных игровых станций" },
      { emoji: "🍭", title: "Улица сладостей", desc: "Сладкая вата, мороженое, снеки" },
    ],
    tabs: [
      {
        label: "Дети",
        items: [
          { name: "Стрелковая игра", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&q=80", desc: "Попади в цель, выиграй приз" },
          { name: "Мини железная дорога", img: "https://images.unsplash.com/photo-1544298998-35ee3b6bfb5b?w=600&q=80", desc: "Поездка на мини-поезде по парку" },
          { name: "Кукольный театр", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80", desc: "Ежедневные представления для детей" },
        ],
      },
      {
        label: "Молодёжь",
        items: [
          { name: "VR Арена", img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&q=80", desc: "Игры в виртуальной реальности, 10+" },
          { name: "Лазертаг", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80", desc: "Лазертаг арена, командная игра" },
          { name: "Батутный парк", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", desc: "Батуты, зона акробатики" },
        ],
      },
      {
        label: "Семья",
        items: [
          { name: "Семейный пикник", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&q=80", desc: "Специальные пикник-зоны, барбекю" },
          { name: "4D Кинотеатр", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80", desc: "4D кино с эффектами погружения" },
          { name: "Фотозона", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", desc: "Профессиональные фото-уголки" },
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

  const active = c.tabs[activeTab];

  return (
    <section id="wonderland" className="py-32 bg-[#f9f8f4] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-16">
        {/* Header */}
        <div className="text-center">
          <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">
            {c.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif mb-4">
            {c.title}
          </h2>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">{c.subtitle}</p>
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {c.highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-stone-100 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{h.emoji}</span>
              <h4 className="text-xs font-bold text-[#1e325c]">{h.title}</h4>
              <p className="text-[10px] text-stone-400">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-2 mb-8 flex-wrap">
            {c.tabs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === i
                    ? "text-white shadow-md"
                    : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-100"
                }`}
                style={
                  activeTab === i ? { background: "var(--color-hotel-blue)" } : undefined
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {active?.items.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-[#1e325c] mb-1">{item.name}</h3>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: tickets + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tickets */}
          <div className="bg-white rounded-3xl p-8 space-y-4 border border-stone-100">
            <h3 className="font-bold text-xl text-[#1e325c] font-serif flex items-center gap-2">
              <Ticket className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />
              {c.tickets}
            </h3>
            {[
              { label: c.labelAdult, price: c.priceAdult },
              { label: c.labelChild, price: c.priceChild },
              { label: c.labelInfant, price: c.priceInfant },
            ].map((t) => (
              <div
                key={t.label}
                className="flex justify-between items-center bg-[#f9f8f4] p-4 rounded-2xl"
              >
                <span className="text-sm font-semibold text-stone-600">{t.label}</span>
                <span className="text-lg font-bold" style={{ color: "var(--color-hotel-blue)" }}>
                  {t.price}
                </span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 space-y-6">
            <h3 className="font-bold text-xl text-[#1e325c] font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />
              Wonderland
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Clock className="w-4 h-4 shrink-0" style={{ color: "#00b5d5" }} />
                <span>{c.hours}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Star className="w-4 h-4 shrink-0" style={{ color: "#00b5d5" }} />
                <span>{c.season}</span>
              </div>
            </div>
            <div
              className="rounded-2xl p-5 text-white"
              style={{
                background: "linear-gradient(135deg, var(--color-hotel-blue), #1e325c)",
              }}
            >
              <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-widest">
                AF Hotel Qonaqları
              </p>
              <p className="text-2xl font-bold mb-1">30% Endirim</p>
              <p className="text-xs opacity-70">Hotel qonaqlarına Wonderland-da xüsusi qiymət</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}