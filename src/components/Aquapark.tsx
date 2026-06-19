"use client";
import { useState } from "react";
import Image from "next/image";
import { Waves, Clock, Users, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: {
    tag: "AKVAPARK",
    title: "Su Əyləncəsinin Dünyası",
    subtitle: "Bölgənin ən böyük su əyləncə kompleksi — hər yaş üçün",
    children: "Uşaqlar üçün",
    extreme: "Ekstremal",
    family: "Ailə",
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
    attractions: [
      {
        tab: "Uşaqlar üçün",
        key: "children",
        items: [
          { name: "Mini Dalğa Hovuzu", icon: "🌊", desc: "Kiçik dalğaları olan güvənli hovuz, 0–6 yaş üçün", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Sürüşmə Əyləncəsi", icon: "🎪", desc: "Rəngli sürüşmələr, körpə akvaparkı", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" },
          { name: "Su Oyun Meydanı", icon: "🎠", desc: "Fıskiyə, çiləmə, mini körpü", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ],
      },
      {
        tab: "Ekstremal",
        key: "extreme",
        items: [
          { name: "Kamikaze Sürüşməsi", icon: "⚡", desc: "80 km/s-ə çatan sürüşmə, 14+ yaş", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Tornado", icon: "🌀", desc: "Dövrəvi sürüşmə tüneli, 4 nəfər eyni anda", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Dalğa Hovuzu", icon: "🏄", desc: "2 metrlik süni dalğalar, sörf həvəskarları üçün", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
        ],
      },
      {
        tab: "Ailə",
        key: "family",
        items: [
          { name: "Tənbəl Çay", icon: "🛶", desc: "Sakitləşdirici axın kanalı, 500m uzunluğunda", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
          { name: "Olimpik Hovuz", icon: "🏊", desc: "25m olimpik üzmə hovuzu, ayrı bölmə", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Jacuzzi & Relaks", icon: "♨️", desc: "6 fərdi jakuzi, istirahət zonası", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
        ],
      },
    ],
    faqs: [
      { q: "Bilet nə vaxt alına bilər?", a: "Kassadan yerindən, yaxud saytdan onlayn sifariş etmək mümkündür." },
      { q: "Hamam paltarı icarəyə verilirmi?", a: "Bəli, hamam paltarı, dəsmal və locker icarəsi mövcuddur." },
      { q: "Uşaqlar üçün minimum yaş varmı?", a: "Bütün uşaqlar qəbul edilir. Ekstremal atraksionlar 14+ yaş üçün nəzərdə tutulub." },
      { q: "Qida içəri gətirmək olurmu?", a: "Xaricdən qida gətirilməsi qadağandır. Restoran və snack barımız xidmətinizdədir." },
    ],
  },
  en: {
    tag: "AQUA PARK",
    title: "World of Water Fun",
    subtitle: "The region's largest water entertainment complex — for all ages",
    children: "For Children",
    extreme: "Extreme",
    family: "Family",
    openHours: "10:00 – 20:00",
    season: "Summer season: May – October",
    tickets: "Ticket prices",
    faq: "FAQ",
    adult: "Adult",
    child: "Child (5-12)",
    infant: "Infant (0-4)",
    adultPrice: "25 AZN",
    childPrice: "15 AZN",
    infantPrice: "Free",
    attractions: [
      {
        tab: "For Children",
        key: "children",
        items: [
          { name: "Mini Wave Pool", icon: "🌊", desc: "Safe pool with small waves, ages 0–6", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Slide Fun Zone", icon: "🎪", desc: "Colorful slides, toddler aqua park", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" },
          { name: "Water Playground", icon: "🎠", desc: "Fountains, sprinklers, mini bridge", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ],
      },
      {
        tab: "Extreme",
        key: "extreme",
        items: [
          { name: "Kamikaze Slide", icon: "⚡", desc: "Up to 80 km/h, ages 14+", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Tornado", icon: "🌀", desc: "Circular tunnel slide, 4 people at once", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Wave Pool", icon: "🏄", desc: "2-meter artificial waves for surfers", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
        ],
      },
      {
        tab: "Family",
        key: "family",
        items: [
          { name: "Lazy River", icon: "🛶", desc: "Relaxing 500m flow channel", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
          { name: "Olympic Pool", icon: "🏊", desc: "25m Olympic swimming pool", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Jacuzzi & Relax", icon: "♨️", desc: "6 private jacuzzis, relaxation zone", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
        ],
      },
    ],
    faqs: [
      { q: "When can tickets be purchased?", a: "At the box office on site or online booking on the website." },
      { q: "Are swimwear available for rent?", a: "Yes, swimwear, towel and locker rental available." },
      { q: "Is there a minimum age for children?", a: "All children are welcome. Extreme attractions are for ages 14+." },
      { q: "Can I bring food inside?", a: "Outside food is not permitted. Our restaurant and snack bar are at your service." },
    ],
  },
  ru: {
    tag: "АКВАПАРК",
    title: "Мир Водных Развлечений",
    subtitle: "Крупнейший аквапарк региона — для всех возрастов",
    children: "Для детей",
    extreme: "Экстрим",
    family: "Семейный",
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
    attractions: [
      {
        tab: "Для детей",
        key: "children",
        items: [
          { name: "Мини бассейн с волнами", icon: "🌊", desc: "Безопасный бассейн, 0–6 лет", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
          { name: "Горки для малышей", icon: "🎪", desc: "Цветные горки, детский аквапарк", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" },
          { name: "Водная площадка", icon: "🎠", desc: "Фонтаны, брызгалки, мини-мост", img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80" },
        ],
      },
      {
        tab: "Экстрим",
        key: "extreme",
        items: [
          { name: "Горка Камикадзе", icon: "⚡", desc: "До 80 км/ч, 14+ лет", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80" },
          { name: "Торнадо", icon: "🌀", desc: "Круговой тоннель, 4 человека сразу", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80" },
          { name: "Бассейн с волнами", icon: "🏄", desc: "2-метровые волны для сёрфинга", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
        ],
      },
      {
        tab: "Семейный",
        key: "family",
        items: [
          { name: "Ленивая река", icon: "🛶", desc: "Расслабляющий 500м канал", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80" },
          { name: "Олимпийский бассейн", icon: "🏊", desc: "25м олимпийский бассейн", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80" },
          { name: "Джакузи и релакс", icon: "♨️", desc: "6 джакузи, зона отдыха", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
        ],
      },
    ],
    faqs: [
      { q: "Когда можно купить билеты?", a: "В кассе на месте или онлайн на сайте." },
      { q: "Можно арендовать купальник?", a: "Да, аренда купальника, полотенца и шкафчика доступна." },
      { q: "Есть ли минимальный возраст?", a: "Приглашаются все дети. Экстрим аттракционы — 14+ лет." },
      { q: "Можно приносить еду?", a: "Еда снаружи запрещена. К вашим услугам наш ресторан и снэк-бар." },
    ],
  },
};

export default function Aquapark() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const active = c.attractions[activeTab];

  return (
    <section id="aquapark" className="py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-16">
        {/* Header */}
        <div className="text-center">
          <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">
            {c.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif mb-4">
            {c.title}
          </h2>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">{c.subtitle}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Waves, label: "15+", sub: "Atraksion" },
            { icon: Users, label: "2000+", sub: "Gün Qonaqları" },
            { icon: Clock, label: c.openHours, sub: c.season },
            { icon: Star, label: "4.9", sub: "Google Rating" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#f9f8f4] rounded-2xl p-5 flex flex-col items-center text-center gap-2"
            >
              <s.icon className="w-5 h-5" style={{ color: "#00b5d5" }} />
              <span className="text-xl font-bold text-[#1e325c]">{s.label}</span>
              <span className="text-[10px] text-stone-400">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Attractions */}
        <div>
          {/* Tab buttons */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {c.attractions.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === i
                    ? "text-white shadow-md"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
                style={
                  activeTab === i ? { background: "var(--color-hotel-blue)" } : undefined
                }
              >
                {a.tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {active?.items.map((item, i) => (
              <div
                key={i}
                className="group rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1e325c]/70 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-white font-bold text-sm mt-1">{item.name}</h3>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tickets */}
          <div className="bg-[#f9f8f4] rounded-3xl p-8 space-y-4">
            <h3 className="font-bold text-xl text-[#1e325c] font-serif flex items-center gap-2">
              🎟️ {c.tickets}
            </h3>
            {[
              { label: c.adult, price: c.adultPrice },
              { label: c.child, price: c.childPrice },
              { label: c.infant, price: c.infantPrice },
            ].map((t) => (
              <div
                key={t.label}
                className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100"
              >
                <span className="text-sm font-semibold text-stone-600">{t.label}</span>
                <span className="text-lg font-bold" style={{ color: "var(--color-hotel-blue)" }}>
                  {t.price}
                </span>
              </div>
            ))}
            <a
              href="tel:+994123456789"
              className="flex items-center justify-center gap-2 w-full py-3 text-white text-sm font-bold rounded-2xl mt-4 transition-opacity hover:opacity-90"
              style={{ background: "var(--color-hotel-blue)" }}
            >
              Bilet Sifariş Et
            </a>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h3 className="font-bold text-xl text-[#1e325c] font-serif">{c.faq}</h3>
            {c.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[#f9f8f4] rounded-2xl border border-stone-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="text-sm font-bold text-[#1e325c]">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-stone-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}