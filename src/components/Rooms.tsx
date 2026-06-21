"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Maximize2, Loader2, BedDouble, ArrowRight } from "lucide-react";
import { getPublicRooms } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: {
    tag: "OTAQLAR & KOTECLƏR",
    title: "Rahatlığın Yeni Səviyyəsi",
    subtitle: "Hər zövqə uyğun lüks otaqlar",
    all: "Hamısı",
    single: "Single",
    double: "Standard Double",
    twin: "Standard Twin",
    apartment: "Apartments for 4",
    details: "Ətraflı bax",
    perNight: "/ gecə",
    empty: "Bu kateqoriyada otaq tapılmadı.",
  },
  en: {
    tag: "ROOMS & COTTAGES",
    title: "A New Level of Comfort",
    subtitle: "Luxury rooms for every taste",
    all: "All",
    single: "Single",
    double: "Standard Double",
    twin: "Standard Twin",
    apartment: "Apartments for 4",
    details: "View Details",
    perNight: "/ night",
    empty: "No rooms found in this category.",
  },
  ru: {
    tag: "НОМЕРА И КОТТЕДЖИ",
    title: "Новый Уровень Комфорта",
    subtitle: "Номера класса люкс на любой вкус",
    all: "Все",
    single: "Single",
    double: "Standard Double",
    twin: "Standard Twin",
    apartment: "Apartments for 4",
    details: "Подробнее",
    perNight: "/ ночь",
    empty: "В этой категории номеров нет.",
  },
};

type Category = "all" | "Single" | "Standard Double" | "Standard Twin" | "Apartments for 4";

export default function Rooms() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    getPublicRooms()
      .then((data) => { if (!cancelled) setRooms(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const buildFavSet = useCallback(
    (roomList: PublicRoom[]) =>
      new Set(roomList.map((r) => r.id).filter((id) => isFavorite(id))),
    []
  );

  useEffect(() => {
    if (rooms.length === 0) return;
    Promise.resolve().then(() => setFavorites(buildFavSet(rooms)));
  }, [rooms, buildFavSet]);

  useEffect(() => {
    const onUpdate = () => setFavorites(buildFavSet(rooms));
    window.addEventListener("favoritesUpdated", onUpdate);
    return () => window.removeEventListener("favoritesUpdated", onUpdate);
  }, [rooms, buildFavSet]);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered =
    category === "all"
      ? rooms
      : rooms.filter((r) => r.category === category);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: c.all },
    { key: "Single", label: c.single },
    { key: "Standard Double", label: c.double },
    { key: "Standard Twin", label: c.twin },
    { key: "Apartments for 4", label: c.apartment },
  ];

  return (
    <section id="rooms" className="py-24 md:py-32 scroll-mt-20 bg-white text-stone-800 antialiased selection:bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок с анимацией */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center space-y-2"
        >
          <span className="text-stone-400 text-[10px] font-bold tracking-[0.3em] uppercase block">
            {c.tag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            {c.title}
          </h2>
          <p className="text-xs text-stone-400 font-light max-w-md mx-auto">{c.subtitle}</p>
        </motion.div>

        {/* Скролл-кнопки фильтров (Адаптивные, скроллятся на мобилках) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-2 justify-start md:justify-center mb-12 overflow-x-auto pb-2 snap-x scrollbar-none -mx-4 px-4 md:mx-0 md:px-0"
        >
          {categories.map(({ key, label }) => {
            const isActive = category === key;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer snap-center shrink-0 border ${
                  isActive 
                    ? "bg-[#00b5d5] text-white border-gray-400 shadow-sm" 
                    : "text-stone-500 bg-stone-50 border-stone-200/50 hover:bg-stone-100"
                }`}
              >
                {label}
              </button>
            );  
          })}
        </motion.div>

        {/* Контентная сетка */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 text-stone-400 text-xs flex flex-col items-center gap-3"
          >
            <BedDouble className="w-8 h-8 text-stone-300" />
            {c.empty}
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((room) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  key={room.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Изображение комнаты */}
                  <div className="relative aspect-16/11 overflow-hidden bg-stone-100 border-b border-stone-100">
                    <Image
                      src={room.images[0]}
                      alt={room.title[l]}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-stone-800 rounded-md shadow-xs border border-stone-100">
                      {room.category}
                    </span>
                    <button
                      onClick={() => handleFavorite(room.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Heart
                        className="w-3.5 h-3.5 transition-colors"
                        style={{
                          fill: favorites.has(room.id) ? "#e11d48" : "none",
                          color: favorites.has(room.id) ? "#e11d48" : "#444",
                        }}
                      />
                    </button>
                  </div>

                  {/* Контент карточки */}
                  <div className="p-5 md:p-6 space-y-4 flex flex-col flex-1 justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-stone-900 text-base md:text-lg tracking-tight transition-colors group-hover:text-stone-700">
                        {room.title[l]}
                      </h3>
                      <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                        {room.desc[l]}
                      </p>

                      {/* Тонкие аккуратные параметры */}
                      <div className="flex items-center gap-4 text-[11px] font-medium text-stone-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-stone-300" />
                          {room.capacity[l]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-stone-300" />
                          {room.size || "350 sqft"}
                        </span>
                      </div>
                    </div>

                    {/* Нижняя часть с ценой и кнопкой */}
                    <div className="flex justify-between items-center pt-4 border-t border-stone-100 mt-auto">
                      <div>
                        <span className="text-lg md:text-xl font-bold text-stone-900">
                          ${room.price}
                        </span>
                        <span className="text-[11px] text-stone-400 font-light ml-1">{c.perNight}</span>
                      </div>
                      
                      <Link
                        href={`/rooms/${room.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#00b5d5] hover:bg-[#03a8c1] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      >
                        <span>{c.details}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}