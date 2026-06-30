"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Waves, Clock, Users, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Compass, MapPin, Palmtree, Tv } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { getActivities, getActivityCategories, getActivitySettings, getTickets, getFaqs } from "@/services/api";
import type { Activity, ActivityCategory, ActivitySettings, Ticket, Faq } from "@/types/api";

const content = {
  az: {
    tag: "AQUA & BEACH RESORT",
    title: "Eksklüziv Su Dünyası",
    subtitle: "Xəzər sahilində bölgənin ən böyük əyləncə, hovuz və özəl çimərlik kompleksi",
    openHours: "10:00 – 20:00",
    season: "Yay mövsümü: May – Oktyabr",
    tickets: "Bilet qiymətləri",
    faq: "Tez-tez verilən suallar",
    adult: "Yetkin",
    child: "Uşaq (5-12 yaş)",
    infant: "Körpə (0-4 yaş)",
    adultPrice: "25 AZN",
    childPrice: "15 AZN",
    infantPrice: "Pulsuz",
    orderTicket: "Bilet Sifariş Et",
    soonTag: "Tezliklə",
    zones: [
      {
        id: "aquapark",
        name: "Akvapark",
        desc: "Ekstremal sürüşmələr və uşaq su dünyası",
        icon: Waves,
        items: [
          { name: "Kamikaze Sürüşməsi", icon: "⚡", desc: "80 km/s-ə çatan sürüşmə, adrenalin sevənlər üçün (14+ yaş)", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Tornado", icon: "🌀", desc: "Dövrəvi sürüşmə tüneli, 4 nəfər eyni anda eniş", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Uşaq Su Meydançası", icon: "🎠", desc: "Fıskiyələr, rəngli mini sürüşmələr və təhlükəsiz su oyunları", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ]
      },
      {
        id: "pools",
        name: "Hovuzlar",
        desc: "Sakit istirahət və üzgüçülük zonaları",
        icon: Compass,
        items: [
          { name: "Olimpik Hovuz", icon: "🏊", desc: "Professional və həvəskar üzgüçülük üçün 25 metrlik böyük hovuz", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Dalğa Hovuzu", icon: "🏄", desc: "Okean atmosferini hiss etdirən 2 metrlik süni dalğalar", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "Jacuzzi & Relaks", icon: "♨️", desc: "Bədəni rahatladan hidromasajlı fərdi jakuzilər", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
        ]
      },
      {
        id: "beach",
        name: "Özəl Çimərlik",
        desc: "Qızılı qum və dəniz kənarında lüks",
        icon: Palmtree,
        items: [
          { name: "Premium Sahil Zonası", icon: "🏖️", desc: "Rahat şezlonqlar, VIP növ çadırlar və təmiz dəniz sahili", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "Beach Bar & Lounge", icon: "🍹", desc: "Sərinləşdirici kokteyllər, tropik içkilər və canlı musiqi", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Su İdman Əyləncələri", icon: "🛥️", desc: "Jet-ski, skuter və dəniz kənarında aktiv əyləncə növləri", img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80" },
        ]
      },
      {
        id: "cinema",
        name: "Açıq Səma Altında Kino",
        desc: "Dəniz kənarında proyektorla film gecələri",
        icon: Tv,
        isSoon: true,
        items: [
          { name: "Dəniz Kənarında Proyektor", icon: "🎬", desc: "Dalğaların sədasa altında, böyük ekranda dünya şedevrlərinin nümayişi", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80" },
          { name: "Pled və Puf Oturacaqlar", icon: "🍿", desc: "Ulduzlar altında maksimum rahatlıq, popcorn və isti içkilər", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" },
        ]
      }
    ],
    faqs: [
      { q: "Biletləri onlayn almaq mütləqdir?", a: "Xeyr, həm kassadan yerində, həm də saytdan onlayn növbəsiz sifariş edə bilərsiniz." },
      { q: "Qiymətə çimərlik və hovuzlar daxildir?", a: "Bəli, vahid biletlə həm akvapark, həm bütün hovuzlar, həm də çimərlik zonasına giriş daxildir." },
      { q: "Kino nümayişləri ödənişli olacaq?", a: "Otel qonaqları və Aqua Park biletini əldə etmiş şəxslər üçün film gecələri tamamilə pulsuz təşkil olunacaqdır." },
      { q: "Çimərlikdə dəsmal verilir?", a: "Bəli, ərazidə locker, hamam paltarı və dəsmal icarəsi mövcuddur." },
    ],
  },
  en: {
    tag: "AQUA & BEACH RESORT",
    title: "Exclusive Water World",
    subtitle: "The region's largest entertainment, pool, and private beach complex on the Caspian coast",
    openHours: "10:00 – 20:00",
    season: "Summer season: May – October",
    tickets: "Ticket prices",
    faq: "FAQ",
    adult: "Adult",
    child: "Child (5-12 yo)",
    infant: "Infant (0-4 yo)",
    adultPrice: "25 AZN",
    childPrice: "15 AZN",
    infantPrice: "Free",
    orderTicket: "Book Tickets",
    soonTag: "Soon",
    zones: [
      {
        id: "aquapark",
        name: "Aqua Park",
        desc: "Extreme slides and kids water world",
        icon: Waves,
        items: [
          { name: "Kamikaze Slide", icon: "⚡", desc: "Adrenaline-pumping slide up to 80 km/h (Ages 14+)", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Tornado", icon: "🌀", desc: "Circular tunnel slide for 4 people simultaneously", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Kids Water Playground", icon: "🎠", desc: "Fountains, colorful mini slides, and safe water games", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ]
      },
      {
        id: "pools",
        name: "Swimming Pools",
        desc: "Relaxing stay and swimming areas",
        icon: Compass,
        items: [
          { name: "Olympic Pool", icon: "🏊", desc: "25-meter large pool for professional and amateur swimming", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Wave Pool", icon: "🏄", desc: "2-meter artificial waves creating an ocean atmosphere", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "Jacuzzi & Relax", icon: "♨️", desc: "Private hydro-massage jacuzzis for ultimate relaxation", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
        ]
      },
      {
        id: "beach",
        name: "Private Beach",
        desc: "Golden sand and seaside luxury",
        icon: Palmtree,
        items: [
          { name: "Premium Coast Zone", icon: "🏖️", desc: "Comfortable sunbeds, VIP bungalows, and a clean coast", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "Beach Bar & Lounge", icon: "🍹", desc: "Refreshing cocktails, tropical drinks, and live music", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Water Sports", icon: "🛥️", desc: "Jet-skiing, scooters, and active seaside entertainment", img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80" },
        ]
      },
      {
        id: "cinema",
        name: "Open-Air Cinema",
        desc: "Projector movie nights right by the sea",
        icon: Tv,
        isSoon: true,
        items: [
          { name: "Seaside Projector", icon: "🎬", desc: "Screening world masterpieces on a huge screen under the sound of waves", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80" },
          { name: "Blankets & Beanbags", icon: "🍿", desc: "Maximum comfort under the stars with popcorn and hot drinks", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" },
        ]
      }
    ],
    faqs: [
      { q: "Is online booking required?", a: "No, you can purchase tickets at the box office on-site or skip the lines by booking online." },
      { q: "Does the ticket include beach and pool access?", a: "Yes, a single ticket grants access to the water park, all pools, and the private beach area." },
      { q: "Will the movie nights require a separate ticket?", a: "Movie nights will be completely free for hotel residents and Aqua Park ticket holders." },
      { q: "Are towels provided at the beach?", a: "Yes, locker, swimwear, and towel rentals are available on-site." },
    ],
  },
  ru: {
    tag: "AQUA & BEACH RESORT",
    title: "Эксклюзивный Водный Мир",
    subtitle: "Крупнейший комплекс развлечений, бассейнов и частного пляжа на побережье Каспия",
    openHours: "10:00 – 20:00",
    season: "Летний сезон: Май – Октябрь",
    tickets: "Стоимость билетов",
    faq: "Часто задаваемые вопросы",
    adult: "Взрослый",
    child: "Ребёнок (5-12 лет)",
    infant: "Младенец (0-4)",
    adultPrice: "25 AZN",
    childPrice: "15 AZN",
    infantPrice: "Бесплатно",
    orderTicket: "Купить Билет",
    soonTag: "Скоро",
    zones: [
      {
        id: "aquapark",
        name: "Аквапарк",
        desc: "Экстремальные горки и детский водный городок",
        icon: Waves,
        items: [
          { name: "Горка Камикадзе", icon: "⚡", desc: "Захватывающий спуск на скорости до 80 км/ч (14+ лет)", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Торнадо", icon: "🌀", desc: "Круговой закрытый туннель для 4 человек одновременно", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Детская аква-площадка", icon: "🎠", desc: "Фонтаны, брызгалки, безопасные мини-горки и аттракционы", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ]
      },
      {
        id: "pools",
        name: "Бассейны",
        desc: "Зоны для спортивного плавания и релаксации",
        icon: Compass,
        items: [
          { name: "Олимпийский Бассейн", icon: "🏊", desc: "Большой 25-метровый бассейн для плавания и тренировок", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Бассейн с Волнами", icon: "🏄", desc: "2-метровые искусственные волны, создающие эффект бушующего океана", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "Джакузи и Релакс", icon: "♨️", desc: "Гидромассажные ванны для полного снятия стресса", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
        ]
      },
      {
        id: "beach",
        name: "Частный Пляж",
        desc: "Золотой песок и роскошный отдых у моря",
        icon: Palmtree,
        items: [
          { name: "Премиум Пляжная Зона", icon: "🏖️", desc: "Комфортные шезлонги, приватные VIP-шатры и чистый берег", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "Beach Bar & Lounge", icon: "🍹", desc: "Прохладительные коктейли, тропические миксы и живая музыка", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Водный спорт", icon: "🛥️", desc: "Прокат гидроциклов, катамаранов и активные развлечения", img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80" },
        ]
      },
      {
        id: "cinema",
        name: "Кино под звездами",
        desc: "Показы шедевров кино на проекторе прямо у моря",
        icon: Tv,
        isSoon: true,
        items: [
          { name: "Большой Проектор у Моря", icon: "🎬", desc: "Просмотр легендарных фильмов на огромном экране под шум прибоя", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80" },
          { name: "Пуфы и Тёплые Пледы", icon: "🍿", desc: "Атмосфера абсолютного уюта под звездным небом, попкорн и напитки", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" },
        ]
      }
    ],
    faqs: [
      { q: "Обязательно бронировать билеты онлайн?", a: "Нет, билеты можно приобрести как на кассе при входе, так и быстро оформить онлайн на сайте." },
      { q: "Пляж и бассейны входят в стоимость?", a: "Да, единый билет дает полный доступ к аквапарку, всем бассейнам и пляжной зоне." },
      { q: "Кинопоказы будут платными?", a: "Для постояльцев отеля и обладателей дневного билета в Аквапарк вечерние кинопоказы будут абсолютно бесплатными." },
      { q: "Выдаются ли полотенца на пляже?", a: "Да, на территории работает аренда шкафчиков, купальных костюмов и мягких полотенец." },
    ],
  },
};

export default function Aquapark() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [dbZones, setDbZones] = useState<any[]>([]);
  const [settings, setSettings] = useState<ActivitySettings | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Реф для программного скролла слайдера с фото
  const photoSliderRef = useRef<HTMLDivElement>(null);

  const loc = (v: any): string => {
    if (!v) return "";
    if (typeof v === 'object' && v !== null) {
      return v[l] || v['az'] || '';
    }
    if (typeof v === 'string') {
      if (v.trim().startsWith('{') && v.trim().endsWith('}')) {
        try {
          const parsed = JSON.parse(v);
          return parsed[l] || parsed['az'] || '';
        } catch (e) {
          return v;
        }
      }
      return v;
    }
    return String(v);
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return String(html)
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ");
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [acts, cats, sets, dbTickets, dbFaqs] = await Promise.all([
          getActivities(), 
          getActivityCategories(), 
          getActivitySettings(),
          getTickets(),
          getFaqs()
        ]);
        
        setSettings(sets);
        setTickets(dbTickets);
        setFaqs(dbFaqs);
        
        if (cats.length > 0) {
          const mappedZones = cats.map(cat => ({
            id: cat._id,
            name: cat.name,
            desc: cat.description, 
            emoji: cat.emoji || "",
            icon: Waves,
            items: acts
              .filter(a => (typeof a.category === 'object' ? (a.category as any)._id : a.category) === cat._id)
              .map(a => ({
                name: a.title,
                icon: "✨",
                desc: a.description,
                img: a.image || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
              })),
          }));
          setDbZones(mappedZones);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  const activeZones = dbZones.length > 0 ? dbZones : c.zones;
  const activeZone = activeZones[activeTab] || activeZones[0];

  const displayTag = loc(settings?.tag) || c.tag;
  const displayTitle = loc(settings?.title) || c.title;
  const displaySubtitle = loc(settings?.subtitle) || c.subtitle;

  const dynamicStats = [
    { icon: Waves, label: loc(settings?.stats?.[0]?.value) || "25+", sub1: loc(settings?.stats?.[0]?.label) || (l === "az" ? "Su Əyləncəsi" : l === "en" ? "Water Attractions" : "Водных объектов"), sub2: loc(settings?.stats?.[0]?.sub) },
    { icon: Users, label: loc(settings?.stats?.[1]?.value) || "2500+", sub1: loc(settings?.stats?.[1]?.label) || (l === "az" ? "Günlük Qonaq" : l === "en" ? "Daily Guests" : "Гостей в день"), sub2: loc(settings?.stats?.[1]?.sub) },
    { icon: Clock, label: loc(settings?.stats?.[2]?.value) || c.openHours, sub1: loc(settings?.stats?.[2]?.label) || c.season, sub2: loc(settings?.stats?.[2]?.sub) },
    { icon: Star, label: loc(settings?.stats?.[3]?.value) || "5.0", sub1: loc(settings?.stats?.[3]?.label) || (l === "az" ? "Lüks Premium Xidmət" : l === "en" ? "Luxury Premium Service" : "Люкс Премиум Сервис"), sub2: loc(settings?.stats?.[3]?.sub) },
  ];

  // Функции для управления слайдером по стрелкам
  const scrollSlider = (direction: "left" | "right") => {
    if (photoSliderRef.current) {
      const container = photoSliderRef.current;
      const scrollAmount = container.clientWidth * 0.85; // Прокрутка на 85% ширины видимой области
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="aquapark" className="py-12 md:py-32 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-10 md:space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <ScrollReveal type="revealClip" delay={0.1} className="space-y-3 text-left">
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block">
              {displayTag}
            </span>
            <h2 className="text-2xl md:text-5xl font-light text-[#1e325c] font-serif tracking-tight">
              {displayTitle}
            </h2>
            <div className="text-sm text-stone-400 max-w-xl leading-relaxed prose prose-sm prose-stone [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: displaySubtitle }} />
          </ScrollReveal>
        </div>

        {/* СТАТИСТИКА (ВЕРХНЯЯ ЧАСТЬ НА СКРИНШОТЕ) — Маленькие аккуратные блоки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {dynamicStats.map((s, i) => (
            <ScrollReveal key={i} type="zoomIn" delay={i * 0.12}
              className="bg-[#f9f8f4] border border-stone-100/50 rounded-xl md:rounded-2xl p-2.5 md:p-6 flex flex-col items-center text-center gap-1 hover:scale-[1.02] transition-transform"
            >
              <s.icon className="w-4 h-4 md:w-5 md:h-5 text-[#00b5d5]" />
              <span className="text-sm md:text-xl font-bold text-[#1e325c] line-clamp-1 truncate">{s.label}</span>
              <span className="text-[9px] md:text-[10px] text-stone-400 font-bold tracking-wide uppercase line-clamp-1 text-center w-full">{s.sub1}</span>
              {s.sub2 && <span className="text-[8px] md:text-[9px] text-stone-400 tracking-wide line-clamp-1 truncate">{s.sub2}</span>}
            </ScrollReveal>
          ))}
        </div>

        {/* ТАБЫ (lalala, cinema, hovuz...) — Сетка 2х2 переходящая в 4х1 на десктопе, как в оригинале, но адаптивная */}
        <ScrollReveal type="dropIn" delay={0.3} className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-stone-50 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-stone-100">
            {activeZones.map((zone, i) => {
              const IconComponent = zone.icon;
              const zoneName = loc(zone.name);
              const zoneDesc = loc(zone.desc);

              return (
                <button
                  key={zone.id || i}
                  onClick={() => setActiveTab(i)}
                  className={`relative p-2.5 md:p-4 rounded-lg md:rounded-xl flex flex-col items-center md:items-start text-center md:text-left gap-0.5 transition-all cursor-pointer ${
                    activeTab === i
                      ? "bg-white shadow-xs md:shadow-md border border-stone-100"
                      : "hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-1 md:gap-1.5 whitespace-nowrap">
                    {zone.emoji ? (
                      <span className="text-xs md:text-sm">{zone.emoji}</span>
                    ) : IconComponent ? (
                      <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${activeTab === i ? "text-[#00b5d5]" : "text-stone-400"}`} />
                    ) : null}

                    <span className={`text-[11px] md:text-xs font-bold tracking-tight ${activeTab === i ? "text-[#1e325c]" : "text-stone-500"}`}>
                      {zoneName}
                    </span>

                    {zone.isSoon && (
                      <span className="text-[6px] md:text-[8px] bg-amber-500 text-white font-extrabold px-1 py-0.5 rounded-sm uppercase tracking-wider">
                        {c.soonTag || "Soon"}
                      </span>
                    )}
                  </div>

                  {zoneDesc && (
                    <span className="text-[9px] md:text-[10px] text-stone-400 font-medium line-clamp-1 w-full text-center md:text-left">
                      {stripHtml(zoneDesc)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* НИЖНИЕ КАРТОЧКИ С ФОТОГРАФИЯМИ */}
        <div className="space-y-4">
          
          {/* Мобильная версия: Слайдер строго по стрелкам */}
          <div className="block md:hidden relative">
            
            {/* Сама лента слайдера */}
            <div 
              ref={photoSliderRef}
              className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
            >
              {activeZone?.items.map((item: any, i: number) => {
                const itemName = loc(item.name);
                const itemDesc = loc(item.desc);
                const activeZoneName = loc(activeZone.name);

                return (
                  <div
                    key={i}
                    className="snap-center shrink-0 w-[85vw] bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-xs flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <Image src={item.img} alt={itemName} fill sizes="85vw" className="object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-[#1e325c]/80 via-[#1e325c]/10 to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold text-[#1e325c] flex items-center gap-1">
                        <span>{item.icon}</span>
                        <span>{itemName}</span>
                      </div>
                    </div>
                    <div className="p-4 grow flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-[#1e325c] text-sm leading-snug">{itemName}</h4>
                        <div className="text-[11px] text-stone-500 leading-relaxed line-clamp-3 prose prose-stone" dangerouslySetInnerHTML={{ __html: itemDesc }} />
                      </div>
                      <div className="pt-2.5 border-t border-stone-50 flex items-center gap-1 text-stone-400">
                        <MapPin className="w-3 h-3 text-[#00b5d5]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{activeZoneName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Блок навигации со стрелками (Вынесен вниз по центру, чтобы не перекрывать фото) */}
            {activeZone?.items.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-3">
                <button 
                  onClick={() => scrollSlider("left")}
                  className="w-9 h-9 rounded-full bg-stone-100 active:bg-stone-200 border border-stone-200/50 flex items-center justify-center text-[#1e325c] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollSlider("right")}
                  className="w-9 h-9 rounded-full bg-stone-100 active:bg-stone-200 border border-stone-200/50 flex items-center justify-center text-[#1e325c] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Десктопная версия: Премиальная Grid-сетка */}
          <div className="hidden md:block">
            <motion.div layout className="grid grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {activeZone?.items.map((item: any, i: number) => {
                  const itemName = loc(item.name);
                  const itemDesc = loc(item.desc);
                  const activeZoneName = loc(activeZone.name);

                  return (
                    <motion.div
                      key={itemName || i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group rounded-3xl overflow-hidden border border-stone-100 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-56 overflow-hidden bg-stone-100">
                        <Image src={item.img} alt={itemName} fill sizes="400px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-linear-to-t from-[#1e325c]/80 via-[#1e325c]/10 to-transparent opacity-90" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-[#1e325c] shadow-xs flex items-center gap-1">
                          <span>{item.icon}</span>
                          <span>{itemName}</span>
                        </div>
                      </div>
                      <div className="p-5 grow flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="font-bold text-[#1e325c] text-base leading-snug">{itemName}</h4>
                          <div className="text-xs text-stone-500 leading-relaxed line-clamp-3 prose prose-stone [&>p]:mb-1" dangerouslySetInnerHTML={{ __html: itemDesc }} />
                        </div>
                        <div className="pt-3 border-t border-stone-50 flex items-center gap-1 text-stone-400">
                          <MapPin className="w-3 h-3 text-[#00b5d5]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{activeZoneName}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

        {/* Tickets + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pt-4">
          {/* Tickets */}
          <div className="bg-[#f9f8f4] rounded-3xl p-6 md:p-8 space-y-5 flex flex-col justify-between border border-stone-100">
            <div className="space-y-4">
              <h3 className="font-bold text-lg md:text-xl text-[#1e325c] font-serif flex items-center gap-2">
                🎟️ {c.tickets}
              </h3>
              {tickets.length > 0 ? tickets.map((t) => (
                <div key={t._id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100">
                  <span className="text-sm font-semibold text-stone-600">{loc(t.name)}</span>
                  <span className="text-lg font-bold" style={{ color: "var(--color-hotel-blue)" }}>
                    {t.price} ₼
                  </span>
                </div>
              )) : [
                { label: c.adult, price: c.adultPrice },
                { label: c.child, price: c.childPrice },
                { label: c.infant, price: c.infantPrice },
              ].map((t) => (
                <div key={t.label} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100">
                  <span className="text-sm font-semibold text-stone-600">{t.label}</span>
                  <span className="text-lg font-bold" style={{ color: "var(--color-hotel-blue)" }}>
                    {t.price}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="tel:+994123456789"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.99] shadow-md shadow-[#00406a]/10"
              style={{ background: "var(--color-hotel-blue)" }}
            >
              {c.orderTicket}
            </a>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg md:text-xl text-[#1e325c] font-serif pl-1">{c.faq}</h3>
            {(faqs.length > 0 ? faqs : c.faqs).map((faq: any, i) => {
              const faqQuestion = loc(faq.question) || faq.q;
              const faqAnswer = loc(faq.answer) || faq.a;

              return (
                <div key={i} className="bg-[#f9f8f4] rounded-2xl border border-stone-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center p-4 text-left cursor-pointer"
                  >
                    <span className="text-xs md:text-sm font-bold text-[#1e325c] pr-4">{faqQuestion}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 bg-white/50">
                      <div className="text-xs text-stone-500 leading-relaxed font-medium prose prose-stone max-w-none [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: faqAnswer }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}