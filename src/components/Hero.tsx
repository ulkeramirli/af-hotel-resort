'use client';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function Hero() {
  const { lang } = useLanguage();
  const currentLang = (lang as 'az' | 'en' | 'ru') || 'az';
  
  const [guestOpen, setGuestOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) setGuestOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const texts = {
    line1: { az: 'ƏYLƏNCƏ DOLU', en: 'FULL OF FUN', ru: 'ПОЛНЫЙ ВЕСЕЛЬЯ' }[currentLang],
    line2: { az: 'TƏTİL SİZİ GÖZLƏYİR!', en: 'HOLIDAY AWAITS YOU!', ru: 'ОТДЫХ ЖДЕТ ВАС!' }[currentLang],
    f1: { az: 'Rahat və geniş otaqlar', en: 'Comfortable & spacious rooms', ru: 'Уютные и просторные номера' }[currentLang],
    f2: { az: 'Əyləncəli Aqua Park', en: 'Fun Aqua Park', ru: 'Веселый Аквапарк' }[currentLang],
    f3: { az: 'Ləziz təamlar və mükəmməl servis', en: 'Delicious food & perfect service', ru: 'Вкусная еда и сервис' }[currentLang],
    checkIn: { az: 'GƏLİŞ TARİXİ', en: 'CHECK-IN', ru: 'ДАТА ЗАЕЗДА' }[currentLang],
    checkOut: { az: 'GEDİŞ TARİXİ', en: 'CHECK-OUT', ru: 'ДАТА ВЫЕЗДА' }[currentLang],
    guests: { az: 'QONAQ SAYI', en: 'GUESTS', ru: 'КОЛИЧЕСТВО ГОСТЕЙ' }[currentLang],
    adultsLabel: { az: 'Yetkin', en: 'Adults', ru: 'Взрослые' }[currentLang],
    kidsLabel: { az: 'Uşaq', en: 'Children', ru: 'Дети' }[currentLang],
    btnBook: { az: 'İNDİ REZERV ET', en: 'BOOK NOW', ru: 'ЗАБРОНИРОВАТЬ' }[currentLang]
  };

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = '#booking';
  };

  return (
    <section className="relative min-h-[95 vh] lg:min-h-screen pt-28 pb-12 flex items-center bg-white overflow-hidden select-none">
      
      {/* ФОН: НА ТЕЛЕФОНЕ ПОЛНЫЙ ЭКРАН С НЕЖНЫМ ВЕРТИКАЛЬНЫМ ПЕРЕХОДОМ, НА ПК — КЛАССИЧЕСКИЙ БОКОВОЙ */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image 
            src="/AF-aqua.jpg" 
            alt="AF Hotel Grand Aquapark" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Мягкий Pro-градиент: на мобилках сверху вниз, на десктопах — слева направо */}
          <div className="absolute inset-0 bg-linear-to-b from-white via-white/75 to-white/10 lg:bg-linear-to-r lg:from-white lg:via-white/80 lg:to-transparent" />
        </div>
      </div>

      {/* КОНТЕНТНАЯ ОБЛАСТЬ */}
      <div className="relative z-10 max-w-360 w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ЛЕВАЯ ЧАСТЬ (ТЕКСТЫ И ПРЕИМУЩЕСТВА) */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-left">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-[#1e325c] tracking-wide uppercase leading-tight drop-shadow-xs">
              {texts.line1}
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black text-[#00b5d5] tracking-tight uppercase leading-none drop-shadow-xs">
              {texts.line2}
            </h1>
            <p className="text-2.5xl sm:text-3xl md:text-[40px] font-medium text-[#7ccbe1] font-serif italic pt-1">
              AF Hotel Aqua Park
            </p>
          </div>
{/* ИКОНКИ ПРЕИМУЩЕСТВ (Компактные на ПК, не растягиваются) */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 lg:pt-6 max-w-xl md:max-w-2xl">
  
  {/* 1. НОМЕРА (Кровать) */}
  <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-md sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-stone-200/40 sm:border-none shadow-xs sm:shadow-none">
    <div className="w-14 h-14 rounded-xl bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0">
     <Image src="/bed.png" alt="Aquapark" width={40} height={40} />
    </div>
    <p className="text-[12px] lg:text-[13px] text-slate-800 font-extrabold leading-snug tracking-wide">{texts.f1}</p>
  </div>

  {/* 2. АКВАПАРК (Водная горка / Волны) */}
  <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-md sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-stone-200/40 sm:border-none shadow-xs sm:shadow-none">
    <div className="w-14 h-14 rounded-xl bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0">
      <Image src="/aqua-park1.png" alt="Aquapark" width={40} height={40} />
    </div>
    <p className="text-[12px] lg:text-[13px] text-slate-800 font-extrabold leading-snug tracking-wide">{texts.f2}</p>
  </div>

  {/* 3. РЕСТОРАН (Приборы) */}
  <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-md sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-stone-200/40 sm:border-none shadow-xs sm:shadow-none">
    <div className="w-14 h-14 rounded-xl bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0">
      <Image src="/spoon.png" alt="Restaurant" width={40} height={40} />
    </div>
    <p className="text-[12px] lg:text-[13px] text-slate-800 font-extrabold leading-snug tracking-wide">{texts.f3}</p>
  </div>

</div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ (КАРТОЧКА БРОНИРОВАНИЯ) */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
          <form 
            onSubmit={handleBook}
            className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 w-full max-w-md shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-stone-100"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.checkIn}</label>
                <input type="date" required defaultValue="2026-06-15" className="w-full border border-stone-200 text-slate-800 rounded-xl px-3 py-3 text-[13px] font-semibold outline-none focus:border-[#00b5d5] transition-colors bg-white cursor-pointer" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.checkOut}</label>
                <input type="date" required defaultValue="2026-06-17" className="w-full border border-stone-200 text-slate-800 rounded-xl px-3 py-3 text-[13px] font-semibold outline-none focus:border-[#00b5d5] transition-colors bg-white cursor-pointer" />
              </div>
            </div>

            <div className="space-y-1 mb-6 relative" ref={guestRef}>
              <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.guests}</label>
              <button 
                type="button"
                onClick={() => setGuestOpen(!guestOpen)}
                className="w-full border border-stone-200 text-slate-800 rounded-xl px-4 py-3.5 text-[13px] font-semibold outline-none flex justify-between items-center bg-white hover:border-[#00b5d5] transition-colors cursor-pointer"
              >
                <span>{adults} {texts.adultsLabel}, {kids} {texts.kidsLabel}</span>
                <svg className={`w-4 h-4 text-stone-400 transition-transform ${guestOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* ДРОПДАУН СЧЕТЧИКОВ С ПЛАВНЫМ ПЕРЕХОДОМ */}
              {guestOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-stone-100 rounded-xl shadow-2xl p-4 z-30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-700">{texts.adultsLabel}</span>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-slate-700 hover:bg-[#00b5d5] hover:text-white transition-colors cursor-pointer">-</button>
                      <span className="w-4 text-center text-[13px] font-black text-slate-800">{adults}</span>
                      <button type="button" onClick={() => setAdults(Math.min(6, adults + 1))} className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-slate-700 hover:bg-[#00b5d5] hover:text-white transition-colors cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-700">{texts.kidsLabel}</span>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => setKids(Math.max(0, kids - 1))} className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-slate-700 hover:bg-[#00b5d5] hover:text-white transition-colors cursor-pointer">-</button>
                      <span className="w-4 text-center text-[13px] font-black text-slate-800">{kids}</span>
                      <button type="button" onClick={() => setKids(Math.min(5, kids + 1))} className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-slate-700 hover:bg-[#00b5d5] hover:text-white transition-colors cursor-pointer">+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md shadow-[#ff6c02]/20 text-center cursor-pointer"
            >
              {texts.btnBook}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}