'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

type LangType = 'az' | 'en' | 'ru';

const FlagIcon = ({ code }: { code: LangType }) => {
  if (code === 'az') return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200" viewBox="0 0 6 3">
      <path fill="#24aad4" d="M0 0h6v1H0z"/><path fill="#ed2c34" d="M0 1h6v1H0z"/><path fill="#339966" d="M0 2h6v1H0z"/>
      <circle cx="3" cy="1.5" r=".4" fill="#fff"/><circle cx="3.08" cy="1.5" r=".34" fill="#ed2c34"/>
      <path fill="#fff" d="M3.15 1.32l.04.14.15-.02-.1.1.07.13-.12-.08-.12.08.06-.13-.1-.1.14.02z"/>
    </svg>
  );
  if (code === 'en') return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200" viewBox="0 0 50 30">
      <clipPath id="t"><path d="M0 0v30h50V0z"/></clipPath>
      <g clipPath="url(#t)">
        <path d="M0 0v30h50V0z" fill="#012169"/><path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4"/><path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10"/><path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6"/>
      </g>
    </svg>
  );
  return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shadow-xs border border-stone-200" viewBox="0 0 3 2">
      <path fill="#fff" d="M0 0h3v2H0z"/><path fill="#0039a6" d="M0 .67h3v1.33H0z"/><path fill="#d52b1e" d="M0 1.33h3v.67H0z"/>
    </svg>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); 
  const [langOpen, setLangOpen] = useState(false); 
  const [activeNav, setActiveNav] = useState('home');
  const { lang, setLang } = useLanguage();
  const currentLang = (lang as LangType) || 'az';
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const texts = {
    home: { az: 'ANA SƏHİFƏ', en: 'HOME', ru: 'ГЛАВНАЯ' }[currentLang],
    rooms: { az: 'OTAQLAR', en: 'ROOMS', ru: 'НОМЕРА' }[currentLang],
    aquapark: { az: 'AQUA PARK', en: 'AQUA PARK', ru: 'АКВАПАРК' }[currentLang],
    dining: { az: 'RESTORAN', en: 'DINING', ru: 'РЕСТОРАН' }[currentLang],
    contacts: { az: 'ƏLAQƏ', en: 'CONTACTS', ru: 'КОНТАКТЫ' }[currentLang],
    book: { az: 'İNDİ REZERV ET', en: 'BOOK NOW', ru: 'БРОНЬ' }[currentLang]
  };

  const navItems = [
    { id: 'home', label: texts.home, href: '#home' },
    { id: 'rooms', label: texts.rooms, href: '#rooms' },
    { id: 'aquapark', label: texts.aquapark, href: '#aquapark' },
    { id: 'dining', label: texts.dining, href: '#dining' },
    { id: 'contacts', label: texts.contacts, href: '#contacts' },
  ];

  return (
    <>
      {/* Шапка стала еще уже благодаря py-1 */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-stone-200 px-4 lg:px-12 py-1 flex justify-between items-center shadow-xs">
        
        {/* ЛОГОТИП (размеры уменьшены: w-24 / sm:w-28 / md:w-36) */}
        <div className="flex items-center space-x-2 select-none">
          <Image
            src="/loqo-af.png"
            alt="AF Hotel & Resort"
            width={160}
            height={80}
            priority
            className="w-24 h-auto sm:w-28 md:w-36 object-contain"
          />
        </div>

        {/* НАВИГАЦИЯ ДЕСКТОП */}
        <nav className="hidden lg:flex items-center space-x-7 text-[12px] font-bold uppercase tracking-wider text-slate-700">
          {navItems.map((item) => (
            /* Уменьшен py-1, чтобы не распирать узкую шапку */
            <div key={item.id} className="relative py-1 group">
              <a 
                href={item.href} 
                onClick={() => setActiveNav(item.id)}
                className={`transition-colors ${activeNav === item.id ? 'text-[#00b5d5]' : 'hover:text-[#00b5d5]'}`}
              >
                {item.label}
              </a>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-[#00b5d5] transition-all duration-300 ${activeNav === item.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`} />
            </div>
          ))}
        </nav>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center space-x-5"> 
          
          <a href="tel:+994501234567" className="hidden xl:flex items-center space-x-1.5 text-[13px] font-bold text-[#00b5d5] hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.753-7.859-4.461-9.013.019-.01 1.999-.991 1.999-.991l-3.566-6.833s-1.995 1-2.008 1.015c-3.141 1.619-3.344 5.372-2.14 8.925 1.472 4.344 4.597 8.52 8.646 11.233 4.148 2.778 8.134 2.898 10.985 1.411.026-.017 2.13-1.028 2.13-1.028zm-2.008-2.616c-.461.239-2.735 1.341-5.111-.252-3.072-2.059-5.5-5.323-6.611-8.599-.861-2.544-.457-4.489 1.419-5.453l1.761-.885 1.776 3.402-1.637.811c-.378.188-.521.652-.311 1.023.771 1.355 3.017 5.766 5.253 6.848.374.18.835.011 1.011-.354l.829-1.626 1.76 3.4-.139.065z"/></svg>
            <span>+994 50 123 45 67</span>
          </a>

          {/* СЕЛЕКТ ЯЗЫКА */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 font-bold text-[12px] tracking-wider text-slate-700 outline-none cursor-pointer uppercase"
            >
              <FlagIcon code={currentLang} />
              <span>{currentLang}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-3 w-24 bg-white border border-stone-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                {(['az', 'en', 'ru'] as LangType[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => { setLang(lng); setLangOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-[11px] font-bold tracking-wider text-slate-700 hover:bg-stone-50 transition-colors uppercase ${lang === lng ? 'bg-stone-50 text-[#00b5d5]' : ''}`}
                  >
                    <FlagIcon code={lng} /><span>{lng}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка тоже стала компактнее (py-1.5 вместо py-2.5) */}
          <a 
            href="#booking" 
            className="hidden sm:flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 bg-[#ff6c02] text-white hover:bg-[#e55f00] rounded-lg transition-all"
          >
            <span>{texts.book}</span>
            <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </a>

          {/* БУРГЕР */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 lg:hidden z-50 relative outline-none cursor-pointer"
          >
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-md flex flex-col justify-center items-center transition-all duration-300 lg:hidden ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <nav className="flex flex-col items-center space-y-6 text-center mb-8">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={item.href} 
              onClick={() => { setIsOpen(false); setActiveNav(item.id); }} 
              className={`text-xl font-extrabold tracking-wider transition-colors ${activeNav === item.id ? 'text-[#00b5d5]' : 'text-slate-800'}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex flex-col items-center space-y-4 border-t border-stone-100 pt-6 w-2/3 text-center">
          <a href="tel:+994501234567" className="text-sm font-bold text-[#00b5d5] flex items-center space-x-2">
            <span>+994 50 123 45 67</span>
          </a>
        </div>
      </div>
    </>
  );
}