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

function RoomCarousel({ images, alt, priority = false }: { images: string[]; alt: string; priority?: boolean }) {
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
      <Image src={src} alt={alt} fill priority={priority && active === 0} sizes="(max-width: 768px) 100vw, 33vw" onError={() => setErr(true)} className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
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

export const content = {
  az: {
    tag: "OTAQLAR VƏ KOTECLƏR",
    title: "Sizin Rahatlığınız Üçün",
    subtitle: "Mükəmməl istirahətiniz üçün ən uyğun otağı seçin. Hər bir otaq fərqli dizayn və müasir avadanlıqlarla təchiz olunub.",
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
    title: "For Your Comfort",
    subtitle: "Choose the perfect room for your perfect vacation. Each room is equipped with modern amenities.",
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
    title: "Для Вашего Комфорта",
    subtitle: "Выберите идеальный номер для вашего идеального отдыха. Каждый номер оснащен современными удобствами.",
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
export function RoomCard({
  room,
  l,
  c,
  isFav,
  onFavorite,
  onBook,
  onDetails,
  compact = false,
  currency,
  priority = false,
}: {
  room: PublicRoom;
  l: "az" | "en" | "ru";
  c: typeof content["az"];
  isFav: boolean;
  onFavorite: (id: string) => void;
  onBook: (id: string) => void;
  onDetails: (id: string) => void;
  compact?: boolean;
  currency: "AZN" | "USD" | "EUR";
  priority?: boolean;
}) {
  return (
    <div className="h-full">
      <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-stone-100">
        <RoomCarousel images={room.images} alt={(room.title as any)?.[l] || ""} priority={priority} />
        {/* Fav button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(room.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ fill: isFav ? "#e11d48" : "none", color: isFav ? "#e11d48" : "#999" }}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-stone-800 text-xl group-hover:text-stone-600 transition-colors">
            {(room.title as any)?.[l] || (room.title as any)?.az || ""}
          </h3>
          <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
            {String((room.desc as any)?.[l] || (room.desc as any)?.az || "").replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
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
              <span className="text-lg font-bold text-stone-800">
                {currency === "USD" ? `$${room.priceUsd || 0}` : currency === "EUR" ? `€${room.priceEur || 0}` : `${room.price} ₼`}
              </span>
              <span className="text-[11px] text-stone-400 font-light ml-1">{c.perNight}</span>

            </div>
            <Link
              href={`/rooms/${room.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#00b5d5] hover:bg-[#06a1bc] text-white text-xs font-medium rounded-xl transition-colors shadow-sm relative z-10 cursor-pointer"
            >
              <span>{c.details}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBook(room.id);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-white text-xs font-medium rounded-xl shadow-sm transition-colors cursor-pointer relative z-10"
            style={{ background: "linear-gradient(135deg, #ff8c00, #ff5f00)" }}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{c.book as string}</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function Rooms() {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const router = useRouter();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];

  const loc = useCallback((field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[l] || field.az || "";
  }, [l]);

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
      '(min-width: 768px)': { active: false }, // disable on md and up
    }
  });

  const scrollRoomsPrev = useCallback(() => emblaRoomsApi && emblaRoomsApi.scrollPrev(), [emblaRoomsApi]);
  const scrollRoomsNext = useCallback(() => emblaRoomsApi && emblaRoomsApi.scrollNext(), [emblaRoomsApi]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const onSelectRooms = useCallback((api: any) => {
    setPrevBtnEnabled(api.canScrollPrev());
    setNextBtnEnabled(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaRoomsApi) return;
    onSelectRooms(emblaRoomsApi);
    emblaRoomsApi.on("reInit", onSelectRooms);
    emblaRoomsApi.on("select", onSelectRooms);
    return () => {
      emblaRoomsApi.off("reInit", onSelectRooms);
      emblaRoomsApi.off("select", onSelectRooms);
    };
  }, [emblaRoomsApi, onSelectRooms]);

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

  const handleFavorite = useCallback((id: string) => {
    // Optimistic update — flip state immediately for instant UI feedback
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    // Persist to localStorage and notify other listeners
    toggleFavorite(id);
  }, []);

  const filtered = category === "all" ? rooms : rooms.filter((r) => {
    if (r.category === category) return true;
    if ((r.category as any)?._id === category) return true;
    if ((r.category as any)?.id === category) return true;
    
    // Fallback: If DB stored the name instead of the ID
    const selectedType = types.find(t => t._id === category);
    if (selectedType) {
      if (r.category === selectedType.name) return true;
      if (r.category === (selectedType.name as any)?.az) return true;
      if (r.category === (selectedType.name as any)?.en) return true;
      if (r.category === (selectedType.name as any)?.ru) return true;
      if (r.categoryName?.az && r.categoryName.az === (selectedType.name as any)?.az) return true;
    }
    return false;
  });

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
            transition={{ ease: 'easeOut', duration: 0.45 }}
            className="space-y-4 flex flex-col items-center max-w-3xl"
          >
            <div className="flex items-center gap-4 justify-center">
              <div className="w-8 h-px bg-[#00b5d5]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#00b5d5] leading-normal py-1">
                {loc(settings?.tag) || c.tag}
              </span>
              <div className="w-8 h-px bg-[#00b5d5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#1e325c] tracking-wide font-serif leading-normal py-1">
              <TextReveal key={loc(settings?.title) || 'default'} text={loc(settings?.title) || c.title} delay={0.1} center />
            </h2>
            <div className="text-sm font-medium text-stone-400 prose prose-sm prose-stone max-w-2xl mx-auto **:wrap-break-word whitespace-normal [&>p]:mb-0 py-1" dangerouslySetInnerHTML={{ __html: loc(settings?.subtitle) || c.subtitle }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: 'easeOut', duration: 0.45, delay: 0.15 }}
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
            <div className="relative w-full">
              {/* Mobile arrow buttons */}
              <button
                onClick={scrollRoomsPrev}
                disabled={!prevBtnEnabled}
                className={`md:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 ${
                  !prevBtnEnabled
                    ? "bg-white border border-stone-200 text-stone-300 cursor-not-allowed opacity-80"
                    : "bg-[#ff6c02] border border-[#ff6c02] text-white hover:bg-[#e55f00]"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRoomsNext}
                disabled={!nextBtnEnabled}
                className={`md:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 ${
                  !nextBtnEnabled
                    ? "bg-white border border-stone-200 text-stone-300 cursor-not-allowed opacity-80"
                    : "bg-[#ff6c02] border border-[#ff6c02] text-white hover:bg-[#e55f00]"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0" ref={emblaRef}>
                <motion.div
                  layout
                  className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 cursor-grab active:cursor-grabbing md:cursor-auto"
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((room, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ ease: "easeOut" as const, duration: 0.45 }}
                        key={room.id}
                        className="w-[80vw] sm:w-[320px] md:w-full shrink-0 h-full"
                      >
                        <RoomCard
                          room={room}
                          l={l}
                          c={c}
                          isFav={favorites.has(room.id)}
                          onFavorite={handleFavorite}
                          onBook={(id) => router.push(`/booking?roomId=${id}`)}
                          onDetails={(id) => router.push(`/rooms/${id}`)}
                          currency={currency}
                          priority={index < 3}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </>
         )}
      </div>
    </section>
  );
}