"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Phone, ChefHat, Utensils, Coffee, Wine, Calendar, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { getRestaurants, getRestaurantSettings } from "@/services/api";
import type { Restaurant, MenuCategory as ApiMenuCategory, MenuItem as ApiMenuItem, RestaurantSettings } from "@/types/api";

type LangType = "az" | "en" | "ru";

// İkon seçimi — kateqoriya adına görə uyğun ikon qaytarır
function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("bar") || lower.includes("kokteyl") || lower.includes("cocktail") || lower.includes("şərab") || lower.includes("wine")) return Wine;
  if (lower.includes("səhər") || lower.includes("breakfast") || lower.includes("завтрак") || lower.includes("coffee") || lower.includes("qəhvə")) return Coffee;
  if (lower.includes("desert") || lower.includes("dessert") || lower.includes("десерт") || lower.includes("snek") || lower.includes("snack") || lower.includes("закуск")) return Utensils;
  return ChefHat;
}

interface LanguageLabels {
  tag: string;
  title: string;
  subtitle: string;
  hours: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  reserve: string;
  call: string;
  viewMenu: string;
  searchPlaceholder: string;
  noResults: string;
  loading: string;
  noRestaurants: string;
}

const labels: Record<LangType, LanguageLabels> = {
  az: {
    tag: "RESTORANLARIMIZ & BAR",
    title: "Unudulmaz Qastrofəza Səyahəti",
    subtitle: "AF Hotel & Resort ərazisində istirahətinizin hər anı üçün yaradılmış unikal konseptual məkanlar.",
    hours: "İş saatları",
    breakfast: "Səhər yeməyi",
    lunch: "Nahar",
    dinner: "Şam yeməyi",
    reserve: "Rezerv et",
    call: "Zəng et",
    viewMenu: "Menyu ilə tanış olun",
    searchPlaceholder: "Menyuda axtar...",
    noResults: "Təam tapılmadı.",
    loading: "Yüklənir...",
    noRestaurants: "Restoran tapılmadı.",
  },
  ru: {
    tag: "НАШИ РЕСТОРАНЫ & БАР",
    title: "Незабываемое Гастрономическое Путешествие",
    subtitle: "Уникальные концептуальные пространства на территории AF Hotel & Resort, созданные для каждого мгновения вашего отдыха.",
    hours: "Часы работы",
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    reserve: "Забронировать",
    call: "Позвонить",
    viewMenu: "Изучить меню",
    searchPlaceholder: "Найти в меню...",
    noResults: "Блюдо не найдено.",
    loading: "Загрузка...",
    noRestaurants: "Ресторан не найден.",
  },
  en: {
    tag: "OUR RESTAURANTS & BAR",
    title: "An Unforgettable Dining Journey",
    subtitle: "Unique conceptual spaces within AF Hotel & Resort, crafted for every moment of your leisure.",
    hours: "Opening Hours",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    reserve: "Book a Table",
    call: "Call Us",
    viewMenu: "Explore Menu",
    searchPlaceholder: "Search menu...",
    noResults: "Dish not found.",
    loading: "Loading...",
    noRestaurants: "No restaurants found.",
  },
};

export default function Restoran() {
  const { language } = useLanguage();
  const l = (language as LangType) || "az";
  const c = labels[l] || labels.az;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRest, setActiveRest] = useState<number>(0);
  const [activeMenuTab, setActiveMenuTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [data, settingsData] = await Promise.all([
          getRestaurants(),
          getRestaurantSettings(),
        ]);
        setRestaurants(data);
        setSettings(settingsData);
      } catch {
        // silent — empty list
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentRestaurant = restaurants[activeRest] || restaurants[0];
  const activeMenu = currentRestaurant?.menu?.[activeMenuTab] || currentRestaurant?.menu?.[0];

  const handleRestaurantChange = (index: number) => {
    setActiveRest(index);
    setActiveMenuTab(0);
    setSearchQuery("");
  };

  const filteredItems = activeMenu?.items?.filter((item: ApiMenuItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // İş saatları schedule array olaraq formatla
  const getSchedule = () => {
    if (!currentRestaurant?.workingHours) return [];
    const wh = currentRestaurant.workingHours;
    const schedule: { meal: string; time: string }[] = [];
    if (wh.breakfast) schedule.push({ meal: c.breakfast, time: wh.breakfast });
    if (wh.lunch) schedule.push({ meal: c.lunch, time: wh.lunch });
    if (wh.dinner) schedule.push({ meal: c.dinner, time: wh.dinner });
    return schedule;
  };

  if (loading) {
    return (
      <section id="restoran" className="py-24 md:py-32 bg-[#fdfcf7] scroll-mt-20">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
          <span className="ml-3 text-sm text-stone-500">{c.loading}</span>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section id="restoran" className="py-24 md:py-32 bg-[#fdfcf7] scroll-mt-20">
        <div className="text-center py-20 text-stone-400 text-sm">{c.noRestaurants}</div>
      </section>
    );
  }

  const schedule = getSchedule();

  return (
    <section id="restoran" className="py-24 md:py-32 bg-[#fdfcf7] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-12 md:space-y-16">
        
        {/* Başlıq */}
        <ScrollReveal direction="up" delay={0.1} className="text-center space-y-3">
          <span className="text-[#00b5d5] text-[11px] font-bold tracking-[0.35em] uppercase block">
            {settings?.tag || c.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif tracking-tight">
            {settings?.title || c.title}
          </h2>
          <p className="text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
            {settings?.subtitle || c.subtitle}
          </p>
        </ScrollReveal>

        {/* Restoran naviqasiyası */}
        <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap justify-center gap-2 p-1.5 bg-stone-100 max-w-2xl mx-auto rounded-2xl border border-stone-200/40">
          {restaurants.map((rest: Restaurant, idx: number) => (
            <button
              key={rest._id}
              onClick={() => handleRestaurantChange(idx)}
              className={`flex-1 min-w-35 text-center px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer border-none bg-transparent ${
                activeRest === idx ? "bg-white text-[#1e325c] shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {rest.name}
            </button>
          ))}
        </ScrollReveal>

        {/* Əsas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sol info panel */}
          <ScrollReveal direction="left" delay={0.3} className="lg:col-span-5 space-y-6">
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-md group">
              {currentRestaurant.image ? (
                <Image
                  src={currentRestaurant.image}
                  alt={currentRestaurant.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1e325c] to-[#00b5d5]" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest font-bold bg-[#00b5d5] px-2.5 py-1 rounded-md">
                  Hotel Concept
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-light mt-2">{currentRestaurant.name}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs space-y-4">
              <p className="text-stone-600 text-sm leading-relaxed">
                {currentRestaurant.description}
              </p>
              <hr className="border-stone-100" />
              
              {schedule.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1e325c] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#00b5d5]" />
                    {c.hours}
                  </h4>
                  <div className="space-y-2 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                    {schedule.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-stone-500 font-medium">{s.meal}</span>
                        <span className="font-bold text-[#1e325c]">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentRestaurant.phone && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a href={`tel:${currentRestaurant.phone.replace(/\s+/g, "")}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1e325c] hover:bg-[#162545] text-white text-xs font-bold rounded-xl transition-colors shadow-xs">
                    <Calendar className="w-3.5 h-3.5" /> {c.reserve}
                  </a>
                  <a href={`tel:${currentRestaurant.phone.replace(/\s+/g, "")}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold rounded-xl transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#00b5d5]" /> {c.call}
                  </a>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Sağ hissə: Menyu */}
          <ScrollReveal direction="right" delay={0.4} className="lg:col-span-7 space-y-6">
            {currentRestaurant.menu && currentRestaurant.menu.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-stone-200/60 pb-3">
                  <h3 className="text-lg font-serif font-bold text-[#1e325c] tracking-wide flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#00b5d5]" />
                    {c.viewMenu}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex gap-1 flex-wrap">
                      {currentRestaurant.menu.map((cat: ApiMenuCategory, idx: number) => {
                        const Icon = getCategoryIcon(cat.name);
                        return (
                          <button
                            key={cat._id || idx}
                            onClick={() => { setActiveMenuTab(idx); setSearchQuery(""); }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                              activeMenuTab === idx ? "bg-[#00b5d5] text-white shadow-xs" : "bg-stone-100 text-stone-500 hover:bg-stone-200/70"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative w-full sm:w-40 mt-2 sm:mt-0">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={c.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-100/80 border border-transparent rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-700 outline-none focus:border-[#00b5d5] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Yeməklər */}
                <div className="max-h-145 overflow-y-auto pr-2 space-y-3.5 scrollbar-thin scrollbar-thumb-stone-200/80">
                  {filteredItems.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredItems.map((item: ApiMenuItem, i: number) => (
                          <motion.div
                            layout
                            key={item._id || item.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                            className="bg-white p-3.5 rounded-2xl border border-stone-100/80 shadow-2xs hover:shadow-md hover:border-stone-200/60 transition-all duration-300 flex justify-between items-center gap-4 min-h-27.5"
                          >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-col gap-0.5">
                              <h4 className="font-bold text-xs md:text-sm text-[#1e325c] leading-snug">
                                {item.name}
                              </h4>
                              <span className="text-xs font-bold text-[#00b5d5] font-mono mt-0.5">
                                {item.price} AZN
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 font-medium leading-normal line-clamp-2 md:line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          {item.image && (
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-2xs bg-stone-50">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 80px, 96px"
                                className="object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 text-stone-400 text-xs font-medium">
                      {c.noResults}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-stone-400 text-sm">
                {c.noResults}
              </div>
            )}
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}