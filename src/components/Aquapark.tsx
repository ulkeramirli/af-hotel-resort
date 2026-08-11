"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Waves, Clock, Users, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Compass, MapPin, Palmtree, Tv, Clapperboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence, useInView } from "framer-motion";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import DynamicIcon from "./DynamicIcon";
import TextReveal from "./TextReveal";
import { getActivities, getActivityCategories, getActivitySettings, getTickets, getFaqs } from "@/services/api";
import type { Activity, ActivityCategory, ActivitySettings, Ticket, Faq } from "@/types/api";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
  })
};

const CardImageSlider = ({ images, itemName, priority = false }: { images: string[], itemName: string, priority?: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 } }}
          className="absolute inset-0"
        >
          <Image src={images[currentIndex]} alt={itemName} fill priority={priority && currentIndex === 0} sizes="(max-width: 768px) 85vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
        </motion.div>
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button 
            onClick={prev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-30 shadow-sm cursor-pointer transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-30 shadow-sm cursor-pointer transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>
        </>
      )}
    </div>
  );
};

const content = {
  az: {
    tag: "",
    title: "",
    subtitle: "",
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
          { name: "Böyüklər üçün aquapark lı hovuz", icon: "⚡", desc: "Əyləncəli sürüşmələr və böyük hovuz", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Uşaqlar üçün hovuz", icon: "🎠", desc: "Balacalar üçün təhlükəsiz su oyunları", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
          { name: "VIP hovuz", icon: "💎", desc: "Sakitlik və rahatlıq axtaranlar üçün xüsusi hovuz", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Böyüklər üçün bir digər hovuz", icon: "🏊", desc: "Professional üzgüçülük və istirahət üçün", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "Af Beach böyüklər üçün hovuz", icon: "🏖️", desc: "Dəniz mənzərəli böyüklər hovuzu", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "Af Beach uşaqlar üçün hovuz", icon: "🌊", desc: "Çimərlik zonasında uşaqlar üçün təhlükəsiz hovuz", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
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
        desc: "Qızılı qum və dəniz kənarında rahatlıq",
        icon: Palmtree,
        items: [
          { name: "Sahil Zonası", icon: "🏖️", desc: "Rahat şezlonqlar, VIP növ çadırlar və təmiz dəniz sahili", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
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
    tag: "",
    title: "",
    subtitle: "",
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
          { name: "Adult pool with aquapark", icon: "⚡", desc: "Fun slides and a large pool", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Kids pool", icon: "🎠", desc: "Safe water games for the little ones", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
          { name: "VIP pool", icon: "💎", desc: "Special pool for those seeking peace and comfort", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Another adult pool", icon: "🏊", desc: "For professional swimming and relaxation", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "AF Beach adult pool", icon: "🏖️", desc: "Adult pool with a sea view", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "AF Beach kids pool", icon: "🌊", desc: "Safe kids pool in the beach zone", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
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
        desc: "Golden sand and seaside comfort",
        icon: Palmtree,
        items: [
          { name: "Coast Zone", icon: "🏖️", desc: "Comfortable sunbeds, VIP bungalows, and a clean coast", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
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
    tag: "",
    title: "",
    subtitle: "",
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
          { name: "Взрослый бассейн с аквапарком", icon: "⚡", desc: "Веселые горки и большой бассейн", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Детский бассейн", icon: "🎠", desc: "Безопасные водные игры для малышей", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
          { name: "VIP бассейн", icon: "💎", desc: "Специальный бассейн для ищущих покой и роскошь", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Еще один бассейн для взрослых", icon: "🏊", desc: "Для профессионального плавания и отдыха", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
          { name: "AF Beach бассейн для взрослых", icon: "🏖️", desc: "Взрослый бассейн с видом на море", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
          { name: "AF Beach детский бассейн", icon: "🌊", desc: "Безопасный детский бассейн в пляжной зоне", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
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

  // Stats section animation ref
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

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
              .filter(a => a.category && (typeof a.category === 'object' ? (a.category as any)._id : a.category) === cat._id)
              .map(a => ({
                name: a.title,
                icon: "✨",
                desc: a.description,
                img: a.image || (a.images && a.images.length > 0 ? a.images[0] : "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"),
                images: a.images || [],
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

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (photoSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = photoSliderRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [activeTab]);

  const activeZones = dbZones.length > 0 ? dbZones : c.zones;
  const activeZone = activeZones[activeTab] || activeZones[0];

  const displayTag = loc(settings?.tag) || c.tag;
  const displayTitle = loc(settings?.title) || c.title;
  const displaySubtitle = loc(settings?.subtitle) || c.subtitle;

  const dynamicStats = [
    { icon: Waves, label: loc(settings?.stats?.[0]?.value) || "", sub1: loc(settings?.stats?.[0]?.label) || (l === "az" ? "" : l === "en" ? "" : ""), sub2: loc(settings?.stats?.[0]?.sub) },
    { icon: Users, label: loc(settings?.stats?.[1]?.value) || "", sub1: loc(settings?.stats?.[1]?.label) || (l === "az" ? "" : l === "en" ? "" : ""), sub2: loc(settings?.stats?.[1]?.sub) },
    { icon: Clock, label: loc(settings?.stats?.[2]?.value) || c.openHours, sub1: loc(settings?.stats?.[2]?.label) || c.season, sub2: loc(settings?.stats?.[2]?.sub) },
    { icon: Clapperboard, label: loc(settings?.stats?.[3]?.value) || "", sub1: loc(settings?.stats?.[3]?.label) || (l === "az" ? "" : l === "en" ? "" : ""), sub2: loc(settings?.stats?.[3]?.sub) },
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
    <section id="aquapark" className="py-12 md:py-32 bg-transparent scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-10 md:space-y-16">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ease: 'easeOut', duration: 0.45, delay: 0.05 }}
            className="space-y-4 text-center flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{ originX: 0.5 }}
                className="w-12 h-px bg-[#00b5d5]"
              />
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#00b5d5]"
              >
                {displayTag}
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{ originX: 0.5 }}
                className="w-12 h-px bg-[#00b5d5]"
              />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1e325c] tracking-wide font-serif leading-tight wrap-break-word whitespace-normal text-center max-w-3xl">
              <TextReveal text={displayTitle} delay={0.1} center />
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-sm md:text-base font-medium text-stone-500 prose prose-sm prose-stone max-w-2xl text-center [&>p]:mb-0 mx-auto px-4 w-full **:whitespace-normal! **:wrap-break-word!" dangerouslySetInnerHTML={{ __html: displaySubtitle.replace(/&nbsp;/g, ' ') }}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {dynamicStats.map((s, i) => {
            const val = s.label?.trim() || "";
            // Check if the value is likely just an emoji (no letters/numbers and very short)
            const isEmojiValue = val.length > 0 && val.length <= 4 && !/[a-zA-Z0-9]/.test(val);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ ease: 'easeOut', duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-5 md:p-7 flex flex-col items-center text-center gap-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,181,213,0.15)] group relative overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-[#00b5d5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-linear-to-br from-stone-50 to-stone-100 flex items-center justify-center mb-0 md:mb-1 border border-stone-100 shadow-inner group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-linear-to-br group-hover:from-[#00b5d5]/10 group-hover:to-transparent transition-all duration-500">
                  {isEmojiValue ? (
                    <span className="text-xl md:text-2xl leading-none">{val}</span>
                  ) : (
                    <s.icon className="w-5 h-5 md:w-6 md:h-6 text-[#00b5d5]" />
                  )}
                </div>
                {!isEmojiValue && (
                  <span className="text-lg md:text-2xl font-extrabold text-[#1e325c] tracking-tight group-hover:text-[#00b5d5] transition-colors">{val}</span>
                )}
                <span className="text-[10px] md:text-[11px] text-stone-500 font-bold tracking-widest uppercase">{s.sub1}</span>
                {s.sub2 && <span className="text-[9px] text-stone-400 font-medium tracking-wide mt-0.5">{s.sub2}</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ease: 'easeOut', duration: 0.45, delay: 0.15 }}
          className="w-full pt-4 relative z-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 bg-white/70 p-3 rounded-3xl md:rounded-4xl border border-white/60 backdrop-blur-xl shadow-sm">
            {activeZones.map((zone, i) => {
              const IconComponent = zone.icon;
              const zoneName = loc(zone.name);
              const zoneDesc = loc(zone.desc);

              return (
                <motion.button
                  key={zone.id || i}
                  onClick={() => setActiveTab(i)}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full p-3 md:p-5 rounded-xl md:rounded-3xl flex flex-col items-center md:items-start text-center md:text-left gap-1.5 md:gap-2 transition-all cursor-pointer ${
                    activeTab === i
                      ? "bg-white shadow-[0_8px_30px_rgba(0,181,213,0.12)] border border-[#00b5d5]/20 scale-[1.02]"
                      : "bg-white/60 md:bg-transparent md:hover:bg-white/80 border border-transparent"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-center md:text-left w-full">
                    <div className="flex items-center gap-1.5">
                      {zone.emoji ? (
                        <DynamicIcon name={zone.emoji} className="w-5 h-5 md:w-5 md:h-5" />
                      ) : IconComponent ? (
                        <IconComponent className={`w-5 h-5 md:w-5 md:h-5 ${activeTab === i ? "text-[#00b5d5]" : "text-stone-400"}`} />
                      ) : null}
                    </div>

                    <span className={`text-[11px] md:text-sm font-bold tracking-wide leading-tight ${activeTab === i ? "text-[#00b5d5]" : "text-stone-600"}`}>
                      {zoneName}
                    </span>

                    {zone.isSoon && (
                      <span className="text-[8px] md:text-[9px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm mt-1 md:mt-0">
                        {c.soonTag || "Soon"}
                      </span>
                    )}
                  </div>

                  {zoneDesc && (
                    <span className="text-[10px] md:text-[11px] text-stone-500 font-medium line-clamp-1 w-full text-center md:text-left mt-1 md:mt-0">
                      {stripHtml(zoneDesc)}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* НИЖНИЕ КАРТОЧКИ С ФОТОГРАФИЯМИ (УНИВЕРСАЛЬНЫЙ СЛАЙДЕР) */}
        <div className="space-y-4">
          
          <div className="relative">
            {/* Сама лента слайдера */}
            <div 
              ref={photoSliderRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:gap-6 pb-8 pt-2 gallery-scrollbar hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {activeZone?.items.map((item: any, i: number) => {
                const itemName = loc(item.name);
                const itemDesc = loc(item.desc);
                const activeZoneName = loc(activeZone.name);

                return (
                  <div
                    key={i}
                    className="group w-[85vw] sm:w-[45vw] lg:w-[calc(33.333%-16px)] flex-none snap-center rounded-3xl md:rounded-4xl overflow-hidden border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col cursor-pointer relative transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,181,213,0.15)]"
                  >
                    {/* Subtle glow overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#00b5d5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                    
                    <div className="relative h-56 md:h-64 overflow-hidden bg-stone-100">
                      {item.images && item.images.length > 1 ? (
                        <CardImageSlider images={item.images} itemName={itemName} priority={i < 2} />
                      ) : (
                        <Image src={item.images?.[0] || item.img} alt={itemName} fill priority={i < 2} sizes="(max-width: 768px) 85vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#1e325c]/90 via-[#1e325c]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-10" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#1e325c] shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center gap-1.5 z-20">
                        <span className="text-sm">{item.icon}</span>
                        <span>{itemName}</span>
                      </div>
                    </div>
                    <div className="p-5 md:p-6 grow flex flex-col justify-between space-y-3 relative z-20">
                      <div>
                        <h4 className="font-extrabold text-[#1e325c] text-base md:text-lg leading-tight mb-2 group-hover:text-[#00b5d5] transition-colors">{itemName}</h4>
                        <div className="text-[11px] md:text-xs text-stone-500 font-medium leading-relaxed line-clamp-3 prose prose-stone [&>p]:mb-1" dangerouslySetInnerHTML={{ __html: itemDesc }} />
                      </div>
                      <div className="pt-3 border-t border-stone-200/50 flex items-center gap-1.5 text-stone-400 group-hover:text-[#00b5d5]/80 transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest">{activeZoneName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            
            {/* Навигационные стрелки */}
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => scrollSlider("left")}
                disabled={isAtStart}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isAtStart 
                    ? "bg-white border-stone-200 text-stone-300 cursor-not-allowed" 
                    : "bg-[#ff6c02] border-[#ff6c02] text-white hover:bg-[#e55f00]"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                disabled={isAtEnd}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isAtEnd 
                    ? "bg-white border-stone-200 text-stone-300 cursor-not-allowed" 
                    : "bg-[#ff6c02] border-[#ff6c02] text-white hover:bg-[#e55f00]"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tickets + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pt-4">
          {/* Tickets */}
          {/* Tickets */}
          <div className="bg-white border border-stone-100 rounded-4xl p-6 md:p-8 relative overflow-hidden group shadow-sm flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-stone-50 rounded-full blur-3xl group-hover:bg-[#00b5d5]/5 transition-colors duration-1000" />
            
            <div className="flex flex-col mb-6 relative z-10 border-b border-stone-100 pb-4">
              <h3 className="font-serif text-xl md:text-2xl text-[#1e325c] flex items-center gap-2.5 font-medium">
                <span className="text-xl">🎟️</span>
                {c.tickets}
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10 flex-1">
              {(tickets.length > 0 ? tickets.map((t) => ({ label: loc(t.name), price: t.price + " ₼", _id: t._id })) : [
                { label: c.adult, price: c.adultPrice, _id: "adult" },
                { label: c.child, price: c.childPrice, _id: "child" },
                { label: c.infant, price: c.infantPrice, _id: "infant" },
              ]).map((t) => (
                <div key={t._id} className="relative bg-stone-50/50 rounded-xl border border-stone-200 hover:border-[#00b5d5]/50 transition-all duration-300 hover:shadow-sm overflow-hidden group/ticket flex flex-col justify-center min-h-12.5">
                  
                  {/* Perforations for real ticket look */}
                  <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-stone-200 group-hover/ticket:border-[#00b5d5]/50 transition-colors" />
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-stone-200 group-hover/ticket:border-[#00b5d5]/50 transition-colors" />
                  
                  <div className="flex justify-between items-center px-4 py-2 border-l-2 border-dashed border-stone-200 group-hover/ticket:border-[#00b5d5]/40 ml-3 transition-colors">
                    <span className="text-sm font-medium text-stone-700 pr-4">
                      {t.label}
                    </span>
                    <span className="text-sm md:text-base font-bold text-[#00b5d5] whitespace-nowrap">
                      {t.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <MagneticButton className="w-full block relative z-10 mt-6">
              <a
                href="tel:+994502233285"
                className="flex items-center justify-center gap-2 w-full py-3.5 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                style={{ background: "var(--color-hotel-blue, #00b5d5)" }}
              >
                {c.orderTicket}
              </a>
            </MagneticButton>
          </div>

          {/* FAQ */}
          <div className="space-y-3 pt-6 lg:pt-0">
            <h3 className="font-bold text-xl md:text-2xl text-[#1e325c] font-serif pl-1 mb-5">{c.faq}</h3>
            {(faqs.length > 0 ? faqs : c.faqs).map((faq: any, i) => {
              const faqQuestion = loc(faq.question) || faq.q;
              const faqAnswer = loc(faq.answer) || faq.a;

              return (
                <div key={i} className="bg-[#f9f8f4] rounded-2xl border border-stone-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center p-4 text-left cursor-pointer"
                  >
                    <span className="text-xs md:text-sm font-semibold text-[#1e325c] pr-4">{faqQuestion}</span>
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