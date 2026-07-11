"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, Menu, X, Phone, Heart, BookOpen } from "lucide-react";
import { getFavorites } from "@/lib/favorites";
import { useSettings } from "@/contexts/SettingsContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MagneticButton from "./MagneticButton";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  const [currOpen, setCurrOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [scrolled, setScrolled] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const { user, signOut } = useAuth();
  const currentUser = user as AuthUser | null;
  const { language, setLanguage, t } = useLanguage();
  const currentLang = language || "az";
  const { settings } = useSettings();
  const { currency, setCurrency } = useCurrency();

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
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

  // All hooks must be called before any early returns (Rules of Hooks)
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname.startsWith('/login')) return null;

  const handleNavClick = () => {
    setMobileNavOpen(false);
  };

  const navLinks = [
    { id: "/", href: "/", label: t.nav.home },
    { id: "/about", href: isDesktop && pathname === '/' ? "/#about" : "/about", label: t.nav.about },
    { id: "/rooms", href: isDesktop && pathname === '/' ? "/#rooms" : "/rooms", label: t.nav.rooms },
    { id: "/aquapark", href: isDesktop && pathname === '/' ? "/#aquapark" : "/aquapark", label: t.nav.aquapark },
    { id: "/wonderland", href: isDesktop && pathname === '/' ? "/#wonderland" : "/wonderland", label: t.nav.wonderland },
    { id: "/restoran", href: isDesktop && pathname === '/' ? "/#restoran" : "/restoran", label: t.nav.restoran },
    { id: "/contacts", href: isDesktop && pathname === '/' ? "/#contacts" : "/contacts", label: t.nav.contacts },
  ];

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { y: -20, opacity: 0 },
          visible: { 
            y: 0, opacity: 1, 
            transition: { 
              duration: 0.5, 
              ease: "easeOut" as const,
              staggerChildren: 0.1,
              delayChildren: 0.2
            } 
          }
        }}
        className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-12 py-1.5 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-sm"
            : "bg-white border-b border-stone-100"
        }`}
      >
        <MagneticButton>
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { ease: "easeOut" as const, duration: 0.45 } } }} className="flex items-center select-none transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src="/loqo-af.png"
              alt="AF Hotel & Resort"
              width={120}
              height={55}
              priority
              className="w-24 h-auto sm:w-28 md:w-30 object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </motion.div>
        </MagneticButton>

        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-slate-600">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/');
            return (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { ease: "easeOut" as const, duration: 0.45 } } }} className="relative py-2 group">
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className="transition-colors duration-300 hover:text-[#00b5d5]"
                  style={{ color: isActive ? "#00b5d5" : "" }}
                >
                  {item.label}
                </Link>
                <div
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#00b5d5] transition-all duration-300 ${
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
                />
              </motion.div>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <a
            href={`tel:${settings?.phone || "+994124483030"}`}
            className="hidden xl:flex items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-[#ff6c02] transition-colors border border-stone-200/60 px-3 py-1.5 rounded-lg bg-stone-50/50"
          >
            <Phone className="w-3.5 h-3.5 text-[#00b5d5]" />
            <span>{settings?.phone || "+994 (12) 448-30-30"}</span>
          </a>

          {/* Currency Switcher */}
          <div className="relative" ref={currRef}>
            <button
              onClick={() => setCurrOpen(!currOpen)}
              className="flex items-center space-x-1.5 font-bold text-[11px] tracking-wider text-slate-700 outline-none uppercase p-2 hover:bg-stone-50 rounded-xl transition-all duration-300 border-none bg-transparent cursor-pointer"
            >
              <span className="hidden sm:inline font-bold text-[#1e325c] bg-stone-100 px-2 py-1 rounded-md">{currency}</span>
              <span className="sm:hidden font-bold text-[#1e325c] bg-stone-100 px-2 py-1 rounded-md">{currency === "AZN" ? "₼" : currency === "EUR" ? "€" : "$"}</span>
            </button>

            {currOpen && (
              <div className="absolute right-0 mt-2 w-20 bg-white border border-stone-200/80 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {(["AZN", "USD", "EUR"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrOpen(false);
                    }}
                    className={`w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wider text-slate-700 hover:bg-stone-50 transition-colors duration-150 uppercase border-none bg-transparent cursor-pointer ${currency === curr ? "text-[#00b5d5] bg-stone-50/50" : ""}`}
                  >
                    <span>{curr}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 font-bold text-[11px] tracking-wider text-slate-700 outline-none uppercase p-2 hover:bg-stone-50 rounded-xl transition-all duration-300 border-none bg-transparent cursor-pointer"
            >
              <FlagIcon code={currentLang} />
              <span className="hidden sm:inline">{currentLang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-stone-200/80 rounded-xl shadow-xl py-1 z-200 animate-in fade-in slide-in-from-top-2 duration-200">
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

          <MagneticButton> 
            <Link
              href="/booking"
              className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 bg-linear-to-r from-[#ff6c02] to-[#e55f00] text-white hover:from-[#e55f00] hover:to-[#cc5500] hover:shadow-lg hover:shadow-[#ff6c02]/20 rounded-lg shadow-sm transition-all duration-300"
            >
              {t.nav.book}
            </Link>
          </MagneticButton>

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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200/80 shadow-xl py-1 z-200 overflow-hidden">
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="fixed inset-0 top-15 bg-white z-40 lg:hidden flex flex-col justify-between p-6 border-t border-stone-100"
          >
            <motion.nav 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col mt-6 space-y-5 text-sm font-bold tracking-widest text-slate-800"
            >
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (pathname === '/' && item.href === '/');
              return (
                <motion.div
                  key={item.id}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 }
                  }}
                  className="border-b border-stone-50"
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={`block py-2 ${isActive ? "text-[#00b5d5]" : ""}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
            </motion.nav>
          <div className="space-y-4">
            <a
              href={`tel:${settings?.phone || "+994124483030"}`}
              className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 py-3.5 border border-stone-200 rounded-xl"
            >
              <Phone className="w-4 h-4 text-[#00b5d5]" /> {settings?.phone || "+994 (12) 448-30-30"}
            </a>
            <Link
              href="/booking"
              onClick={() => setMobileNavOpen(false)}
              className="flex justify-center items-center text-xs font-bold uppercase tracking-widest w-full py-4 bg-[#ff6c02] text-white rounded-xl shadow-md"
            >
              {t.nav.book}
            </Link>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}