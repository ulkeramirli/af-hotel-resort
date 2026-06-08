'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// tipi vseqo sayta
interface TranslationStructure {
  nav: {
    rooms: string;
    aquapark: string;
    dining: string;
    booking: string;
    button: string;
  };
  hero: {
    title: string;
    subtitle: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    search: string;
  };
  about: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
    more: string;
  };
  rooms: {
    tag: string;
    moreInfo: string;
  };
  features: {
    aquaTag: string;
    aquaTitle: string;
    aquaItems: Array<{ title: string; desc: string }>;
    diningTag: string;
    diningTitle: string;
    diningItems: Array<{ title: string; desc: string }>;
  };
}

interface LanguageContextType {
  lang: string;
  setLang: (lang: 'az' | 'en' | 'ru') => void;
  t: TranslationStructure;
}

// yaziki i perevodi dlya vsego sayta, chtoby ne duplikirovat tekst v komponentax i ne delat tolko dlya hero, a dlya vsego kontenta, chtoby v budushem legko bylo dobavlyat novye yazyki ili redaktirovat sushestvuyushie bez riskov propustit gde-to tekst
const translations: Record<'az' | 'en' | 'ru', TranslationStructure> = {
  az: {
    nav: {
      rooms: "Otaqlar",
      aquapark: "Akvapark",
      dining: "Restoranlar",
      booking: "Rezervasiya",
      button: "Sifariş Et"
    },
    hero: {
      title: "Xəyallarınızdakı Xəzər Sahili Tətili",
      subtitle: "Bakının ən prestijli ailəvi kurortunda unudulmaz anlar yaşayın. Komfortlu otaqlar, nəhəng akvapark və təmiz dəniz havası sizi gözləyir.",
      checkIn: "Giriş Tarixi",
      checkOut: "Çıxış Tarixi",
      guests: "Qonaqlar",
      search: "Otaqları Yoxla"
    },
    about: {
      tag: "BİZİM HEKAYƏMİZ",
      title: "AF Hotel & Aqua Park-a Xoş Gəlmisiniz",
      p1: "Novxanı qəsəbəsinin mənzərəli Xəzər sahili boyunca yerləşən AF Hotel & Aqua Park istirahət, əyləncə və qüsursuz qonaqpərvərliyin unikal harmoniyasını təqdim edir. Bura müasir memarlıq komfortu ilə Xəzər təbiətinin möhtəşəmliyinin qovuşduğu məkandır.",
      p2: "Kompleksimiz qonaqlara dünya səviyyəli infrastruktur təklif edir: geniş və lüks otaqlar, ekstremal attraksionları olan möhtəşəm açıq akvapark, müəllif mətbəxli restoranlar və təmiz qumlu şəxsi çimərlik zonası.",
      more: "Otaqlara Baxın"
    },
    rooms: {
      tag: "LÜKS YAŞAYIŞ",
      moreInfo: "Ətraflı Məlumat"
    },
    features: {
      aquaTag: "ƏYLƏNCƏ MƏRKƏZİ",
      aquaTitle: "Unudulmaz Akvapark Macərası",
      aquaItems: [
        { title: "Ekstremal Təpələr", desc: "Adrenalin sevənlər üçün yüksək sürətli açıq və qapalı su sürüşkənləri." },
        { title: "Ailəvi Hovuzlar", desc: "Bütün ailə üzvləri üçün geniş, təmiz və təhlükəsiz böyük üzmə hovuzları." },
        { title: "Uşaq Zonası", desc: "Balaca qonaqlarımız üçün xüsusi fəvvarələr, mini-slaydlar və təhlükəsiz su oyun sahəsi." }
      ],
      diningTag: "QASTRO-SƏYAHƏT",
      diningTitle: "Eleqant Restoranlar və Dadlar",
      diningItems: [
        { title: "Xəzər Sahili Restoranı", desc: "Təzə dəniz məhsulları və milli mətbəxin ən ləziz təamları birbaşa dəniz mənzərəsi ilə." },
        { title: "Aqua Bar & Lounge", desc: "Hovuz kənarında gün boyu təravətləndirici tropik kokteyllər, sneklər və yüngül qəlyanaltılar." }
      ]
    }
  },
  en: {
    nav: {
      rooms: "Rooms",
      aquapark: "Aqua Park",
      dining: "Dining",
      booking: "Booking",
      button: "Book Now"
    },
    hero: {
      title: "Your Dream Caspian Escape",
      subtitle: "Discover unforgettable moments at Baku's premier family resort. Luxurious accommodations, a massive water park, and clean sea breeze await you.",
      checkIn: "Check In",
      checkOut: "Check Out",
      guests: "Guests",
      search: "Check Rooms"
    },
    about: {
      tag: "DISCOVER OUR STORY",
      title: "Welcome to AF Hotel & Aqua Park",
      p1: "Situated along the scenic Caspian coastline in Novkhani, AF Hotel & Aqua Park offers a unique sanctuary of leisure, entertainment, and pristine hospitality. This is where contemporary architectural comfort perfectly intertwines with natural coastal grandeur.",
      p2: "Our resort provides guests with a world-class infrastructure: spacious luxury suites, a massive outdoor water park featuring adrenaline-pumping slides, signature dining destinations, and an expansive private sandy beach stretch.",
      more: "Explore Accommodation"
    },
    rooms: {
      tag: "PREMIUM LIVING",
      moreInfo: "More Info"
    },
    features: {
      aquaTag: "AMUSEMENT PARK",
      aquaTitle: "High-Adrenaline Aqua Experience",
      aquaItems: [
        { title: "Extreme Slides", desc: "High-speed open and enclosed water tunnels built for ultimate thrill-seekers." },
        { title: "Grand Family Pools", desc: "Spacious, highly filtered swimming pools designed for absolute relaxation." },
        { title: "Kids Water Splash", desc: "Safe aquatic playground equipped with interactive mini-slides and fountains." }
      ],
      diningTag: "HAUTE GASTRONOMY",
      diningTitle: "Signature Culinary Hubs",
      diningItems: [
        { title: "Caspian Sea Restaurant", desc: "Fresh premium seafood selections alongside traditional delicacies with open sea vistas." },
        { title: "Aqua Bar & Lounge", desc: "Poolside refreshments offering curated tropical cocktails, quick bites, and ice-creams." }
      ]
    }
  },
  ru: {
    nav: {
      rooms: "Номера",
      aquapark: "Аквапарк",
      dining: "Рестораны",
      booking: "Бронь",
      button: "Заказать"
    },
    hero: {
      title: "Пляжный Отдых Вашей Мечты на Каспии",
      subtitle: "Проведите незабываемые дни в главном семейном курорте Баку. Вас ждут роскошные номера, масштабный аквапарк и чистейший морской бриз.",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      guests: "Гости",
      search: "Проверить"
    },
    about: {
      tag: "НАША ИСТОРИЯ",
      title: "Добро пожаловать в AF Hotel & Aqua Park",
      p1: "Расположенный на живописном побережье Каспийского моря в курортном поселке Новханы, AF Hotel & Aqua Park представляет собой уникальный оазис отдыха, развлечений и безупречного гостеприимства. Это место, где встречаются современный комфорт и величие природы.",
      p2: "Наш комплекс предлагает гостям развитую инфраструктуру мирового класса: роскошные просторные номера, масштабный открытый аквапарк с экстремальными горками, великолепные рестораны с авторской кухней и протяженную полосу частного песчаного пляжа.",
      more: "Посмотреть номера"
    },
    rooms: {
      tag: "ЛЮКС ПРОЖИВАНИЕ",
      moreInfo: "Подробнее"
    },
    features: {
      aquaTag: "ЦЕНТР РАЗВЛЕЧЕНИЙ",
      aquaTitle: "Захватывающий Мир Аквапарка",
      aquaItems: [
        { title: "Экстремальные Горки", desc: "Высокоскоростные открытые и закрытые водные туннели для любителей адреналина." },
        { title: "Семейные Бассейны", desc: "Просторные, глубоко очищаемые плавательные бассейны для идеального отдыха всей семьи." },
        { title: "Детская Аква-Зона", desc: "Безопасный игровой городок на воде с интерактивными мини-горками и фонтанами." }
      ],
      diningTag: "ВЫСОКАЯ КУХНЯ",
      diningTitle: "Изысканные Рестораны и Вкусы",
      diningItems: [
        { title: "Ресторан Caspian Sea", desc: "Свежие морепродукты премиум-класса и блюда национальной кухни с панорамным видом на море." },
        { title: "Aqua Bar & Lounge", desc: "Освежающий бар у бассейна, предлагающий тропические коктейли, легкие закуски и десерты." }
      ]
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'az' | 'en' | 'ru'>('az');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}