"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Phone, ChefHat, Utensils, Coffee, Wine, Calendar, Search, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

type LangType = "az" | "en" | "ru";

interface MenuItem {
  name: string;
  price: string;
  desc: string;
  image: string;
}

interface MenuCategory {
  category: string;
  icon: LucideIcon;
  items: MenuItem[];
}

interface ScheduleItem {
  meal: string;
  time: string;
}

interface RestaurantData {
  id: string;
  name: string;
  desc: string;
  image: string;
  schedule: ScheduleItem[];
  menu: MenuCategory[];
}

interface LanguageContent {
  tag: string;
  title: string;
  subtitle: string;
  hours: string;
  reserve: string;
  call: string;
  viewMenu: string;
  searchPlaceholder: string;
  noResults: string;
  restaurants: RestaurantData[];
}

const content: Record<LangType, LanguageContent> = {
  ru: {
    tag: "НАШИ РЕСТОРАНЫ & БАР",
    title: "Незабываемое Гастрономическое Путешествие",
    subtitle: "Уникальные концептуальные пространства на территории AF Hotel & Resort, созданные для каждого мгновения вашего отдыха.",
    hours: "Часы работы",
    reserve: "Забронировать",
    call: "Позвонить",
    viewMenu: "Изучить меню",
    searchPlaceholder: "Найти в меню...",
    noResults: "Блюдо не найдено.",
    restaurants: [
      {
        id: "caspian",
        name: "Caspian Breeze",
        desc: "Свежайшие морепродукты и азербайджанские кулинарные шедевры на фоне панорамного вида на Каспийское море.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
        schedule: [
          { meal: "Завтрак (Шведский стол)", time: "07:00 – 11:00" },
          { meal: "Обед (A la Carte)", time: "12:00 – 15:00" },
          { meal: "Ужин (Живая музыка)", time: "18:00 – 23:00" },
        ],
        menu: [
          {
            category: "Завтраки",
            icon: Coffee,
            items: [
              { name: "AF Premium Буфет", price: "35 AZN", desc: "Широкий выбор блюд национальной и европейской кухни в формате открытого буфета.", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80" },
              { name: "Традиционный Азербайджанский Завтрак", price: "25 AZN", desc: "Домашний сыр, шор, каймак, горный мед, деревенское масло и горячий чурек.", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb18865?w=400&q=80" },
              { name: "Кюкю со свежей зеленью", price: "12 AZN", desc: "Традиционный воздушный омлет из деревенских яиц с обилием ароматной зелени.", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80" },
            ],
          },
          {
            category: "Обеды и Ужины",
            icon: ChefHat,
            items: [
              { name: "Каспийский Шах Плов", price: "45 AZN", desc: "Королевский плов со специями, нежной ягнятиной, каштанами в хрустящей корочке.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
              { name: "Осетрина на углях", price: "55 AZN", desc: "Сочные стейки каспийской осетрины, подаются с соусом наршараб и лимоном.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80" },
              { name: "Долма из виноградных листьев", price: "18 AZN", desc: "Миниатюрная долма из нежного фарша ягненка, подается с чесночным мацони.", image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "sapphire",
        name: "Sapphire Fine Dining",
        desc: "Высокая европейская и итальянская гастрономия от мишленовских шеф-поваров в утонченном аристократичном интерьере.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
        schedule: [
          { meal: "Бизнес-ланч", time: "13:00 – 16:00" },
          { meal: "Гастрономический ужин", time: "19:00 – 00:00" },
        ],
        menu: [
          {
            category: "Основное меню",
            icon: ChefHat,
            items: [
              { name: "Филе-Миньон под трюфельным соусом", price: "65 AZN", desc: "Премиальная вырезка говядины с пюре из топинамбура и соусом на основе лесных грибов.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
              { name: "Ризотто с лобстером", price: "38 AZN", desc: "Итальянский рис Арборио с мясом свежего лобстера и тертым пармезаном.", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80" },
            ],
          },
          {
            category: "Десерты",
            icon: Utensils,
            items: [
              { name: "Шоколадный Фондан", price: "16 AZN", desc: "Теплый десерт с жидкой сердцевиной и шариком мадагаскарской ванили.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "aqua",
        name: "Aqua Lounge & Bar",
        desc: "Атмосферный лаундж у бассейна. Идеальное место для отдыха под открытым небом, легких закусок и авторских коктейлей.",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1000&q=80",
        schedule: [
          { meal: "Закуски и Снеки", time: "11:00 – 19:00" },
          { meal: "Коктейли и Кальян", time: "18:00 – 02:00" },
        ],
        menu: [
          {
            category: "Снеки и Закуски",
            icon: Utensils,
            items: [
              { name: "Салат Цезарь с цыпленком", price: "18 AZN", desc: "Хрустящие листья романо, фирменный соус, гренки и пармезановые чипсы.", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
              { name: "AF Клаб-Сэндвич", price: "16 AZN", desc: "Классический трехслойный сэндвич с индейкой, беконом и картофелем фри.", image: "https://images.unsplash.com/photo-1568899694158-ba6f2676f130?w=400&q=80" },
            ],
          },
          {
            category: "Барная карта",
            icon: Wine,
            items: [
              { name: "Коктейль 'Baku Sunset'", price: "18 AZN", desc: "Премиальный джин, свежий грейпфрутовый тоник, экстракт граната.", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80" },
            ],
          },
        ],
      },
    ],
  },
  az: {
    tag: "RESTORANLARIMIZ & BAR",
    title: "Unudulmaz Qastrofəza Səyahəti",
    subtitle: "AF Hotel & Resort ərazisində istirahətinizin hər anı üçün yaradılmış unikal konseptual məkanlar.",
    hours: "İş saatları",
    reserve: "Rezerv et",
    call: "Zəng et",
    viewMenu: "Menyu ilə tanış olun",
    searchPlaceholder: "Menyuda axtar...",
    noResults: "Təam tapılmadı.",
    restaurants: [
      {
        id: "caspian",
        name: "Caspian Breeze",
        desc: "Xəzər dənizinin füsunkar panoraması fonunda ən təzə dəniz məhsulları və orijinal Azərbaycan mətbəxinin inciləri.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
        schedule: [
          { meal: "Səhər yeməyi (Açıq büfe)", time: "07:00 – 11:00" },
          { meal: "Nahar (A la Carte)", time: "12:00 – 15:00" },
          { meal: "Şam yeməyi (Canlı musiqi)", time: "18:00 – 23:00" },
        ],
        menu: [
          {
            category: "Səhər Yeməkləri",
            icon: Coffee,
            items: [
              { name: "AF Premium Büfe", price: "35 AZN", desc: "Açıq büfe formatında milli və Avropa mətbəxinin geniş çeşidləri.", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80" },
              { name: "Ənənəvi Azərbaycan Səhər Yeməyi", price: "25 AZN", desc: "Ev pendiri, şor, qaymaq, dağ balı, kənd kərə yağı və isti təndir çörəyi.", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb18865?w=400&q=80" },
              { name: "Təzə Göyərti ilə Kükü", price: "12 AZN", desc: "Bol ətirli göyərti və kənd yumurtalarından hazırlanmış ənənəvi kükü.", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80" },
            ],
          },
          {
            category: "Nahar və Şam",
            icon: ChefHat,
            items: [
              { name: "Xəzər Şah Plovu", price: "45 AZN", desc: "Xırçıltılı qazmaqda, ədviyyatlar, zərif quzu əti və şabalıd ilə kral plovu.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
              { name: "Kömürdə Nərə Balığı", price: "55 AZN", desc: "Xəzər nərə balığının şirəli steykləri, narşarab və limon ilə təqdim olunur.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80" },
              { name: "Yarpaq Dolması", price: "18 AZN", desc: "Zərif quzu ətindən bükülmüş miniatür dolma, sarımsaqlı qatıq ilə təqdim olunur.", image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "sapphire",
        name: "Sapphire Fine Dining",
        desc: "Zərif aristokratik interyerdə Mişlen ulduzlu şef-aşpazlardan yüksək Avropa və İtalyan qastronomiyası.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
        schedule: [
          { meal: "Biznes nahar", time: "13:00 – 16:00" },
          { meal: "Qastronomik şam yeməyi", time: "19:00 – 00:00" },
        ],
        menu: [
          {
            category: "Əsas Menyu",
            icon: ChefHat,
            items: [
              { name: "Trüfel Souslu File Minyon", price: "65 AZN", desc: "Yerarmudu pürəsi və meşə göbələkləri sousu ilə premium mal əti piri.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
              { name: "Homar ilə Rizotto", price: "38 AZN", desc: "Təzə homar əti və sürtgəcdən keçirilmiş parmezan ilə İtalyan Arborio düyüsü.", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80" },
            ],
          },
          {
            category: "Desertlər",
            icon: Utensils,
            items: [
              { name: "Şokoladlı Fondan", price: "16 AZN", desc: "İsti şokolad nüvəli desert, Madaqaskar vanilli dondurma topu ilə.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "aqua",
        name: "Aqua Lounge & Bar",
        desc: "Hovuz kənarında atmosferli qəlyenaltı məkanı. Açıq səmada dincəlmək, yüngül qəlyanaltılar və müəllif kokteylləri üçün ideal yer.",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1000&q=80",
        schedule: [
          { meal: "Qəlyanaltılar və Snek", time: "11:00 – 19:00" },
          { meal: "Kokteyllər və Qəlyan", time: "18:00 – 02:00" },
        ],
        menu: [
          {
            category: "Sneklər",
            icon: Utensils,
            items: [
              { name: "Toyuqlu Sezar Salatı", price: "18 AZN", desc: "Xırtıldayan romano yarpaqları, xüsusi sous, suxarı və parmezan çipsləri.", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
              { name: "AF Klab-Sendviç", price: "16 AZN", desc: "Hinduşka əti, bekon və kartof fri ilə klassik üçqat sendviç.", image: "https://images.unsplash.com/photo-1568899694158-ba6f2676f130?w=400&q=80" },
            ],
          },
          {
            category: "Bar Menyusu",
            icon: Wine,
            items: [
              { name: "Klub Kokteyli 'Baku Sunset'", price: "18 AZN", desc: "Premium cin, təzə qreypfrut toniki, nar ekstraktı.", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80" },
            ],
          },
        ],
      },
    ],
  },
  en: {
    tag: "OUR RESTAURANTS & BAR",
    title: "An Unforgettable Dining Journey",
    subtitle: "Unique conceptual spaces within AF Hotel & Resort, crafted for every moment of your leisure.",
    hours: "Opening Hours",
    reserve: "Book a Table",
    call: "Call Us",
    viewMenu: "Explore Menu",
    searchPlaceholder: "Search menu...",
    noResults: "Dish not found.",
    restaurants: [
      {
        id: "caspian",
        name: "Caspian Breeze",
        desc: "The freshest seafood and authentic Azerbaijani culinary masterpieces set against a mesmerizing panoramic view of the Caspian Sea.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
        schedule: [
          { meal: "Breakfast (Open Buffet)", time: "07:00 – 11:00" },
          { meal: "Lunch (A la Carte)", time: "12:00 – 15:00" },
          { meal: "Dinner (Live Music)", time: "18:00 – 23:00" },
        ],
        menu: [
          {
            category: "Breakfast",
            icon: Coffee,
            items: [
              { name: "AF Premium Buffet", price: "35 AZN", desc: "A wide selection of national and European dishes served in an open buffet format.", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80" },
              { name: "Traditional Azerbaijani Breakfast", price: "25 AZN", desc: "Homemade cheese, shor, kaymak, mountain honey, village butter, and hot tandoor bread.", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb18865?w=400&q=80" },
              { name: "Kuku with Fresh Herbs", price: "12 AZN", desc: "A traditional fluffy omelet made from village eggs with an abundance of aromatic herbs.", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80" },
            ],
          },
          {
            category: "Lunch & Dinner",
            icon: ChefHat,
            items: [
              { name: "Caspian Shah Plov", price: "45 AZN", desc: "A royal pilaf featuring delicate lamb, chestnuts, and rich spices enveloped in a crispy crust.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
              { name: "Charcoal Grilled Sturgeon", price: "55 AZN", desc: "Juicy Caspian sturgeon steaks served with traditional narsharab (pomegranate sauce) and lemon.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80" },
              { name: "Grape Leaf Dolma", price: "18 AZN", desc: "Miniature dolma made from tender minced lamb, perfectly complemented by garlic matsoni.", image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "sapphire",
        name: "Sapphire Fine Dining",
        desc: "Exquisite European and Italian haute gastronomie crafted by Michelin-starred chefs in a sophisticated, aristocratic interior.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
        schedule: [
          { meal: "Business Lunch", time: "13:00 – 16:00" },
          { meal: "Gastronomic Dinner", time: "19:00 – 00:00" },
        ],
        menu: [
          {
            category: "Main Menu",
            icon: ChefHat,
            items: [
              { name: "Filet Mignon with Truffle Sauce", price: "65 AZN", desc: "Premium beef tenderloin served with Jerusalem artichoke puree and a rich wild mushroom sauce.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
              { name: "Lobster Risotto", price: "38 AZN", desc: "Italian Arborio rice cooked with fresh lobster meat and finished with grated parmesan cheese.", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80" },
            ],
          },
          {
            category: "Desserts",
            icon: Utensils,
            items: [
              { name: "Chocolate Fondant", price: "16 AZN", desc: "A warm dessert featuring a molten chocolate core, served with a scoop of Madagascar vanilla bean ice cream.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
            ],
          },
        ],
      },
      {
        id: "aqua",
        name: "Aqua Lounge & Bar",
        desc: "An atmospheric lounge right by the pool. The ideal spot for open-air relaxation, light bites, and signature cocktails.",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1000&q=80",
        schedule: [
          { meal: "Bites & Snacks", time: "11:00 – 19:00" },
          { meal: "Cocktails & Hookah", time: "18:00 – 02:00" },
        ],
        menu: [
          {
            category: "Snacks",
            icon: Utensils,
            items: [
              { name: "Chicken Caesar Salad", price: "18 AZN", desc: "Crisp romaine lettuce, signature dressing, golden croutons, and delicate parmesan chips.", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
              { name: "AF Club Sandwich", price: "16 AZN", desc: "A classic triple-decker sandwich layered with turkey, bacon, and served with a side of french fries.", image: "https://images.unsplash.com/photo-1568899694158-ba6f2676f130?w=400&q=80" },
            ],
          },
          {
            category: "Bar Card",
            icon: Wine,
            items: [
              { name: "Signature Cocktail 'Baku Sunset'", price: "18 AZN", desc: "Premium gin, crisp grapefruit tonic, and a vibrant touch of pomegranate extract.", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80" },
            ],
          },
        ],
      },
    ],
  },
};

export default function Restoran() {
  const { language } = useLanguage();
  const l = (language as LangType) || "ru";

  // Используем контент выбранного языка. Если что-то пошло не так, делаем фолбек на русский
  const c = content[l] || content.ru;

  const [activeRest, setActiveRest] = useState<number>(0);
  const [activeMenuTab, setActiveMenuTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentRestaurant = c.restaurants[activeRest] || c.restaurants[0];
  const activeMenu = currentRestaurant?.menu[activeMenuTab] || currentRestaurant?.menu[0];

  const handleRestaurantChange = (index: number) => {
    setActiveRest(index);
    setActiveMenuTab(0);
    setSearchQuery("");
  };

  const filteredItems = activeMenu?.items.filter((item: MenuItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <section id="restoran" className="py-24 md:py-32 bg-[#fdfcf7] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-12 md:space-y-16">
        
        {/* Заголовок */}
        <ScrollReveal direction="up" delay={0.1} className="text-center space-y-3">
          <span className="text-[#00b5d5] text-[11px] font-bold tracking-[0.35em] uppercase block">
            {c.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif tracking-tight">
            {c.title}
          </h2>
          <p className="text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
            {c.subtitle}
          </p>
        </ScrollReveal>

        {/* Навигация по ресторанам */}
        <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap justify-center gap-2 p-1.5 bg-stone-100 max-w-2xl mx-auto rounded-2xl border border-stone-200/40">
          {c.restaurants.map((rest: RestaurantData, idx: number) => (
            <button
              key={rest.id}
              onClick={() => handleRestaurantChange(idx)}
              className={`flex-1 min-w-35 text-center px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer border-none bg-transparent ${
                activeRest === idx ? "bg-white text-[#1e325c] shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {rest.name}
            </button>
          ))}
        </ScrollReveal>

        {/* Главная Сетка */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Левая инфо-панель */}
          <ScrollReveal direction="left" delay={0.3} className="lg:col-span-5 space-y-6">
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-md group">
              <Image
                src={currentRestaurant.image}
                alt={currentRestaurant.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
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
                {currentRestaurant.desc}
              </p>
              <hr className="border-stone-100" />
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#1e325c] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#00b5d5]" />
                  {c.hours}
                </h4>
                <div className="space-y-2 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                  {currentRestaurant.schedule.map((s: ScheduleItem, i: number) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-stone-500 font-medium">{s.meal}</span>
                      <span className="font-bold text-[#1e325c]">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a href="tel:+994124480000" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1e325c] hover:bg-[#162545] text-white text-xs font-bold rounded-xl transition-colors shadow-xs">
                  <Calendar className="w-3.5 h-3.5" /> {c.reserve}
                </a>
                <a href="tel:+994124480000" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold rounded-xl transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#00b5d5]" /> {c.call}
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Правая часть: Меню */}
          <ScrollReveal direction="right" delay={0.4} className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-stone-200/60 pb-3">
              <h3 className="text-lg font-serif font-bold text-[#1e325c] tracking-wide flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#00b5d5]" />
                {c.viewMenu}
              </h3>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex gap-1">
                  {currentRestaurant.menu.map((cat: MenuCategory, idx: number) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => { setActiveMenuTab(idx); setSearchQuery(""); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                          activeMenuTab === idx ? "bg-[#00b5d5] text-white shadow-xs" : "bg-stone-100 text-stone-500 hover:bg-stone-200/70"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{cat.category}</span>
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

            {/* Контейнер для блюд */}
            <div className="max-h-145 overflow-y-auto pr-2 space-y-3.5 scrollbar-thin scrollbar-thumb-stone-200/80">
              {filteredItems.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item: MenuItem, i: number) => (
                      <motion.div
                        layout
                        key={item.name}
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
                            {item.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 font-medium leading-normal line-clamp-2 md:line-clamp-3">
                          {item.desc}
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
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}