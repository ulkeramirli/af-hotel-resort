'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

import { User, Briefcase, Award, Wallet, MessageSquare, Heart, LogOut } from 'lucide-react';

type LangType = 'az' | 'en' | 'ru';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (res: GoogleCredentialResponse) => void }) => void;
      prompt: () => void;
    };
  };
}

const FlagIcon = ({ code }: { code: LangType }) => {
  if (code === 'az') return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 6 3">
      <path fill="#24aad4" d="M0 0h6v1H0z"/><path fill="#ed2c34" d="M0 1h6v1H0z"/><path fill="#339966" d="M0 2h6v1H0z"/>
      <circle cx="3" cy="1.5" r=".4" fill="#fff"/><circle cx="3.08" cy="1.5" r=".34" fill="#ed2c34"/>
      <path fill="#fff" d="M3.15 1.32l.04.14.15-.02-.1.1.07.13-.12-.08-.12.08.06-.13-.1-.1.14.02z"/>
    </svg>
  );
  if (code === 'en') return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 50 30">
      <clipPath id="t"><path d="M0 0v30h50V0z"/></clipPath>
      <g clipPath="url(#t)">
        <path d="M0 0v30h50V0z" fill="#012169"/><path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4"/><path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10"/><path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6"/>
      </g>
    </svg>
  );
  return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 3 2">
      <path fill="#fff" d="M0 0h3v2H0z"/><path fill="#0039a6" d="M0 .67h3v1.33H0z"/><path fill="#d52b1e" d="M0 1.33h3v.67H0z"/>
    </svg>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); 
  const [langOpen, setLangOpen] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  
  const session = null;
  const status = 'unauthenticated';
  const { language, setLanguage } = useLanguage();
  const currentLang = (language as LangType) || 'az';
  
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [favCount, setFavCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('af_favorites');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed.length : 0;
        } catch {
          return 0;
        }
      }
    }
    return 0;
  });

  const updateFavCount = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('af_favorites');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFavCount(Array.isArray(parsed) ? parsed.length : 0);
        } catch {
          setFavCount(0);
        }
      } else {
        setFavCount(0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('favoritesUpdated', updateFavCount);
    return () => window.removeEventListener('favoritesUpdated', updateFavCount);
  }, []);

  // Google auth deactivated - no backend configured
  void status;

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveNav('home');
    } else {
      setActiveNav(id);
    }
  };

  const texts = {
    home: { az: 'ANA SƏHİFƏ', en: 'HOME', ru: 'ГЛАВНАЯ' }[currentLang],
    rooms: { az: 'OTAQLAR', en: 'ROOMS', ru: 'НОМЕРА' }[currentLang],
    aquapark: { az: 'AQUA PARK', en: 'AQUA PARK', ru: 'АКВАПАРК' }[currentLang],
    lunapark: { az: 'LUNA PARK', en: 'LUNA PARK', ru: 'ЛУНАПАРК' }[currentLang],
    dining: { az: 'RESTORAN', en: 'DINING', ru: 'РЕСТОРАН' }[currentLang],
    contacts: { az: 'ƏLAQƏ', en: 'CONTACTS', ru: 'КОНТАКТЫ' }[currentLang],
    book: { az: 'REZERV ET', en: 'BOOK NOW', ru: 'БРОНЬ' }[currentLang],
    login: { az: 'Daxil ol', en: 'Sign in', ru: 'Войти' }[currentLang],
    
    myAccount: { az: 'Mənim hesabım', en: 'Manage account', ru: 'Мой аккаунт' }[currentLang],
    bookings: { az: 'Rezervasiyalar və səfərlər', en: 'Bookings & Trips', ru: 'Бронирования и поездки' }[currentLang],
    genius: { az: 'Genius loyallıq proqramı', en: 'Genius loyalty programme', ru: 'Программа лояльности Genius' }[currentLang],
    wallet: { az: 'Mükafatlar və Pul kisəsi', en: 'Rewards & Wallet', ru: 'Вознаграждения и Кошелек' }[currentLang],
    reviews: { az: 'Rəylər', en: 'Reviews', ru: 'Отзывы' }[currentLang],
    saved: { az: 'Saxlanılanlar', en: 'Saved', ru: 'Сохраненное' }[currentLang],
    logout: { az: 'Çıxış', en: 'Sign out', ru: 'Выйти' }[currentLang]
  };

  // const galleryLabel = { az: 'Qalereya', en: 'Gallery', ru: 'Галерея' }[currentLang];
  const reviewsLabel = { az: 'Rəylər', en: 'Reviews', ru: 'Отзывы' }[currentLang];
  const bookingLabel = { az: 'Rezervasiya', en: 'Booking', ru: 'Бронирование' }[currentLang];

  // Исправлено: Привязали ссылки к объекту перевода texts и локальным переменным
  const navLinks = [
    { id: 'home', href: '#', label: texts.home },
    { id: 'rooms', href: '#rooms', label: texts.rooms },
    // { id: 'gallery', href: '#gallery', label: galleryLabel },
    { id: 'aquapark', href: '#aquapark', label: texts.aquapark },
    { id: 'dining', href: '#dining', label: texts.dining },
    { id: 'reviews', href: '#reviews', label: reviewsLabel },
    { id: 'booking', href: '#booking', label: bookingLabel },
  ];

  const dropdownItemClass = "w-full flex items-center justify-between px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors duration-150 font-medium text-left first:rounded-t-xl last:rounded-b-xl cursor-pointer border-none bg-transparent outline-none";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-8 py-1 lg:py-1 flex justify-between items-center transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
          : 'bg-white/98 backdrop-blur-xs border-b border-stone-100 shadow-xs'
      }`}>
        
        <div className="flex items-center select-none transition-transform duration-500 hover:scale-[1.04] active:scale-[0.97] pl-4 md:pl-6">
          <Image src="/loqo-af.png" alt="AF Hotel & Resort" width={160} height={80} priority className="w-28 h-auto sm:w-32 md:w-36 object-contain" />
        </div>

        {/* Исправлено: Заменено navItems на правильный массив navLinks */}
        <nav className="hidden lg:flex items-center space-x-6 text-[11.5px] font-black uppercase tracking-wider text-slate-700">
          {navLinks.map((item) => (
            <div key={item.id} className="relative py-2 group">
              <a href={item.href} onClick={(e) => handleHomeClick(e, item.id)} className="transition-colors duration-300" style={{ color: activeNav === item.id ? '#00b5d5' : '' }}>
                <span className="group-hover:text-[#00b5d5] transition-colors duration-300">{item.label}</span>
              </a>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#00b5d5] transition-all duration-300 rounded-full ${
                activeNav === item.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-4 pr-2"> 
          <a href="tel:+994501234567" className="hidden xl:flex items-center space-x-1.5 text-[12.5px] font-extrabold text-[#00b5d5] hover:text-[#007a91] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.753-7.859-4.461-9.013.019-.01 1.999-.991 1.999-.991l-3.566-6.833s-1.995 1-2.008 1.015c-3.141 1.619-3.344 5.372-2.14 8.925 1.472 4.344 4.597 8.52 8.646 11.233 4.148 2.778 8.134 2.898 10.985 1.411.026-.017 2.13-1.028 2.13-1.028zm-2.008-2.616c-.461.239-2.735 1.341-5.111-.252-3.072-2.059-5.5-5.323-6.611-8.599-.861-2.544-.457-4.489 1.419-5.453l1.761-.885 1.776 3.402-1.637.811c-.378.188-.521.652-.311 1.023.771 1.355 3.017 5.766 5.253 6.848.374.18.835.011 1.011-.354l.829-1.626 1.76 3.4-.139.065z"/></svg>
            <span>+994 50 123 45 67</span>
          </a>

          <div className="relative" ref={langRef}>
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center space-x-1.5 font-black text-[11.5px] tracking-wider text-slate-700 outline-none cursor-pointer uppercase p-1.5 hover:opacity-80 transition-all duration-300 bg-transparent border-none">
              <FlagIcon code={currentLang} />
              <span>{currentLang}</span>
              <svg className={`w-2.5 h-2.5 transition-transform duration-500 text-slate-400 ${langOpen ? 'rotate-180 text-[#00b5d5]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {langOpen && (
              <div className="absolute right-0 mt-2.5 w-24 bg-white border border-stone-200/80 rounded-xl shadow-lg py-1 z-50">
                {(['az', 'en', 'ru'] as LangType[]).map((lng) => (
                  <button key={lng} onClick={() => { setLanguage(lng); setLangOpen(false); }} className={`w-full flex items-center space-x-2 px-3 py-2 text-[11px] font-bold tracking-wider text-slate-700 hover:bg-stone-50 transition-colors duration-200 uppercase border-none bg-transparent ${language === lng ? 'bg-stone-50 text-[#00b5d5]' : ''}`}>
                    <FlagIcon code={lng} />
                    <span>{lng}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="#booking" className="hidden sm:flex items-center space-x-1.5 text-[10.5px] font-black uppercase tracking-widest px-4 py-2.5 bg-[#ff6c02] text-white hover:bg-[#e55f00] rounded-xl shadow-md shadow-[#ff6c02]/10 transition-all duration-500 hover:scale-[1.05] active:scale-[0.96]">
            <span>{texts.book}</span>
            <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2.5}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </a>

          <button 
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2.5 px-3.5 py-2.5 bg-white border border-stone-200 hover:border-slate-400 hover:bg-stone-50 text-slate-700 rounded-xl shadow-xs transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.789c2.497 0 4.549 1.54 5.318 3.712l3.96-3.078C21.107 4.135 17.844 2 13.99 2 8.03 2 3.2 6.83 3.2 12.79s4.83 10.79 10.79 10.79c5.842 0 10.826-4.22 10.826-10.79 0-.703-.06-1.396-.176-2.065l-12.4 1.15z"/>
                <path fill="#4285F4" d="M24.64 12.925c0-.703-.06-1.396-.176-2.065H12.24V15h6.887a5.55 5.55 0 0 1-2.426 3.514l3.96 3.078c2.316-2.137 3.979-5.283 3.979-8.667z"/>
                <path fill="#FBBC05" d="M13.99 23.58c3.854 0 7.117-2.135 9.276-5.567l-3.96-3.078a5.75 5.75 0 0 1-5.316 3.579 5.79 5.79 0 0 1-5.79-4.789l-4.062 3.14a10.74 10.74 0 0 0 9.852 6.714z"/>
                <path fill="#34A853" d="M8.2 12.725c0-.62.083-1.218.238-1.785L4.376 7.8a10.74 10.74 0 0 0 0 9.85l4.062-3.14A5.73 5.73 0 0 1 8.2 12.725z"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                {texts.login}
              </span>
            </button>

          <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 lg:hidden z-50 relative outline-none cursor-pointer bg-transparent border-none">
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Мобильное меню — тоже исправлено на navLinks */}
      <div className={`fixed inset-0 z-40 bg-white/99 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-700 lg:hidden ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <nav className="flex flex-col items-center space-y-6 text-center mb-6">
          {navLinks.map((item, index) => (
            <a 
              key={item.id} 
              href={item.href} 
              onClick={(e) => { setIsOpen(false); handleHomeClick(e, item.id); }} 
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0
              } as React.CSSProperties}
              className={`text-xl font-black tracking-wider transition-all duration-500 ${
                activeNav === item.id ? 'text-[#00b5d5]' : 'text-slate-800 hover:text-[#00b5d5]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div style={{ transitionDelay: isOpen ? '350ms' : '0ms' }} className={`flex flex-col items-center space-y-4 border-t border-stone-200/60 pt-6 w-2/3 text-center transition-all duration-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <a href="tel:+994501234567" className="text-base font-black text-[#00b5d5]">+994 50 123 45 67</a>
        </div>
      </div>
    </>
  );
}