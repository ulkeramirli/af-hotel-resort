"use client";
import { useState } from "react";
import Image from "next/image";
import { Clock, Phone, ChefHat, Utensils, Coffee, Wine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  az: {
    tag: "RESTORAN & BAR",
    title: "Lezzətin Sənəti",
    subtitle: "Azərbaycan, Avropa və Dünya mətbəxinin ən yaxşı nümunələri",
    breakfast: "Səhər Yeməyi",
    lunch: "Nahar",
    dinner: "Şam Yeməyi",
    bar: "Bar & Kokteyllər",
    hours: "İş Saatları",
    reserve: "Masa Ayırt Et",
    call: "Zəng Et",
    menu: [
      {
        category: "Səhər Yeməyi",
        icon: Coffee,
        items: [
          { name: "AF Premium Büfe", price: "35 AZN", desc: "Geniş seçimli açıq büfe" },
          { name: "Azərbaycan Sərniş", price: "25 AZN", desc: "Pendir, qaymaq, bal, çay dəsti" },
          { name: "English Breakfast", price: "28 AZN", desc: "Yumurta, sosiska, tost, limon şirəsi" },
        ],
      },
      {
        category: "Əsas Yeməklər",
        icon: ChefHat,
        items: [
          { name: "Dəniz Xərçəngi Şorbası", price: "22 AZN", desc: "Xüsusi resept üzrə hazırlanan" },
          { name: "Lülə Kabab", price: "32 AZN", desc: "Tandır çörəyi və göyərti ilə" },
          { name: "Şef Bifşteks", price: "55 AZN", desc: "Ağcaqayın mantarı sous ilə, 250q" },
          { name: "Qızardılmış Qanqal Balığı", price: "45 AZN", desc: "Limon yağı və otlar ilə" },
        ],
      },
      {
        category: "Desertlər",
        icon: Utensils,
        items: [
          { name: "Paklavalar Dəsti", price: "18 AZN", desc: "Ev bişirməsi, fıstıq və bal ilə" },
          { name: "Şokoladlı Fondant", price: "14 AZN", desc: "Dondurma topuyla" },
          { name: "Mango Sorbeti", price: "10 AZN", desc: "Mövsümi meyvə ilə" },
        ],
      },
      {
        category: "Bar",
        icon: Wine,
        items: [
          { name: "Baku Sunset", price: "16 AZN", desc: "Pomelo şirəsi, nar, zəncəfil" },
          { name: "Aqua Breeze", price: "14 AZN", desc: "Nane, limon, tonic" },
          { name: "Royal Tea", price: "12 AZN", desc: "Çay seçimi, bal, limon" },
        ],
      },
    ],
    schedule: [
      { meal: "Səhər yeməyi", time: "07:00 – 11:00" },
      { meal: "Nahar", time: "12:00 – 15:00" },
      { meal: "Şam yeməyi", time: "18:00 – 23:00" },
      { meal: "Bar", time: "11:00 – 01:00" },
    ],
  },
  en: {
    tag: "RESTAURANT & BAR",
    title: "The Art of Taste",
    subtitle: "The finest Azerbaijani, European, and World cuisine",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    bar: "Bar & Cocktails",
    hours: "Opening Hours",
    reserve: "Reserve a Table",
    call: "Call Us",
    menu: [
      {
        category: "Breakfast",
        icon: Coffee,
        items: [
          { name: "AF Premium Buffet", price: "35 AZN", desc: "Wide selection open buffet" },
          { name: "Azerbaijani Set", price: "25 AZN", desc: "Cheese, cream, honey, tea set" },
          { name: "English Breakfast", price: "28 AZN", desc: "Eggs, sausages, toast, juice" },
        ],
      },
      {
        category: "Main Course",
        icon: ChefHat,
        items: [
          { name: "Seafood Bisque", price: "22 AZN", desc: "Special recipe" },
          { name: "Lula Kebab", price: "32 AZN", desc: "With tandoor bread and greens" },
          { name: "Chef's Steak", price: "55 AZN", desc: "With maple mushroom sauce, 250g" },
          { name: "Grilled Sea Bass", price: "45 AZN", desc: "With lemon butter and herbs" },
        ],
      },
      {
        category: "Desserts",
        icon: Utensils,
        items: [
          { name: "Baklava Set", price: "18 AZN", desc: "Homemade, with pistachios and honey" },
          { name: "Chocolate Fondant", price: "14 AZN", desc: "With ice cream scoop" },
          { name: "Mango Sorbet", price: "10 AZN", desc: "With seasonal fruit" },
        ],
      },
      {
        category: "Bar",
        icon: Wine,
        items: [
          { name: "Baku Sunset", price: "16 AZN", desc: "Pomelo juice, pomegranate, ginger" },
          { name: "Aqua Breeze", price: "14 AZN", desc: "Mint, lemon, tonic" },
          { name: "Royal Tea", price: "12 AZN", desc: "Tea selection, honey, lemon" },
        ],
      },
    ],
    schedule: [
      { meal: "Breakfast", time: "07:00 – 11:00" },
      { meal: "Lunch", time: "12:00 – 15:00" },
      { meal: "Dinner", time: "18:00 – 23:00" },
      { meal: "Bar", time: "11:00 – 01:00" },
    ],
  },
  ru: {
    tag: "РЕСТОРАН & БАР",
    title: "Искусство Вкуса",
    subtitle: "Лучшие блюда азербайджанской, европейской и мировой кухни",
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    bar: "Бар и Коктейли",
    hours: "Часы работы",
    reserve: "Забронировать стол",
    call: "Позвонить",
    menu: [
      {
        category: "Завтрак",
        icon: Coffee,
        items: [
          { name: "AF Premium Буфет", price: "35 AZN", desc: "Широкий выбор шведского стола" },
          { name: "Азербайджанский завтрак", price: "25 AZN", desc: "Сыр, каймак, мёд, чай" },
          { name: "English Breakfast", price: "28 AZN", desc: "Яйца, сосиски, тосты, сок" },
        ],
      },
      {
        category: "Горячие блюда",
        icon: ChefHat,
        items: [
          { name: "Суп из морепродуктов", price: "22 AZN", desc: "По особому рецепту" },
          { name: "Люля-кебаб", price: "32 AZN", desc: "С хлебом тандыр и зеленью" },
          { name: "Стейк от шефа", price: "55 AZN", desc: "С соусом из лесных грибов, 250г" },
          { name: "Жареный сибас", price: "45 AZN", desc: "С лимонным маслом и травами" },
        ],
      },
      {
        category: "Десерты",
        icon: Utensils,
        items: [
          { name: "Набор пахлавы", price: "18 AZN", desc: "Домашняя, с фисташками и мёдом" },
          { name: "Шоколадный фондан", price: "14 AZN", desc: "С шариком мороженого" },
          { name: "Манго сорбет", price: "10 AZN", desc: "С сезонными фруктами" },
        ],
      },
      {
        category: "Бар",
        icon: Wine,
        items: [
          { name: "Baku Sunset", price: "16 AZN", desc: "Сок помело, гранат, имбирь" },
          { name: "Aqua Breeze", price: "14 AZN", desc: "Мята, лимон, тоник" },
          { name: "Royal Tea", price: "12 AZN", desc: "Выбор чая, мёд, лимон" },
        ],
      },
    ],
    schedule: [
      { meal: "Завтрак", time: "07:00 – 11:00" },
      { meal: "Обед", time: "12:00 – 15:00" },
      { meal: "Ужин", time: "18:00 – 23:00" },
      { meal: "Бар", time: "11:00 – 01:00" },
    ],
  },
};

const RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
];

export default function Restoran() {
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);

  const activeMenu = c.menu[activeTab];

  return (
    <section id="restoran" className="py-32 bg-[#f9f8f4] scroll-mt-20">
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

        {/* Image gallery */}
        <div className="grid grid-cols-3 gap-3 h-64 rounded-3xl overflow-hidden">
          {RESTAURANT_IMAGES.map((src, i) => (
            <div key={i} className={`relative overflow-hidden ${i === 0 ? "col-span-2" : ""}`}>
              <Image
                src={src}
                alt="Restaurant"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Menu tabs + content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Tabs */}
          <div className="space-y-2">
            {c.menu.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all ${
                    activeTab === i
                      ? "text-white shadow-md"
                      : "bg-white text-stone-500 hover:bg-stone-50 border border-stone-100"
                  }`}
                  style={activeTab === i ? { background: "var(--color-hotel-blue)" } : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm">{cat.category}</span>
                </button>
              );
            })}

            {/* Hours */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3 mt-4">
              <h4 className="font-bold text-sm text-[#1e325c] flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                {c.hours}
              </h4>
              {c.schedule.map((s) => (
                <div key={s.meal} className="flex justify-between text-xs">
                  <span className="text-stone-500">{s.meal}</span>
                  <span className="font-bold text-[#1e325c]">{s.time}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2">
              <a
                href="tel:+994123456789"
                className="flex items-center justify-center gap-2 px-4 py-3 text-white text-xs font-bold rounded-xl"
                style={{ background: "var(--color-hotel-blue)" }}
              >
                <Phone className="w-4 h-4" /> {c.reserve}
              </a>
              <a
                href="tel:+994123456789"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl"
              >
                <Phone className="w-4 h-4" /> {c.call}
              </a>
            </div>
          </div>

          {/* Menu items */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-[#1e325c] font-serif flex items-center gap-2">
              {activeMenu && <activeMenu.icon className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />}
              {activeMenu?.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMenu?.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-[#1e325c] leading-tight">{item.name}</h4>
                    <span
                      className="text-sm font-bold shrink-0 ml-2"
                      style={{ color: "var(--color-hotel-blue)" }}
                    >
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}