'use client';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function Hero() {
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  
  const [guestOpen, setGuestOpen] = useState(false);
  
  // Отдельные состояния для дат и гостей
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  
  const guestRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split('T')[0];

  // Следим за изменениями полей в Hero и мгновенно отправляем их в Booking
  useEffect(() => {
    const bookingEvent = new CustomEvent('heroBookingData', {
      detail: { checkIn, checkOut, adults, kids }
    });
    window.dispatchEvent(bookingEvent);
  }, [checkIn, checkOut, adults, kids]);

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
    f4: { az: 'Möhtəşəm Lunapark', en: 'Amazing Lunapark', ru: 'Потрясающий Луна-парк' }[currentLang], 
    checkIn: { az: 'GƏLİŞ TARİXİ', en: 'CHECK-IN', ru: 'ДАТА ЗАЕЗДА' }[currentLang],
    checkOut: { az: 'GEDİŞ TARİXİ', en: 'CHECK-OUT', ru: 'ДАТА ВЫЕЗДА' }[currentLang],
    guests: { az: 'QONAQ SAYI', en: 'GUESTS', ru: 'КОЛИЧЕСТВО ГОСТЕЙ' }[currentLang],
    adultsLabel: { az: 'Yetkin', en: 'Adults', ru: 'Взрослые' }[currentLang],
    kidsLabel: { az: 'Uşaq', en: 'Children', ru: 'Дети' }[currentLang],
    btnBook: { az: 'İNDİ REZERV ET', en: 'BOOK NOW', ru: 'ЗАБРОНИРОВАТЬ' }[currentLang],
    notSelected: { az: 'Seçilməyib', en: 'Not selected', ru: 'Не выбрано' }[currentLang]
  };

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    // Скроллим к секции #booking
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '#booking';
    }
  };

  const animationStyles = `
    @keyframes fadeInUpMotion {
      0% { opacity: 0; transform: translateY(20px) scale(0.98); }
      80% { transform: translateY(-1px) scale(1.01); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeInRightMotion {
      0% { opacity: 0; transform: translateX(30px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInMotion {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .anim-fade-in { animation: fadeInMotion 1s ease-out forwards; }
    .anim-text-motion { animation: fadeInUpMotion 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .motion-card-1 { animation: fadeInUpMotion 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards; opacity: 0; }
    .motion-card-2 { animation: fadeInUpMotion 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards; opacity: 0; }
    .motion-card-3 { animation: fadeInUpMotion 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s forwards; opacity: 0; }
    .motion-card-4 { animation: fadeInUpMotion 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.75s forwards; opacity: 0; }
    .anim-form-motion { animation: fadeInRightMotion 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
  `;

  return (
    <section className="relative min-h-[95vh] lg:min-h-screen pt-28 pb-12 flex items-center bg-stone-50 overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      <div className="absolute inset-0 z-0 anim-fade-in w-full h-full">
        <Image 
          src="/AF-aqua.jpg" 
          alt="AF Hotel Grand Aquapark" 
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-900/20 via-transparent to-stone-950/10 lg:bg-linear-to-r lg:from-white/85 lg:via-white/50 lg:to-stone-900/5" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-left anim-text-motion">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-[#3f6593] tracking-wide uppercase leading-tight">
              {texts.line1}
            </h2>
            <h1 
              className="text-4xl sm:text-5xl md:text-[56px] font-black text-[#539bc5] tracking-tight uppercase leading-none"
              // style={{ textShadow: `1px -1px 0 #007a91, 0px 3px 6px rgba(0, 122, 145, 0.2)` }}
            >
              {texts.line2}
            </h1>
            <p className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#1e325c] tracking-wide pt-1">
              AF Hotel & Aqua Park Complex
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 lg:pt-6 max-w-xl md:max-w-2xl">
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/40 shadow-xs motion-card-1">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0 border border-[#00b5d5]/15">
                <Image src="/bed.png" alt="Rooms" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f1}</p>
            </div>

            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/40 shadow-xs motion-card-2">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0 border border-[#00b5d5]/15">
                <Image src="/aqua-park1.png" alt="Aquapark" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f2}</p>
            </div>

            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/40 shadow-xs motion-card-3">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0 border border-[#00b5d5]/15">
                <Image src="/carousel.png" alt="Lunapark" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f4}</p>
            </div>

            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/40 shadow-xs motion-card-4">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center shrink-0 border border-[#00b5d5]/15">
                <Image src="/spoon.png" alt="Restaurant" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f3}</p>
            </div>
          </div>
        </div>

        {/* Правая часть с формой */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0 anim-form-motion">
          <form 
            onSubmit={handleBook}
            className="bg-white/95 backdrop-blur-lg rounded-3xl p-5 sm:p-6 lg:p-8 w-full max-w-md shadow-[0_20px_50px_rgba(30,50,92,0.12)] border border-white transition-all duration-300 hover:shadow-[0_25px_60px_rgba(30,50,92,0.18)]"
          >
            {/* РАЗДЕЛЬНЫЕ ДАТЫ: ЗАЕЗД И ВЫЕЗД */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.checkIn}</label>
                <input 
                  type="date" 
                  required 
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value > checkOut) setCheckOut('');
                  }}
                  className="w-full border border-stone-200 text-slate-800 rounded-xl px-3 py-3 text-[13px] font-semibold outline-none focus:border-[#00b5d5] transition-colors bg-white cursor-pointer" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.checkOut}</label>
                <input 
                  type="date" 
                  required 
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-stone-200 text-slate-800 rounded-xl px-3 py-3 text-[13px] font-semibold outline-none focus:border-[#00b5d5] transition-colors bg-white cursor-pointer" 
                />
              </div>
            </div>

            <div className="space-y-1 mb-6 relative" ref={guestRef}>
              <label className="text-[9px] font-extrabold text-[#00b5d5] uppercase tracking-wider pl-1">{texts.guests}</label>
              <button 
                type="button"
                onClick={() => setGuestOpen(!guestOpen)}
                className="w-full border border-stone-200 text-slate-800 rounded-xl px-4 py-3.5 text-[13px] font-semibold outline-none flex justify-between items-center bg-white hover:border-[#00b5d5] transition-colors cursor-pointer"
              >
                <span>
                  {`${adults} ${texts.adultsLabel}, ${kids} ${texts.kidsLabel}`}
                </span>
                <svg className={`w-4 h-4 text-stone-400 transition-transform ${guestOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 9l-7 7-7-7" /></svg>
              </button>

              {guestOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-stone-100 rounded-xl shadow-2xl p-4 z-30 space-y-4 transition-all duration-200">
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
              className="w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md shadow-[#ff6c02]/20 text-center cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {texts.btnBook}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}