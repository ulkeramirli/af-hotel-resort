"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Users, Maximize2, Check, Loader2 } from "lucide-react";
import { getPublicRoomById } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: { back: "Geri", book: "İndi Bron Et", includes: "Daxildir", perNight: "/ gecə", notFound: "Otaq tapılmadı" },
  en: { back: "Back", book: "Book Now", includes: "Includes", perNight: "/ night", notFound: "Room not found" },
  ru: { back: "Назад", book: "Забронировать", includes: "Включено", perNight: "/ ночь", notFound: "Номер не найден" },
};

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const router = useRouter();

  const [room, setRoom] = useState<PublicRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPublicRoomById(id)
      .then((data) => {
        if (!cancelled) {
          setRoom(data);
          if (data) setFav(isFavorite(data.id));
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleFav = () => {
    if (!room) return;
    const next = toggleFavorite(room.id);
    setFav(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-stone-400">
        <p className="text-lg font-semibold">{c.notFound}</p>
        <Link href="/#rooms" className="text-sm underline" style={{ color: "#00b5d5" }}>
          {c.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-hotel-light)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 space-y-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-[#1e325c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {c.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative h-80 rounded-3xl overflow-hidden">
              <Image
                src={room.images[activeImg] ?? room.images[0]}
                alt={room.title[l]}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <button
                onClick={handleFav}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart
                  className="w-5 h-5"
                  style={{
                    fill: fav ? "#e11d48" : "none",
                    color: fav ? "#e11d48" : "#9ca3af",
                  }}
                />
              </button>
            </div>
            {/* Thumbnails */}
            {room.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                      activeImg === i ? "border-[#00b5d5]" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${room.title[l]} ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-[#00b5d5] text-[10px] font-bold tracking-widest uppercase block mb-2">
                {room.category}
              </span>
              <h1 className="text-3xl font-bold text-[#1e325c] font-serif">{room.title[l]}</h1>
            </div>

            <div className="flex items-center gap-6 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {room.capacity[l]}
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4" />
                {room.size}
              </span>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">{room.desc[l]}</p>

            {/* Includes */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                {c.includes}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {room.includes[l].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-stone-600">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#00b5d5" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Price + Book */}
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-[#1e325c]">{room.price}</span>
                <span className="text-sm text-stone-400 ml-1">{c.perNight}</span>
              </div>
              <Link
                href={`/booking?room=${room.id}`}
                className="px-6 py-3 text-white text-sm font-bold rounded-xl transition-opacity hover:opacity-90"
                style={{ background: "var(--color-hotel-blue)" }}
              >
                {c.book}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
