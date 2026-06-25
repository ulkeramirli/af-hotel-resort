"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Users,
  Maximize2,
  Check,
  Loader2,
  Star,
  Share2,
  Bed,
  Bath,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import { getPublicRoomById } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: {
    back: "Geri",
    book: "İndi Rezerv Et",
    overview: "Ümumi Baxış",
    amenities: "Otaq Üstünlükləri",
    rules: "Bron Qaydaları",
    location: "Ünvan",
    share: "Paylaş",
    reviews: "Rəy",
    luxuryBadge: "Lüks Otaqlar",
    notFound: "Tapılmadı",
    bed: "Yataq",
    bath: "Hamam",
    guests: "Qonaq",
    pricePerNight: "Bir gecəlik qiymət",
    night: "gecə",
    checkIn: "Giriş (Check In)",
    checkOut: "Çıxış (Check Out)",
    checkInTime: "Standart giriş vaxtı: 14:00-dan etibarən",
    checkInId: "Qeydiyyat masasında şəxsiyyəti təsdiq edən sənəd tələb olunur",
    checkOutLate: "Gec çıxış seçimləri mövcuddur",
    checkOutTime: "Otaq açarlarının saat 12:00-a qədər təhvil verilməsi",
  },
  en: {
    back: "Back",
    book: "Book Now",
    overview: "Overview",
    amenities: "Room Amenities",
    rules: "Booking Rules",
    location: "Location",
    share: "Share",
    reviews: "Reviews",
    luxuryBadge: "Luxury Rooms",
    notFound: "Not found",
    bed: "Bed",
    bath: "Bath",
    guests: "Guests",
    pricePerNight: "Price per night",
    night: "night",
    checkIn: "Check In",
    checkOut: "Check Out",
    checkInTime: "Standard check-in time from 14:00",
    checkInId: "Identity card required at counter",
    checkOutLate: "Late check-out options available",
    checkOutTime: "Room keys return by 12:00 PM",
  },
  ru: {
    back: "Назад",
    book: "Забронировать номер",
    overview: "Обзор номера",
    amenities: "Удобства в номере",
    rules: "Правила проживания",
    location: "Локация",
    share: "Поделиться",
    reviews: "Отзывов",
    luxuryBadge: "Люкс Номера",
    notFound: "Не найдено",
    bed: "Кровать",
    bath: "Ванная",
    guests: "Гостей",
    pricePerNight: "Цена за ночь",
    night: "ночь",
    checkIn: "Заезд (Check In)",
    checkOut: "Выезд (Check Out)",
    checkInTime: "Стандартное время заезда с 14:00",
    checkInId: "На стойке регистрации требуется удостоверение личности",
    checkOutLate: "Доступны варианты позднего выезда",
    checkOutTime: "Сдача ключей от номера до 12:00",
  },
};

type LanguageKey = keyof typeof content;

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language } = useLanguage();
  
  // Bezopasnaya proverka, chtoby yazyk podkhodil pod nashi klyuchi (az, en, ru)
  const l: LanguageKey = (language && language in content) ? (language as LanguageKey) : "az";
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
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleFav = () => {
    if (!room) return;
    setFav(toggleFavorite(room.id));
  };

  const handleBookingRedirect = () => {
    if (!room) return;
    const query = new URLSearchParams({
      roomId: room.id,
    });
    router.push(`/?${query.toString()}#booking`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-stone-400 bg-white">
        <p className="text-sm font-semibold text-stone-500">{c.notFound}</p>
        <button
          onClick={() => router.push("/#rooms")}
          className="text-xs underline text-stone-600 cursor-pointer"
        >
          {c.back}
        </button>
      </div>
    );
  }

  // Poluchaem lokalizovannye dannye iz samogo ob"yekta room s fallback na angliyskiy ili azerebaydzhanskiy
  const roomTitle = room.title[l] || room.title["az"] || room.title["en"] || "";
  const roomDesc = room.desc[l] || room.desc["az"] || room.desc["en"] || "";
  const roomCapacity = room.capacity[l] || room.capacity["az"] || room.capacity["en"] || `2 ${c.guests}`;
  const roomIncludes = room.includes[l] || room.includes["az"] || room.includes["en"] || [];

  return (
    <div className="min-h-screen bg-stone-50/40 text-stone-800 antialiased font-sans selection:bg-stone-100 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Кнопка Назад */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {c.back}
        </motion.button>

        {/* СЕТКА ГАЛЕРЕИ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Вертикальный стек миниатюр */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex flex-col gap-3 col-span-1 max-h-105 overflow-y-auto pr-1"
          >
            {room.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImg === i
                    ? "border-stone-800 scale-[0.98]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img || "/AF-aqua.jpg"}
                  alt=""
                  fill
                  sizes="250px"
                  className="object-cover"
                />
              </button>
            ))}
          </motion.div>

          {/* Главное изображение */}
          <motion.div
            layoutId="main-room-image"
            className="col-span-1 md:col-span-3 relative aspect-16/10 md:h-105 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/30 shadow-sm"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative"
              >
                <Image
                  src={room.images[activeImg] || room.images[0] || "/AF-aqua.jpg"}
                  alt={roomTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Избранное */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFav(); }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <Heart
                className="w-4.5 h-4.5 transition-colors"
                style={{
                  fill: fav ? "#e11d48" : "none",
                  color: fav ? "#e11d48" : "#444",
                }}
              />
            </button>
          </motion.div>
        </div>

        {/* Линейка миниатюр снизу для мобильных устройств */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-1 snap-x">
          {room.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 snap-center border-2 ${
                activeImg === i ? "border-stone-800" : "border-transparent"
              }`}
            >
              <Image
                src={img || "/AF-aqua.jpg"}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* КОНТЕНТНАЯ ЧАСТЬ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto space-y-8 pt-2"
        >
          {/* Главная информационная карточка */}
          <div className="border border-stone-200/60 rounded-2xl p-6 md:p-8 bg-white space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-3xl font-bold text-stone-900 tracking-tight">
                    {roomTitle}
                  </h1>
                  <span className="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    {c.luxuryBadge}
                  </span>
                </div>
                <p className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> AF Hotel & Aqua Park, Novkhani, Azerbaijan
                </p>
              </div>
              <div className="flex items-center gap-1 self-start sm:self-center bg-amber-50 border border-amber-100 rounded-xl px-3 py-1 text-xs font-bold text-amber-600 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9 (245 {c.reviews})</span>
              </div>
            </div>

            {/* Сетка Ключевых Параметров */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-stone-100 rounded-xl py-4 bg-stone-50/50 text-center text-xs font-medium text-stone-500">
              <div className="flex flex-col items-center gap-1 border-r border-stone-200/60">
                <Bed className="w-4 h-4 text-stone-400" />
                <span>{room.beds ?? 1} {c.bed}</span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:border-r border-stone-200/60">
                <Bath className="w-4 h-4 text-stone-400" />
                <span>{room.baths ?? 1} {c.bath}</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-r border-stone-200/60">
                <Maximize2 className="w-4 h-4 text-stone-400" />
                <span>{room.size || "350 sqft"}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Users className="w-4 h-4 text-stone-400" />
                <span>{roomCapacity}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                  {c.pricePerNight}
                </span>
                <div className="text-2xl md:text-3xl font-bold text-stone-900">
                  ${room.price}{" "}
                  <span className="text-xs text-stone-400 font-normal">
                    / {c.night}
                  </span>
                </div>
              </div>

              {/* КНОПКА ЗАБРОНИРОВАТЬ */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleBookingRedirect}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff6c02] hover:bg-[#e55f00] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                {c.book}
              </motion.button>
            </div>
          </div>

          {/* Описание (Overview) */}
          <div className="space-y-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {c.overview}
            </h3>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light text-justify">
              {roomDesc}
            </p>
          </div>

          {/* Удобства (Room Amenities) */}
          <div className="space-y-4 px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {c.amenities}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roomIncludes.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-stone-200/40 rounded-xl p-3 bg-white text-xs text-stone-600 font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Правила бронирования (Booking Rules) */}
          <div className="space-y-4 px-1 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {c.rules}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600 bg-white border border-stone-200/50 rounded-2xl p-6">
              <div className="space-y-2.5">
                <span className="font-bold text-stone-800 block uppercase tracking-wider text-[10px]">
                  {c.checkIn}
                </span>
                <div className="space-y-2">
                  {room.rulesCheckIn && (room.rulesCheckIn as any)[l] ? (
                    ((room.rulesCheckIn as any)[l] as string).split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {line.trim()}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {c.checkInTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {c.checkInId}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <span className="font-bold text-stone-800 block uppercase tracking-wider text-[10px]">
                  {c.checkOut}
                </span>
                <div className="space-y-2">
                  {room.rulesCheckOut && (room.rulesCheckOut as any)[l] ? (
                    ((room.rulesCheckOut as any)[l] as string).split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {line.trim()}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {c.checkOutLate}
                      </p>
                      <p className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-stone-300 shrink-0" /> {c.checkOutTime}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка Поделиться */}
          <div className="flex justify-center pt-4">
            <button className="inline-flex items-center gap-2 border border-stone-200 hover:bg-white bg-white/40 rounded-xl px-5 py-2.5 text-xs font-semibold text-stone-600 transition-all cursor-pointer">
              <Share2 className="w-4 h-4 text-stone-400" />
              <span>{c.share}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}