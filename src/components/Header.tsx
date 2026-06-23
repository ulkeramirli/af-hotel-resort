"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, Menu, X, Phone, Heart, BookOpen } from "lucide-react";
import { getFavorites } from "@/lib/favorites";
import { useSettings } from "@/contexts/SettingsContext";

type LangType = "az" | "en" | "ru";

type AuthUser = {
  name?: string;
  email?: string;
};

const FlagIcon = ({ code }: { code: LangType }) => {
  if (code === "az")
    return (
      <svg
        className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0"
        viewBox="0 0 6 3"
      >
        <path fill="#24aad4" d="M0 0h6v1H0z" />
        <path fill="#ed2c34" d="M0 1h6v1H0z" />
        <path fill="#339966" d="M0 2h6v1H0z" />
        <circle cx="3" cy="1.5" r=".4" fill="#fff" />
        <circle cx="3.08" cy="1.5" r=".34" fill="#ed2c34" />
        <path
          fill="#fff"
          d="M3.15 1.32l.04.14.15-.02-.1.1.07.13-.12-.08-.12.08.06-.13-.1-.1.14.02z"
        />
      </svg>
    );
  if (code === "en")
    return (
      <svg
        className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0"
        viewBox="0 0 50 30"
      >
        <clipPath id="t">
          <path d="M0 0v30h50V0z" />
        </clipPath>
        <g clipPath="url(#t)">
          <path d="M0 0v30h50V0z" fill="#012169" />
          <path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6" />
          <path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4" />
          <path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10" />
          <path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6" />
        </g>
      </svg>
    );
  return (
    <svg
      className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0"
      viewBox="0 0 3 2"
    >
      <path fill="#fff" d="M0 0h3v2H0z" />
      <path fill="#0039a6" d="M0 .67h3v1.33H0z" />
      <path fill="#d52b1e" d="M0 1.33h3v.67H0z" />
    </svg>
  );
};

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const { user, signOut } = useAuth();
  const currentUser = user as AuthUser | null;
  const { language, setLanguage, t } = useLanguage();
  const currentLang = (language as LangType) || "az";
  const { settings } = useSettings();

  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    
    const updateCount = () => {
      if (typeof window !== "undefined") {
        setFavCount(getFavorites().length);
      }
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("favoritesChanged", updateCount);
    window.addEventListener("favoritesUpdated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("favoritesChanged", updateCount);
      window.removeEventListener("favoritesUpdated", updateCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    setActiveNav(id);
    if (id === "home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileNavOpen(false);
  };

  const navLinks = [
    { id: "home", href: "#", label: t.nav.home },
    { id: "about", href: "#about", label: t.nav.about },
    { id: "rooms", href: "#rooms", label: t.nav.rooms },
    { id: "aquapark", href: "#aquapark", label: t.nav.aquapark },
    { id: "wonderland", href: "#wonderland", label: t.nav.wonderland },
    { id: "restoran", href: "#restoran", label: t.nav.restoran },
    { id: "contacts", href: "#contacts", label: t.nav.contacts },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-12 py-1.5 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-sm"
            : "bg-white border-b border-stone-100"
        }`}
      >
        <div className="flex items-center select-none transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="/loqo-af.png"
            alt="AF Hotel & Resort"
            width={120}
            height={55}
            priority
            className="w-24 h-auto sm:w-28 md:w-30 object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5 text-[11px] font-bold uppercase tracking-widest text-slate-700">
          {navLinks.map((item) => (
            <div key={item.id} className="relative py-2 group">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className="transition-colors duration-300 hover:text-[#00b5d5]"
                style={{ color: activeNav === item.id ? "#00b5d5" : "" }}
              >
                {item.label}
              </a>
              <div
                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#00b5d5] transition-all duration-300 ${
                  activeNav === item.id
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`}
              />
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <a
            href={`tel:${settings?.phone || "+994124480000"}`}
            className="hidden xl:flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#00b5d5] transition-colors border border-stone-200/80 px-3 py-2 rounded-xl bg-stone-50/40"
          >
            <Phone className="w-3.5 h-3.5 text-[#00b5d5]" />
            <span>{settings?.phone || "+994 (12) 448-00-00"}</span>
          </a>

          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 font-bold text-[11px] tracking-wider text-slate-700 outline-none uppercase p-2 hover:bg-stone-50 rounded-xl transition-all duration-300 border-none bg-transparent cursor-pointer"
            >
              <FlagIcon code={currentLang} />
              <span className="hidden sm:inline">{currentLang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-stone-200/80 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {(["az", "en", "ru"] as LangType[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      setLanguage(lng);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wider text-slate-700 hover:bg-stone-50 transition-colors duration-150 uppercase border-none bg-transparent cursor-pointer ${language === lng ? "text-[#00b5d5] bg-stone-50/50" : ""}`}
                  >
                    <FlagIcon code={lng} />
                    <span>{lng}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/account?tab=favorites"
            className="flex items-center justify-center p-2 text-slate-700 hover:bg-stone-50 rounded-xl transition-colors relative"
            title={t.nav.favorites}
          >
            <Heart className="w-4.5 h-4.5" />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#ff6c02] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          <a
            href="#booking"
            className="hidden sm:flex items-center text-[11px] font-bold uppercase tracking-widest px-4.5 py-2.5 bg-[#ff6c02] text-white hover:bg-[#e55f00] rounded-xl shadow-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.nav.book}
          </a>

          <div className="relative" ref={menuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all duration-300 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  
                  <span className="hidden md:inline text-[11px] font-bold uppercase tracking-wider text-slate-700 max-w-25 truncate">
                    {currentUser?.name || currentUser?.email}
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200/80 shadow-xl py-1 z-50 overflow-hidden">
                    <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-800 truncate">{currentUser?.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {t.nav.myAccount}
                      </Link>

                      <Link
                        href="/account?tab=bookings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                        {t.nav.myBookings}
                      </Link>

                      <Link
                        href="/account?tab=favorites"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <Heart className="w-3.5 h-3.5 text-stone-400" />
                        <span>{t.nav.favorites}</span>
                        {favCount > 0 && (
                          <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">
                            {favCount}
                          </span>
                        )}
                      </Link>

                      <button
                        onClick={() => {
                          signOut();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 border-t border-stone-100 font-medium border-none bg-transparent text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-slate-700 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {t.nav.login}
                </span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex lg:hidden p-2 text-slate-700 hover:bg-stone-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-0 top-13.75 bg-white z-40 lg:hidden flex flex-col justify-between p-6 border-t border-stone-100"
          >
            <nav className="flex flex-col space-y-5 text-sm font-bold tracking-widest text-slate-800">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`py-2 border-b border-stone-50 ${activeNav === item.id ? "text-[#00b5d5]" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="space-y-4">
            <a
              href={`tel:${settings?.phone || "+994124480000"}`}
              className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 py-3.5 border border-stone-200 rounded-xl"
            >
              <Phone className="w-4 h-4 text-[#00b5d5]" /> {settings?.phone || "+994 (12) 448-00-00"}
            </a>
            <a
              href="#booking"
              onClick={() => setMobileNavOpen(false)}
              className="flex justify-center items-center text-xs font-bold uppercase tracking-widest w-full py-4 bg-[#ff6c02] text-white rounded-xl shadow-md"
            >
              {t.nav.book}
            </a>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}