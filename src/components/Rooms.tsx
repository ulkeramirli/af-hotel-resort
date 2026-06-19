"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Users, Maximize2, Loader2, BedDouble } from "lucide-react";
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
    standard: "Standart",
    deluxe: "Deluxe",
    cottage: "Kotec",
    details: "Ətraflı bax",
    perNight: "/ gecə",
    empty: "Bu kateqoriyada otaq tapılmadı.",
  },
  en: {
    tag: "ROOMS & COTTAGES",
    title: "A New Level of Comfort",
    subtitle: "Luxury rooms for every taste",
    all: "All",
    standard: "Standard",
    deluxe: "Deluxe",
    cottage: "Cottage",
    details: "View Details",
    perNight: "/ night",
    empty: "No rooms found in this category.",
  },
  ru: {
    tag: "НОМЕРА И КОТТЕДЖИ",
    title: "Новый Уровень Комфорта",
    subtitle: "Номера класса люкс на любой вкус",
    all: "Все",
    standard: "Стандарт",
    deluxe: "Делюкс",
    cottage: "Коттедж",
    details: "Подробнее",
    perNight: "/ ночь",
    empty: "В этой категории номеров нет.",
  },

};

type Category = "all" | "standard" | "deluxe" | "cottage";

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

  // ✅ Fix: don't call syncFavorites() synchronously in effect body
  // Instead, compute favorites inline after rooms load
  const buildFavSet = useCallback(
    (roomList: PublicRoom[]) =>
      new Set(roomList.map((r) => r.id).filter((id) => isFavorite(id))),
    []
  );

  useEffect(() => {
    if (rooms.length === 0) return;
    // initial sync — deferred so no sync setState in effect
    Promise.resolve().then(() => setFavorites(buildFavSet(rooms)));
  }, [rooms, buildFavSet]);

  useEffect(() => {
    const onUpdate = () => setFavorites(buildFavSet(rooms));
    window.addEventListener("favoritesUpdated", onUpdate);
    return () => window.removeEventListener("favoritesUpdated", onUpdate);
  }, [rooms, buildFavSet]);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    // optimistically update local state immediately
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ✅ Fix: removed unused 'type' variable — filter by category label directly
  const filtered =
    category === "all"
      ? rooms
      : rooms.filter((r) =>
          r.category.toLowerCase() === c[category].toLowerCase()
        );

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: c.all },
    { key: "standard", label: c.standard },
    { key: "deluxe", label: c.deluxe },
    { key: "cottage", label: c.cottage },
  ];

  return (
    <section id="rooms" className="py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">
            {c.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif mb-4">
            {c.title}
          </h2>
          <p className="text-sm text-stone-400">{c.subtitle}</p>
        </div>


        {/* Filter tabs */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                category === key
                  ? "text-white shadow-md"
                  : "text-stone-500 bg-stone-100 hover:bg-stone-200"
              }`}
              style={
                category === key
                  ? { background: "var(--color-hotel-blue)" }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--color-hotel-blue)" }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm flex flex-col items-center gap-3">
            <BedDouble className="w-10 h-10" />
            {c.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={room.images[0]}
                    alt={room.title[l]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* ✅ Fix: bg-linear-to-t instead of bg-gradient-to-t (Tailwind v4) */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  {/* Category badge */}
                  <span
                    className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: "rgba(0,70,147,0.85)" }}
                  >
                    {room.category}
                  </span>
                  {/* Favorite button */}
                  <button
                    onClick={() => handleFavorite(room.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart
                      className="w-4 h-4 transition-colors"
                      style={{
                        fill: favorites.has(room.id) ? "#e11d48" : "none",
                        color: favorites.has(room.id) ? "#e11d48" : "#9ca3af",
                      }}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-[#1e325c] text-base">{room.title[l]}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{room.desc[l]}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {room.capacity[l]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      {room.size}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1">
                    {room.includes[l].slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-stone-500"
                      >
                        {item}
                      </span>
                    ))}
                    {room.includes[l].length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 text-stone-400">
                        +{room.includes[l].length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-2 border-t border-stone-50">
                    <div>
                      <span
                        className="text-xl font-bold"
                        style={{ color: "var(--color-hotel-blue)" }}
                      >
                        {room.price}
                      </span>
                      <span className="text-xs text-stone-400 ml-1">{c.perNight}</span>
                    </div>
                    <Link
                      href={`/rooms/${room.id}`}
                      className="px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                      style={{ background: "var(--color-hotel-blue)" }}

                    >
                      {c.details}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}