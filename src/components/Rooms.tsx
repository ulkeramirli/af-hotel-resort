"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Maximize2, Loader2, BedDouble, ArrowRight, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPublicRooms } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";

function RoomCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [err, setErr] = useState(false);

  const src = images[active] || "";
  const isValid = !err && src && src.startsWith("http") && !src.match(/^https?:\/\/[^/]+\.(jpg|jpeg|png|webp|gif)$/i);

  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((p) => (p + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((p) => (p - 1 + images.length) % images.length); };

  if (!isValid || err) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
        <BedDouble className="w-12 h-12 text-stone-300" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group/carousel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onError={() => setErr(true)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 shadow-sm cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-stone-700" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 shadow-sm cursor-pointer">
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? "bg-white scale-125" : "bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

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
    swipeHint: "Sürüşdürün →",
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
    swipeHint: "Swipe →",
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
    swipeHint: "Листайте →",
  },
};

type Category = "all" | "Single" | "Standard Double" | "Standard Twin" | "Apartments for 4";

// Single room card component
function RoomCard({
  room,
  l,
  c,
  isFav,
  onFavorite,
  onBook,
  compact = false,
}: {
  room: PublicRoom;
  l: "az" | "en" | "ru";
  c: typeof content["az"];
  isFav: boolean;
  onFavorite: (id: string) => void;
  onBook: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${compact ? "" : ""}`}>
      {/* Image */}
      <div className={`relative overflow-hidden bg-stone-100 border-b border-stone-100 ${compact ? "aspect-[4/3]" : "aspect-[16/11]"}`}>
        <RoomCarousel images={room.images} alt={room.title[l]} />
        <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-stone-800 rounded-md shadow-sm border border-stone-100 z-10">
          {room.category}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onFavorite(room.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer z-20"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ fill: isFav ? "#e11d48" : "none", color: isFav ? "#e11d48" : "#444" }}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5">
          <h3 className="font-bold text-stone-900 text-base tracking-tight transition-colors group-hover:text-stone-700 line-clamp-1">
            {room.title[l]}
          </h3>
          <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
            {room.desc[l]}
          </p>
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

        {/* Bottom: price + buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-stone-900">${room.price}</span>
              <span className="text-[11px] text-stone-400 font-light ml-1">{c.perNight}</span>
            </div>
            <Link
              href={`/rooms/${room.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#00b5d5] hover:bg-[#06a1bc] text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <span>{c.details}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <button
            onClick={() => onBook(room.id)}
            className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#ff6c02] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{l === "az" ? "İndi Rezerv Et" : l === "ru" ? "Забронировать" : "Book Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Rooms() {
  const { language } = useLanguage();
  const router = useRouter();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const sliderRef = useRef<HTMLDivElement>(null);

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
    (roomList: PublicRoom[]) => new Set(roomList.map((r) => r.id).filter((id) => isFavorite(id))),
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
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = category === "all" ? rooms : rooms.filter((r) => r.category === category);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: c.all },
    { key: "Single", label: c.single },
    { key: "Standard Double", label: c.double },
    { key: "Standard Twin", label: c.twin },
    { key: "Apartments for 4", label: c.apartment },
  ];

  const scrollSlider = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.78 + 16;
    sliderRef.current.scrollBy({ left: dir === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  return (
    <section id="rooms" className="py-20 md:py-32 scroll-mt-20 bg-white text-stone-800 antialiased selection:bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 text-center space-y-2"
        >
          <span className="text-stone-400 text-[10px] font-bold tracking-[0.3em] uppercase block">{c.tag}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">{c.title}</h2>
          <p className="text-xs text-stone-400 font-light max-w-md mx-auto">{c.subtitle}</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                category === key ? "text-white shadow-md" : "text-stone-500 bg-stone-100 hover:bg-stone-200"
              }`}
              style={category === key ? { background: "var(--color-hotel-blue, #00b5d5)" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
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
          <>
            {/* ── MOBILE: horizontal slider ── */}
            <div className="md:hidden relative">
              {/* Scroll arrows */}
              <button
                onClick={() => scrollSlider("left")}
                className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center border border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-stone-600" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center border border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </button>

              {/* Slider track */}
              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-1 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((room) => (
                    <motion.div
                      layout
                      key={room.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="snap-start shrink-0 w-[78vw] max-w-[320px]"
                    >
                      <RoomCard
                        room={room}
                        l={l}
                        c={c}
                        isFav={favorites.has(room.id)}
                        onFavorite={handleFavorite}
                        onBook={(id) => router.push(`/?roomId=${id}#booking`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Swipe hint dots */}
              <div className="flex justify-center gap-1.5 mt-2">
                {filtered.slice(0, Math.min(filtered.length, 8)).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                ))}
                {filtered.length > 8 && <span className="text-[10px] text-stone-400 ml-1">+{filtered.length - 8}</span>}
              </div>
            </div>

            {/* ── DESKTOP: grid ── */}
            <motion.div
              layout
              className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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
                  >
                    <RoomCard
                      room={room}
                      l={l}
                      c={c}
                      isFav={favorites.has(room.id)}
                      onFavorite={handleFavorite}
                      onBook={(id) => router.push(`/?roomId=${id}#booking`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
         )}
      </div>
    </section>
  );
}