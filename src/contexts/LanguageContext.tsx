"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { az } from "@/dictionaries/az";
import { ru } from "@/dictionaries/ru";
import { en } from "@/dictionaries/en";

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
    reviews: string;
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
    line1: string;
    line2: string;
    sub: string;
    f1: string;
    f2: string;
    f3: string;
    f4: string;
    btnRooms: string;
    statRooms: string;
    statAqua: string;
    statRating: string;
    review: string;
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
    subscribeTitle: string;
    subscribeDesc: string;
    placeholder: string;
    subBtn: string;
    aboutUs: string;
    waterSlides: string;
    poolsideBars: string;
    privateBeach: string;
    privacyPolicy: string;
    termsOfUse: string;
    bookingPolicy: string;
    cookiePolicy: string;
    desc: string;
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

const translations: Record<Lang, TranslationSchema> = { az, ru, en };

const LanguageContext = createContext<LanguageContextType>({
  language: "az",
  setLanguage: () => {},
  t: az,
});

const LANG_KEY = "af_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>("az");

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Lang | null;

    if (langParam && ["az", "ru", "en"].includes(langParam)) {
      setLanguageState(langParam);
      sessionStorage.setItem(LANG_KEY, langParam);
    } else {
      // Use sessionStorage so language resets to default 'az' on a fresh open,
      // while still persisting across page reloads in the same session.
      const saved = sessionStorage.getItem(LANG_KEY) as Lang | null;
      if (saved && ["az", "ru", "en"].includes(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(saved);
      } else {
        sessionStorage.setItem(LANG_KEY, "az");
      }

    }
  }, []);

  const setLanguage = (lang: Lang) => {
    setLanguageState(lang);
    sessionStorage.setItem(LANG_KEY, lang);
  };

  const t = translations[language] ?? translations.az;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);