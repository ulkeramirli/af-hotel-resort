"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "az" | "ru" | "en";

// Строгий рекурсивный тип для словаря любой вложенности без использования explicit any
export interface TranslationSchema {
  about: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
    more: string;
  };

  rooms: {
    moreInfo: string;
  };

  features: {
    restoranTag: string;
    restoranTitle: string;
    restoranItems: Array<{ title: string; desc: string }>;
    aquaTag: string;
    aquaTitle: string;
    aquaItems: Array<{ title: string; desc: string }>;
  };

  nav: {
    home: string;
    rooms: string;
    restoran: string;
    aquapark: string;
    contacts: string;
  };
}

interface LanguageContextType {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: TranslationSchema;
}

// Дефолтный словарь для предотвращения undefined при инициализации
const defaultTranslations: TranslationSchema = {
  about: {
    tag: "HAQQINDA",
    title: "BİZİM HİKAYƏMİZ",
    p1: "Birbaşa təcrübə və həyata keçirilmiş təcrübə.",
    p2: "Ən yaxşı xidmət və qeyri-müəyyən təcrübə.",
    more: "Ətraflı məlumat"
  },
  rooms: { moreInfo: "Ətraflı məlumat" },
  features: {
    restoranTag: "RESTORAN VƏ UTAM",
    restoranTitle: "UNUDULMAZ DAT TƏCRÜBƏSİ.",
    restoranItems: [],
    aquaTag: "ƏYLƏNCƏ VƏ ADRENALİN",
    aquaTitle: "XƏZƏRİN ƏN BÖYÜK AQUAPARKI.",
    aquaItems: []
  },
  nav: { home: "Ana Səhifə", rooms: "Otaqlar", restoran: "Restoran", aquapark: "Akvapark", contacts: "Əlaqə" }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "az",
  setLanguage: () => {},
  t: defaultTranslations,
});

const translations: Record<Lang, TranslationSchema> = {
  az: {
    about: {
      tag: "HAQQINDA",
      title: "BİZİM HİKAYƏMİZ",
      p1: "Birbaşa təcrübə və həyata keçirilmiş təcrübə.",
      p2: "Ən yaxşı xidmət və qeyri-müəyyən təcrübə.",
      more: "Ətraflı məlumat"
    },
    rooms: { moreInfo: "Ətraflı məlumat" },
    features: {
      restoranTag: "RESTORAN VƏ UTAM",
      restoranTitle: "UNUDULMAZ DAT TƏCRÜBƏSİ.",
      restoranItems: [
        { title: "A la Carte Restoran", desc: "Zərif dadlar və beynəlxalq mətbəx." },
        { title: "Dəniz Kənarı Bar", desc: "Sərinləşdirici içkilər və dəniz mənzərəsi." }
      ],
      aquaTag: "ƏYLƏNCƏ VƏ ADRENALİN",
      aquaTitle: "XƏZƏRİN ƏN BÖYÜK AQUAPARKI.",
      aquaItems: [
        { title: "Ekstremal Sürüşkənlər", desc: "Adrenalin sevənlər üçün yüksək sürətli slaydlar." },
        { title: "Ailəvi Hovuz", desc: "Bütün ailə üçün təhlükəsiz və geniş hovuz sahəsi." },
        { title: "Uşaq Dünyası", desc: "Balacalar üçün xüsusi su oyun xidmətləri." }
      ]
    },
    nav: { home: "Ana Səhifə", rooms: "Otaqlar", restoran: "Restoran", aquapark: "AquaPark", contacts: "Əlaqə" }
  },
  ru: {
    about: {
      tag: "О НАС",
      title: "НАША ИСТОРИЯ",
      p1: "Прямой опыт и реализованные впечатления.",
      p2: "Лучший сервис и незабываемые ощущения.",
      more: "Подробнее"
    },
    rooms: { moreInfo: "Подробнее" },
    features: {
      restoranTag: "РЕСТОРАНЫ И ГАСТРОНОМИЯ",
      restoranTitle: "НЕЗАБЫВАЕМЫЙ ВКУСОВОЙ ОПЫТ.",
      restoranItems: [
        { title: "Ресторан A la Carte", desc: "Изысканные вкусы и международная кухня." },
        { title: "Бар у моря", desc: "Прохладительные напитки и вид на море." }
      ],
      aquaTag: "РАЗВЛЕЧЕНИЯ И АДРЕНАЛИН",
      aquaTitle: "САМЫЙ БОЛЬШОЙ АКВАПАРК НА КАСПИИ.",
      aquaItems: [
        { title: "Экстремальные горки", desc: "Высокоскоростные горки для любителей адреналина." },
        { title: "Семейный бассейн", desc: "Безопасная и просторная зона для всей семьи." },
        { title: "Детский мир", desc: "Специальные водные аттракционы для малышей." }
      ]
    },
    nav: { home: "Главная", rooms: "Номера", restoran: "Ресторан", aquapark: "Aквапарк", contacts: "Контакты" }
  },
  en: {
    about: {
      tag: "ABOUT",
      title: "OUR STORY",
      p1: "Direct experience and realized expertise.",
      p2: "The best service and unforgettable experience.",
      more: "More Info"
    },
    rooms: { moreInfo: "More Info" },
    features: {
      restoranTag: "RESTORAN & GASTRONOMY",
      restoranTitle: "AN UNFORGETTABLE CULINARY JOURNEY.",
      restoranItems: [
        { title: "A la Carte Restaurant", desc: "Exquisite flavors and international cuisine." },
        { title: "Seaside Bar", desc: "Refreshing drinks with a stunning sea view." }
      ],
      aquaTag: "FUN AND ADRENALINE",
      aquaTitle: "THE LARGEST AQUAPARK ON THE CASPIAN.",
      aquaItems: [
        { title: "Extreme Slides", desc: "High-speed slides for adrenaline seekers." },
        { title: "Family Pool", desc: "A safe and spacious swimming area for the whole family." },
        { title: "Kids World", desc: "Special water attractions designed for the little ones." }
      ]
    },
    nav: { home: "Home", rooms: "Rooms", restoran: "Restoran", aquapark: "Aquapark", contacts: "Contacts" }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("az");
  const t = translations[language] ?? translations.az;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);