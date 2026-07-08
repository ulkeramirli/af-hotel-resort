"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Maximize2, Loader2, BedDouble, ArrowRight, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPublicRooms, getRoomTypes, getRoomSettings } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import type { RoomType, RoomSettings } from "@/types/api";
import { toggleFavorite, isFavorite, syncFavorites } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import CategoryTabs from "./CategoryTabs";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";
import useEmblaCarousel from "embla-carousel-react";

function RoomCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [err, setErr] = useState(false);

  const src = images[active] || "";
  const isValid = !err && src && src.startsWith("http") && !src.match(/^https?:\/\/[^/]+\.(jpg|jpeg|png|webp|gif)$/i);

  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((p) => (p + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((p) => (p - 1 + images.length) % images.length); };

  if (!isValid || err) {
    return (
      <div className="w-full h-full bg-linear-to-br from-stone-100 to-stone-200 flex items-center justify-center">
        <BedDouble className="w-12 h-12 text-stone-300" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group/carousel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" onError={() => setErr(true)} className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
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
    book: "Rezervasiya",
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
    book: "Book",
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
    book: "Забронировать",
  },
};

type Category = string;

// Single room card component
function RoomCard({
  room,
  l,
  c,
  isFav,
  onFavorite,
  onBook,
  compact = false,
  currency,
}: {
  room: PublicRoom;
  l: "az" | "en" | "ru";
  c: typeof content["az"];
  isFav: boolean;
  onFavorite: (id: string) => void;
  onBook: (id: string) => void;
  compact?: boolean;
  currency: "AZN" | "USD" | "EUR";
}) {
  return (
    <TiltCard tiltAmount={4} className="h-full">
      <div className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full border border-stone-100/80">
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[16/10]">
        <RoomCarousel images={room.images} alt={(room.title as any)?.[l] || ""} />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#1e325c] rounded-xl shadow-sm border border-stone-100/60 z-20">
          {(room.categoryName as any)?.[l] || (room.categoryName as any)?.az || "Otaq"}
        </span>
        {/* Fav button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(room.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer z-20"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ fill: isFav ? "#e11d48" : "none", color: isFav ? "#e11d48" : "#999" }}
          />
        </button>
        {/* Number of photos badge */}
        {room.images.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white rounded-md z-20">
            {room.images.length} photos
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#1e325c] leading-snug tracking-tight font-serif">
            {(room.title as any)?.[l] || (room.title as any)?.az || ""}
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-medium text-stone-400">
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-stone-300" />{room.capacity[l]}</span>
            <span className="w-1 h-1 rounded-full bg-stone-200" />
            <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-stone-300" />{room.size || "350 sqft"}</span>
          </div>
        </div>


        {/* Bottom: price + buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-stone-900">
                {currency === "USD" ? `$${room.priceUsd || 0}` : currency === "EUR" ? `€${room.priceEur || 0}` : `${room.price} ₼`}
              </span>
              <span className="text-[11px] text-stone-400 font-light ml-1">{c.perNight}</span>

            </div>
            <span className="text-[10px] text-stone-400 font-light">{c.perNight}</span>
          </div>
          <div className="flex flex-col gap-2 w-32">
            <MagneticButton className="w-full block">
              <Link
                href={`/rooms/${room.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-[#00b5d5] hover:bg-[#00b5d5] hover:text-white text-[10px] sm:text-[11px] font-bold rounded-xl border-2 border-[#00b5d5] transition-all duration-300 cursor-pointer w-full"
              >
                <span>{c.details}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </MagneticButton>
            <MagneticButton className="w-full block">
              <button
                onClick={() => onBook(room.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[10px] sm:text-[11px] font-bold rounded-xl shadow-sm shadow-[#ff6c02]/30 transition-all duration-200 cursor-pointer active:scale-[0.97] w-full"
              >
                {c.book as string}
              </button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
    </TiltCard>
  );
}

export default function Rooms() {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const router = useRouter();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [types, setTypes] = useState<RoomType[]>([]);
  const [settings, setSettings] = useState<RoomSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [emblaRef, emblaRoomsApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    breakpoints: {
      '(min-width: 640px)': { active: false }, // disable on sm and up
    }
  });

  const scrollRoomsPrev = useCallback(() => emblaRoomsApi && emblaRoomsApi.scrollPrev(), [emblaRoomsApi]);
  const scrollRoomsNext = useCallback(() => emblaRoomsApi && emblaRoomsApi.scrollNext(), [emblaRoomsApi]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicRooms(),
      getRoomTypes(),
      getRoomSettings().catch(() => null)
    ])
      .then(([rData, tData, sData]) => { 
        if (!cancelled) {
          setRooms(rData);
          setTypes(tData);
          setSettings(sData);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const buildFavSet = useCallback(
    (roomList: PublicRoom[]) => new Set(roomList.map((r) => r.id).filter((id) => isFavorite(id))),
    []
  );

  useEffect(() => {
    if (rooms.length === 0) return;
    Promise.resolve().then(() => {
      syncFavorites(rooms.map(r => r.id));
      setFavorites(buildFavSet(rooms));
    });
  }, [rooms, buildFavSet]);

  useEffect(() => {
    const onUpdate = () => setFavorites(buildFavSet(rooms));
    window.addEventListener("favoritesUpdated", onUpdate);
    return () => window.removeEventListener("favoritesUpdated", onUpdate);
  }, [rooms, buildFavSet]);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const filtered = category === "all" ? rooms : rooms.filter((r) => r.category === category);

  const categories = [
    { id: "all", label: c.all },
    ...types.map(t => ({ 
      id: t._id, 
      label: (t.name as any)?.[l] || (t.name as any)?.az || t.name || "" 
    }))
  ];



  return (
    <section id="rooms" className="py-20 md:py-32 scroll-mt-20 bg-transparent text-stone-800 antialiased selection:bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Tabs Container */}
        <div className="flex flex-col items-center justify-center mb-16 gap-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            className="space-y-4 flex flex-col items-center max-w-3xl"
          >
            <div className="flex items-center gap-4 justify-center">
              <div className="w-8 h-[1px] bg-[#00b5d5]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00b5d5]">
                {settings?.tag || c.tag}
              </span>
              <div className="w-8 h-[1px] bg-[#00b5d5]" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#1e325c] tracking-tight font-serif leading-none">
              <TextReveal text={settings?.title || c.title} delay={0.1} />
            </h2>
            <div className="text-sm font-medium text-stone-400 prose prose-sm prose-stone max-w-2xl mx-auto break-words whitespace-normal [&>p]:mb-0" dangerouslySetInnerHTML={{ __html: settings?.subtitle || c.subtitle }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.15 }}
            className="flex justify-center w-full mt-2"
          >
            <CategoryTabs
              categories={categories}
              activeId={category}
              onSelect={setCategory}
              className="justify-center"
            />
          </motion.div>
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
            <div className="relative md:hidden">
              {/* Mobile arrow buttons */}
              <button
                onClick={scrollRoomsPrev}
                className="sm:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-md flex items-center justify-center text-[#1e325c] hover:bg-[#1e325c] hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRoomsNext}
                className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 w-10 h-10 bg-[#ff6c02] border border-[#ff6c02] rounded-full shadow-md flex items-center justify-center text-white hover:bg-[#e55f00] transition-all active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="overflow-hidden sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0" ref={emblaRef}>
                <motion.div
                  layout
                  className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 cursor-grab active:cursor-grabbing sm:cursor-auto"
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((room) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, type: "spring", stiffness: 120 }}
                        key={room.id}
                        className="min-w-[80vw] sm:min-w-0 flex-shrink-0 sm:flex-shrink h-full"
                      >
                        <RoomCard
                        room={room}
                        l={l}
                        c={c}
                        isFav={favorites.has(room.id)}
                        onFavorite={handleFavorite}
                        onBook={(id) => router.push(`/booking?roomId=${id}`)}
                        currency={currency}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
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
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                    key={room.id}
                  >
                    <RoomCard
                      room={room}
                      l={l}
                      c={c}
                      isFav={favorites.has(room.id)}
                      onFavorite={handleFavorite}
                      onBook={(id) => router.push(`/booking?roomId=${id}`)}
                      currency={currency}
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