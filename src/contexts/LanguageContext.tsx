"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "az" | "ru" | "en";

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
    about: string;
    wonderland: string;
    book: string;
    login: string;
    myAccount: string;
    myBookings: string;
    favorites: string;
    logout: string;
  };

  header: {
    phone: string;
  };

  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    bookBtn: string;
    exploreBtn: string;
    scrollDown: string;
  };

  booking: {
    title: string;
    subtitle: string;
    checkIn: string;
    checkOut: string;
    name: string;
    email: string;
    phone: string;
    room: string;
    selectRoom: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };

  footer: {
    rights: string;
    quickLinks: string;
    contact: string;
    followUs: string;
    address: string;
  };

  contacts: {
    tag: string;
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    hoursVal: string;
  };

  reviews: {
    tag: string;
    title: string;
    subtitle: string;
    write: string;
    name: string;
    emailOrPhone: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    pending: string;
  };
}

interface LanguageContextType {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: TranslationSchema;
}

const defaultTranslations: TranslationSchema = {
  about: {
    tag: "HAQQINDA",
    title: "BİZİM HİKAYƏMİZ",
    p1: "Birbaşa təcrübə və həyata keçirilmiş təcrübə.",
    p2: "Ən yaxşı xidmət və qeyri-müəyyən təcrübə.",
    more: "Ətraflı məlumat",
  },
  rooms: { moreInfo: "Ətraflı məlumat" },
  features: {
    restoranTag: "RESTORAN VƏ UTAM",
    restoranTitle: "UNUDULMAZ DAT TƏCRÜBƏSİ.",
    restoranItems: [],
    aquaTag: "ƏYLƏNCƏ VƏ ADRENALİN",
    aquaTitle: "XƏZƏRİN ƏN BÖYÜK AQUAPARKI.",
    aquaItems: [],
  },
  nav: {
    home: "Ana Səhifə",
    rooms: "Otaqlar",
    restoran: "Restoran",
    aquapark: "AquaPark",
    contacts: "Əlaqə",
    about: "Haqqımızda",
    wonderland: "Wonderland",
    book: "REZERV ET",
    login: "Daxil ol",
    myAccount: "Mənim hesabım",
    myBookings: "Bronlarım",
    favorites: "Sevimlilər",
    logout: "Çıxış",
  },
  header: { phone: "+994 (12) 448-00-00" },
  hero: {
    tagline: "5 Ulduzlu Otel & AquaPark",
    title: "AF Hotel & Aqua Park Resort",
    subtitle: "Xəzər dənizinin sahilindəki misli görünməmiş lüks istirahət məkanı",
    bookBtn: "İndi Rezerv Et",
    exploreBtn: "Kəşf Et",
    scrollDown: "Aşağı Sürüşdür",
  },
  booking: {
    title: "Rezervasiya",
    subtitle: "Otağınızı seçin və tarixi təyin edin",
    checkIn: "Giriş tarixi",
    checkOut: "Çıxış tarixi",
    name: "Adınız",
    email: "Email",
    phone: "Telefon",
    room: "Otaq",
    selectRoom: "Otaq seçin",
    submit: "Rezerv Et",
    submitting: "Göndərilir...",
    success: "Rezervasiyanız uğurla yaradıldı!",
    error: "Xəta baş verdi. Yenidən cəhd edin.",
  },
  footer: {
    rights: "Bütün hüquqlar qorunur",
    quickLinks: "Sürətli Keçidlər",
    contact: "Əlaqə",
    followUs: "Bizi izləyin",
    address: "Neftçala şoseyi, Bakı, Azərbaycan",
  },
  contacts: {
    tag: "ƏLAQƏ",
    title: "Bizimlə Əlaqə Saxlayın",
    subtitle: "Hər hansı bir sualınız varsa, bizimlə əlaqə saxlamaqdan çəkinməyin",
    address: "Ünvan",
    phone: "Telefon",
    email: "Email",
    hours: "İş saatları",
    hoursVal: "24/7 açıqdır",
  },
  reviews: {
    tag: "RƏYLƏRİMİZ",
    title: "Qonaqlarımızın Rəyləri",
    subtitle: "Müştərilərimizin dəyərli fikirləri",
    write: "Rəy yaz",
    name: "Adınız",
    emailOrPhone: "Email və ya telefon",
    message: "Mesajınız",
    submit: "Göndər",
    submitting: "Göndərilir...",
    success: "Rəyiniz üçün təşəkkür edirik!",
    error: "Xəta baş verdi",
    pending: "Rəyiniz moderasiyadan sonra yayımlanacaq",
  },
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
      p2: "Ən yaxşı xidmət və unudulmaz təcrübə.",
      more: "Ətraflı məlumat",
    },
    rooms: { moreInfo: "Ətraflı məlumat" },
    features: {
      restoranTag: "RESTORAN VƏ QASTRONOMI",
      restoranTitle: "UNUDULMAZ DAD TƏCRÜBƏSİ.",
      restoranItems: [
        { title: "A la Carte Restoran", desc: "Zərif dadlar və beynəlxalq mətbəx." },
        { title: "Dəniz Kənarı Bar", desc: "Sərinləşdirici içkilər və dəniz mənzərəsi." },
      ],
      aquaTag: "ƏYLƏNCƏ VƏ ADRENALİN",
      aquaTitle: "XƏZƏRİN ƏN BÖYÜK AQUAPARKI.",
      aquaItems: [
        { title: "Ekstremal Sürüşkənlər", desc: "Adrenalin sevənlər üçün yüksək sürətli slaydlar." },
        { title: "Ailəvi Hovuz", desc: "Bütün ailə üçün təhlükəsiz və geniş hovuz sahəsi." },
        { title: "Uşaq Dünyası", desc: "Balacalar üçün xüsusi su oyun xidmətləri." },
      ],
    },
    nav: {
      home: "ANA SƏHİFƏ",
      rooms: "OTAQLAR",
      restoran: "RESTORAN",
      aquapark: "AQUA PARK",
      contacts: "ƏLAQƏ",
      about: "HAQQIMIZDA",
      wonderland: "WONDERLAND",
      book: "REZERV ET",
      login: "Daxil ol",
      myAccount: "Mənim hesabım",
      myBookings: "Bronlarım",
      favorites: "Sevimlilər",
      logout: "Çıxış",
    },
    header: { phone: "+994 (12) 448-00-00" },
    hero: {
      tagline: "5 Ulduzlu Otel & AquaPark",
      title: "AF Hotel & Aqua Park Resort",
      subtitle: "Xəzər dənizinin sahilindəki misli görünməmiş lüks istirahət məkanı",
      bookBtn: "İndi Rezerv Et",
      exploreBtn: "Kəşf Et",
      scrollDown: "Aşağı Sürüşdür",
    },
    booking: {
      title: "Rezervasiya",
      subtitle: "Otağınızı seçin və tarixi təyin edin",
      checkIn: "Giriş tarixi",
      checkOut: "Çıxış tarixi",
      name: "Adınız",
      email: "Email",
      phone: "Telefon",
      room: "Otaq",
      selectRoom: "Otaq seçin",
      submit: "Rezerv Et",
      submitting: "Göndərilir...",
      success: "Rezervasiyanız uğurla yaradıldı!",
      error: "Xəta baş verdi. Yenidən cəhd edin.",
    },
    footer: {
      rights: "Bütün hüquqlar qorunur",
      quickLinks: "Sürətli Keçidlər",
      contact: "Əlaqə",
      followUs: "Bizi izləyin",
      address: "Neftçala şoseyi, Bakı, Azərbaycan",
    },
    contacts: {
      tag: "ƏLAQƏ",
      title: "Bizimlə Əlaqə Saxlayın",
      subtitle: "Hər hansı bir sualınız varsa, bizimlə əlaqə saxlamaqdan çəkinməyin",
      address: "Ünvan",
      phone: "Telefon",
      email: "Email",
      hours: "İş saatları",
      hoursVal: "24/7 açıqdır",
    },
    reviews: {
      tag: "RƏYLƏRİMİZ",
      title: "Qonaqlarımızın Rəyləri",
      subtitle: "Müştərilərimizin dəyərli fikirləri",
      write: "Rəy yaz",
      name: "Adınız",
      emailOrPhone: "Email və ya telefon",
      message: "Mesajınız",
      submit: "Göndər",
      submitting: "Göndərilir...",
      success: "Rəyiniz üçün təşəkkür edirik!",
      error: "Xəta baş verdi",
      pending: "Rəyiniz moderasiyadan sonra yayımlanacaq",
    },
  },
  ru: {
    about: {
      tag: "О НАС",
      title: "НАША ИСТОРИЯ",
      p1: "Прямой опыт и реализованные впечатления.",
      p2: "Лучший сервис и незабываемые ощущения.",
      more: "Подробнее",
    },
    rooms: { moreInfo: "Подробнее" },
    features: {
      restoranTag: "РЕСТОРАНЫ И ГАСТРОНОМИЯ",
      restoranTitle: "НЕЗАБЫВАЕМЫЙ ВКУСОВОЙ ОПЫТ.",
      restoranItems: [
        { title: "Ресторан A la Carte", desc: "Изысканные вкусы и международная кухня." },
        { title: "Бар у моря", desc: "Прохладительные напитки и вид на море." },
      ],
      aquaTag: "РАЗВЛЕЧЕНИЯ И АДРЕНАЛИН",
      aquaTitle: "САМЫЙ БОЛЬШОЙ АКВАПАРК НА КАСПИИ.",
      aquaItems: [
        { title: "Экстремальные горки", desc: "Высокоскоростные горки для любителей адреналина." },
        { title: "Семейный бассейн", desc: "Безопасная и просторная зона для всей семьи." },
        { title: "Детский мир", desc: "Специальные водные аттракционы для малышей." },
      ],
    },
    nav: {
      home: "ГЛАВНАЯ",
      rooms: "НОМЕРА",
      restoran: "РЕСТОРАН",
      aquapark: "АКВАПАРК",
      contacts: "КОНТАКТЫ",
      about: "О НАС",
      wonderland: "СТРАНА ЧУДЕС",
      book: "БРОНЬ",
      login: "Войти",
      myAccount: "Мой аккаунт",
      myBookings: "Мои брони",
      favorites: "Избранное",
      logout: "Выйти",
    },
    header: { phone: "+994 (12) 448-00-00" },
    hero: {
      tagline: "5-звёздочный отель и аквапарк",
      title: "AF Hotel & Aqua Park Resort",
      subtitle: "Непревзойдённое место роскошного отдыха на берегу Каспийского моря",
      bookBtn: "Забронировать сейчас",
      exploreBtn: "Исследовать",
      scrollDown: "Прокрутите вниз",
    },
    booking: {
      title: "Бронирование",
      subtitle: "Выберите номер и укажите даты",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      name: "Ваше имя",
      email: "Email",
      phone: "Телефон",
      room: "Номер",
      selectRoom: "Выберите номер",
      submit: "Забронировать",
      submitting: "Отправка...",
      success: "Ваше бронирование успешно создано!",
      error: "Произошла ошибка. Попробуйте ещё раз.",
    },
    footer: {
      rights: "Все права защищены",
      quickLinks: "Быстрые ссылки",
      contact: "Контакты",
      followUs: "Подписывайтесь",
      address: "Шоссе Нефтчала, Баку, Азербайджан",
    },
    contacts: {
      tag: "КОНТАКТЫ",
      title: "Свяжитесь с нами",
      subtitle: "Если у вас есть вопросы, не стесняйтесь обращаться к нам",
      address: "Адрес",
      phone: "Телефон",
      email: "Email",
      hours: "Часы работы",
      hoursVal: "Открыто 24/7",
    },
    reviews: {
      tag: "ОТЗЫВЫ",
      title: "Отзывы наших гостей",
      subtitle: "Ценные мнения наших клиентов",
      write: "Написать отзыв",
      name: "Ваше имя",
      emailOrPhone: "Email или телефон",
      message: "Ваше сообщение",
      submit: "Отправить",
      submitting: "Отправка...",
      success: "Спасибо за ваш отзыв!",
      error: "Произошла ошибка",
      pending: "Ваш отзыв будет опубликован после модерации",
    },
  },
  en: {
    about: {
      tag: "ABOUT",
      title: "OUR STORY",
      p1: "Direct experience and realized expertise.",
      p2: "The best service and unforgettable experience.",
      more: "More Info",
    },
    rooms: { moreInfo: "More Info" },
    features: {
      restoranTag: "RESTAURANT & GASTRONOMY",
      restoranTitle: "AN UNFORGETTABLE CULINARY JOURNEY.",
      restoranItems: [
        { title: "A la Carte Restaurant", desc: "Exquisite flavors and international cuisine." },
        { title: "Seaside Bar", desc: "Refreshing drinks with a stunning sea view." },
      ],
      aquaTag: "FUN AND ADRENALINE",
      aquaTitle: "THE LARGEST AQUAPARK ON THE CASPIAN.",
      aquaItems: [
        { title: "Extreme Slides", desc: "High-speed slides for adrenaline seekers." },
        { title: "Family Pool", desc: "A safe and spacious swimming area for the whole family." },
        { title: "Kids World", desc: "Special water attractions designed for the little ones." },
      ],
    },
    nav: {
      home: "HOME",
      rooms: "ROOMS",
      restoran: "RESTAURANT",
      aquapark: "AQUAPARK",
      contacts: "CONTACTS",
      about: "ABOUT",
      wonderland: "WONDERLAND",
      book: "BOOK NOW",
      login: "Sign In",
      myAccount: "My Account",
      myBookings: "My Bookings",
      favorites: "Favorites",
      logout: "Sign Out",
    },
    header: { phone: "+994 (12) 448-00-00" },
    hero: {
      tagline: "5-Star Hotel & AquaPark",
      title: "AF Hotel & Aqua Park Resort",
      subtitle: "The unrivalled luxury retreat on the shores of the Caspian Sea",
      bookBtn: "Book Now",
      exploreBtn: "Explore",
      scrollDown: "Scroll Down",
    },
    booking: {
      title: "Reservation",
      subtitle: "Select your room and set dates",
      checkIn: "Check-In Date",
      checkOut: "Check-Out Date",
      name: "Your Name",
      email: "Email",
      phone: "Phone",
      room: "Room",
      selectRoom: "Select a room",
      submit: "Book Now",
      submitting: "Submitting...",
      success: "Your reservation was successfully created!",
      error: "An error occurred. Please try again.",
    },
    footer: {
      rights: "All rights reserved",
      quickLinks: "Quick Links",
      contact: "Contact",
      followUs: "Follow Us",
      address: "Neftchala Highway, Baku, Azerbaijan",
    },
    contacts: {
      tag: "CONTACTS",
      title: "Get In Touch",
      subtitle: "If you have any questions, feel free to contact us",
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Working Hours",
      hoursVal: "Open 24/7",
    },
    reviews: {
      tag: "REVIEWS",
      title: "Our Guests' Reviews",
      subtitle: "Valuable opinions from our clients",
      write: "Write a Review",
      name: "Your Name",
      emailOrPhone: "Email or phone",
      message: "Your message",
      submit: "Submit",
      submitting: "Submitting...",
      success: "Thank you for your review!",
      error: "An error occurred",
      pending: "Your review will be published after moderation",
    },
  },
};

const LANG_KEY = "af_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>("az");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved && ["az", "ru", "en"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Lang) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  const t = translations[language] ?? translations.az;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);