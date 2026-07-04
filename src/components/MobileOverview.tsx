"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BedDouble,
  Waves,
  FerrisWheel,
  UtensilsCrossed,
  Info,
  ArrowUpRight,
  Star,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

const sections = [
  {
    key: "rooms",
    href: "/rooms",
    icon: BedDouble,
    image: "/AF-hero.jpg",
    gradient: "from-[#1e325c]/80 via-[#1e325c]/60 to-[#0f1b35]/80",
    accent: "#c5a880",
    glow: "rgba(197,168,128,0.25)",
    labels: {
      az: { title: "Otaqlar & Koteclər", sub: "Lüks & rahat yaşayış" },
      en: { title: "Rooms & Cottages", sub: "Luxury & comfortable stay" },
      ru: { title: "Номера & Коттеджи", sub: "Роскошь и комфорт" },
    },
    badge: { az: "5★ Lüks", en: "5★ Luxury", ru: "5★ Люкс" },
    large: true,
  },
  {
    key: "aquapark",
    href: "/aquapark",
    icon: Waves,
    image: "/AF-aqua.jpg",
    gradient: "from-[#004e7c]/80 via-[#006fa5]/60 to-[#0097c4]/80",
    accent: "#5dd8f4",
    glow: "rgba(0,181,213,0.3)",
    labels: {
      az: { title: "Aqua Park", sub: "20+ sürüşkən & hovuz" },
      en: { title: "Aqua Park", sub: "20+ slides & pools" },
      ru: { title: "Аква-Парк", sub: "20+ горок и бассейнов" },
    },
    badge: { az: "Açıqdır", en: "Open", ru: "Открыто" },
    large: false,
  },
  {
    key: "wonderland",
    href: "/wonderland",
    icon: FerrisWheel,
    image: "/AF-aqua.jpg",
    gradient: "from-[#5b1a8b]/80 via-[#7c2e9e]/60 to-[#9b44c0]/80",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
    labels: {
      az: { title: "Wonderland", sub: "İl boyu açıq lunapark" },
      en: { title: "Wonderland", sub: "Year-round theme park" },
      ru: { title: "Вондерленд", sub: "Парк открыт круглый год" },
    },
    badge: { az: "İl boyu", en: "Year-round", ru: "Круглый год" },
    large: false,
  },
  {
    key: "restoran",
    href: "/restoran",
    icon: UtensilsCrossed,
    image: "/AF-hero.jpg",
    gradient: "from-[#5c2200]/80 via-[#7a3000]/60 to-[#9c4200]/80",
    accent: "#fb923c",
    glow: "rgba(249,115,22,0.25)",
    labels: {
      az: { title: "Restoran", sub: "Azərbaycan mətbəxi" },
      en: { title: "Restaurant", sub: "Azerbaijani cuisine" },
      ru: { title: "Ресторан", sub: "Азербайджанская кухня" },
    },
    badge: { az: "Açıqdır", en: "Open", ru: "Открыто" },
    large: false,
  },
  {
    key: "about",
    href: "/about",
    icon: Info,
    image: "/AF-aqua.jpg",
    gradient: "from-[#143314]/80 via-[#1a4d1a]/60 to-[#1f5c1f]/80",
    accent: "#4ade80",
    glow: "rgba(74,222,128,0.2)",
    labels: {
      az: { title: "Haqqımızda", sub: "AF Hotel kompleksi" },
      en: { title: "About Us", sub: "AF Hotel Complex" },
      ru: { title: "О Нас", sub: "Комплекс AF Hotel" },
    },
    badge: { az: "Kəşf Et", en: "Explore", ru: "Узнать" },
    large: false,
  },
];

const stats = [
  { icon: Star, value: "4.9", key: "rating", label: { az: "Reytinq", en: "Rating", ru: "Рейтинг" } },
  { icon: BedDouble, value: "50+", key: "rooms", label: { az: "Otaq", en: "Rooms", ru: "Номеров" } },
  { icon: Users, value: "500+", key: "guests", label: { az: "Qonaq", en: "Guests", ru: "Гостей" } },
  { icon: Clock, value: "24/7", key: "service", label: { az: "Servis", en: "Service", ru: "Сервис" } },
  { icon: MapPin, value: "Novxanı", key: "loc", label: { az: "Ünvan", en: "Location", ru: "Адрес" } },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: "spring" as const, bounce: 0.25, duration: 0.6, delay: i * 0.07 },
  }),
};

export default function MobileOverview() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";

  const heading = {
    az: { tag: "XOŞ GƏLMİŞSİNİZ", title: "AF Hotel & Aqua Park", sub: "Lüks, əyləncə və rahat istirahət — hamısı bir yerdə" },
    en: { tag: "WELCOME TO", title: "AF Hotel & Aqua Park", sub: "Luxury, fun and relaxation — all in one place" },
    ru: { tag: "ДОБРО ПОЖАЛОВАТЬ", title: "AF Hotel & Aqua Park", sub: "Роскошь, веселье и отдых — всё в одном месте" },
  }[l];

  return (
    <section className="block lg:hidden relative overflow-hidden bg-[#fcfbf7] pb-12 pt-8">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#00b5d5]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-[#c5a880]/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 space-y-1.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-[1.5px] bg-[#00b5d5]" />
            <p className="text-[9px] font-bold tracking-[0.3em] text-[#00b5d5] uppercase">{heading.tag}</p>
          </div>
          <h2 className="text-2xl font-bold text-[#1e325c] leading-tight tracking-tight">{heading.title}</h2>
          <p className="text-xs text-stone-400 font-light">{heading.sub}</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2.5 overflow-x-auto no-scrollbar mb-7 pb-0.5"
        >
          {stats.map((s) => (
            <div
              key={s.key}
              className="flex-none flex flex-col items-center gap-1 bg-white border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl px-3.5 py-3 min-w-[70px]"
            >
              <s.icon className="w-3.5 h-3.5 text-[#00b5d5]" />
              <span className="text-sm font-black text-[#1e325c]">{s.value}</span>
              <span className="text-[8px] font-semibold text-stone-400 uppercase tracking-wider text-center leading-tight">{s.label[l]}</span>
            </div>
          ))}
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            const label = sec.labels[l];
            const badgeText = sec.badge[l];
            return (
              <motion.div
                key={sec.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className={sec.large ? "col-span-2" : "col-span-1"}
              >
                <Link href={sec.href} className="block group relative overflow-hidden rounded-[22px]">
                  {/* Card background image */}
                  <Image
                    src={(sec as any).image}
                    alt={sec.labels[l].title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Color gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sec.gradient}`} />
                  {/* Extra dark bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Glow */}
                  <div
                    className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-70"
                    style={{ backgroundColor: sec.glow }}
                  />

                  {/* Content */}
                  <div className={`relative z-10 flex flex-col justify-between ${sec.large ? "p-5 min-h-[160px]" : "p-4 min-h-[130px]"}`}>
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${sec.accent}33`, border: `1px solid ${sec.accent}55` }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: sec.accent }} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/25 transition-all">
                        <ArrowUpRight className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${sec.large ? "text-[9px]" : "text-[8px]"}`}
                        style={{ backgroundColor: `${sec.accent}30`, color: sec.accent }}
                      >
                        {badgeText}
                      </span>
                      <h3 className={`font-bold text-white leading-tight [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] ${sec.large ? "text-lg" : "text-sm"}`}>
                        {label.title}
                      </h3>
                      <p className={`text-white/90 font-light leading-snug [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)] ${sec.large ? "text-xs" : "text-[11px]"}`}>
                        {label.sub}
                      </p>
                    </div>
                  </div>

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-white/0 group-active:bg-white/5 transition-all duration-200 rounded-[22px]" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
