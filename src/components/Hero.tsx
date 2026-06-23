'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CalendarCheck, BedDouble, Waves, Star, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  const router = useRouter();

  const texts = {
    line1: { az: 'ƏYLƏNCƏ DOLU', en: 'FULL OF FUN', ru: 'ПОЛНЫЙ ВЕСЕЛЬЯ' }[currentLang],
    line2: { az: 'TƏTİL SİZİ GÖZLƏYİR!', en: 'HOLIDAY AWAITS YOU!', ru: 'ОТДЫХ ЖДЕТ ВАС!' }[currentLang],
    sub:   { az: 'AF Hotel & Aqua Park Complex', en: 'AF Hotel & Aqua Park Complex', ru: 'AF Hotel & Aqua Park Complex' }[currentLang],
    f1: { az: 'Rahat və geniş otaqlar', en: 'Comfortable & spacious rooms', ru: 'Уютные и просторные номера' }[currentLang],
    f2: { az: 'Əyləncəli Aqua Park', en: 'Fun Aqua Park', ru: 'Веселый Аквапарк' }[currentLang],
    f3: { az: 'Ləziz təamlar & mükəmməl servis', en: 'Delicious food & perfect service', ru: 'Вкусная еда и сервис' }[currentLang],
    f4: { az: 'Möhtəşəm Lunapark', en: 'Amazing Lunapark', ru: 'Потрясающий Луна-парк' }[currentLang],
    btnBook: { az: 'İndi Rezerv Et', en: 'Book Now', ru: 'Забронировать' }[currentLang],
    btnRooms: { az: 'Otaqlara Bax', en: 'Explore Rooms', ru: 'Смотреть номера' }[currentLang],
    statRooms: { az: 'Otaq', en: 'Rooms', ru: 'Номеров' }[currentLang],
    statAqua: { az: 'Aqua Zonası', en: 'Aqua Zones', ru: 'Аква-зон' }[currentLang],
    statRating: { az: 'Reytinq', en: 'Rating', ru: 'Рейтинг' }[currentLang],
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
    .anim-panel-motion { animation: fadeInRightMotion 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
  `;

  return (
    <section className="relative min-h-[95vh] lg:min-h-screen pt-28 pb-12 flex items-center bg-stone-50 overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Background image */}
      <div className="absolute inset-0 z-0 anim-fade-in w-full h-full">
        <Image
          src="/AF-aqua.jpg"
          alt="AF Hotel Grand Aquapark"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20 lg:bg-none" />
        <div className="absolute inset-0 hidden lg:block" style={{background: 'linear-gradient(105deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.70) 40%, rgba(0,0,0,0.05) 100%)'}} />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left: Text + feature cards */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-left anim-text-motion">
          <div className="space-y-1 md:space-y-2 drop-shadow-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase leading-tight drop-shadow-md">
              {texts.line1}
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-[56px] font-black text-transparent bg-clip-text tracking-tight uppercase leading-tight pb-2 filter drop-shadow-md" style={{backgroundImage: 'linear-gradient(90deg, #00b5d5, #0088b3)'}}>
              {texts.line2}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-white/90 tracking-widest pt-1 drop-shadow-md uppercase">
              {texts.sub}
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 lg:pt-6 max-w-xl md:max-w-2xl">
            <div className="flex items-center space-x-3 bg-black/30 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 shadow-xs motion-card-1">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/20 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/bed.png" alt="Rooms" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-white lg:text-slate-800 font-bold leading-tight tracking-wide">{texts.f1}</p>
            </div>
            <div className="flex items-center space-x-3 bg-black/30 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 shadow-xs motion-card-2">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/20 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/aqua-park1.png" alt="Aquapark" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-white lg:text-slate-800 font-bold leading-tight tracking-wide">{texts.f2}</p>
            </div>
            <div className="flex items-center space-x-3 bg-black/30 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 shadow-xs motion-card-3">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/20 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/carousel.png" alt="Lunapark" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-white lg:text-slate-800 font-bold leading-tight tracking-wide">{texts.f4}</p>
            </div>
            <div className="flex items-center space-x-3 bg-black/30 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 shadow-xs motion-card-4">
              <div className="w-13 h-13 rounded-lg bg-[#00b5d5]/20 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/spoon.png" alt="Restaurant" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <p className="text-[12px] lg:text-[12.5px] text-white lg:text-slate-800 font-bold leading-tight tracking-wide">{texts.f3}</p>
            </div>
          </div>
        </div>

        {/* Right: Premium Stats + CTA Panel */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0 anim-panel-motion">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-[0_20px_50px_rgba(30,50,92,0.12)] border border-white/80 space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pb-6 border-b border-stone-100">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-[#00b5d5]/10 rounded-xl flex items-center justify-center mx-auto">
                  <BedDouble className="w-5 h-5 text-[#00b5d5]" />
                </div>
                <p className="text-2xl font-black text-[#1e325c]">500+</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{texts.statRooms}</p>
              </div>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-[#00b5d5]/10 rounded-xl flex items-center justify-center mx-auto">
                  <Waves className="w-5 h-5 text-[#00b5d5]" />
                </div>
                <p className="text-2xl font-black text-[#1e325c]">20+</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{texts.statAqua}</p>
              </div>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <p className="text-2xl font-black text-[#1e325c]">4.9</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{texts.statRating}</p>
              </div>
            </div>

            {/* Review highlight */}
            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex -space-x-2 shrink-0 mt-0.5">
                {['#00b5d5','#ff6c02','#1e325c'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{ background: c }}>
                    {['A','K','L'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  {currentLang === 'az' ? '"Ailə ilə gəldik — hər şey mükəmməl idi!"' :
                   currentLang === 'ru' ? '"Приехали семьей — всё было идеально!"' :
                   '"Came with family — everything was perfect!"'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  const el = document.getElementById('booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else router.push('/#booking');
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md shadow-[#ff6c02]/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <CalendarCheck className="w-4 h-4" />
                {texts.btnBook}
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('rooms');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else router.push('/#rooms');
                }}
                className="flex items-center justify-center gap-2 w-full bg-white border-2 border-[#1e325c]/15 hover:border-[#00b5d5] text-[#1e325c] text-[13px] font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer hover:bg-[#00b5d5]/5"
              >
                {texts.btnRooms}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Location badge */}
            <p className="text-center text-[10px] text-stone-400 font-medium">
              📍 Novxanı, Bakı · Xəzər sahili
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}