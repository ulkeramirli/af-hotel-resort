'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="relative min-h-[95vh] lg:min-h-screen pt-28 pb-12 flex items-center bg-stone-50 overflow-hidden select-none">
      {/* Background image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 w-full h-full"
      >
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
      </motion.div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left: Text + feature cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 space-y-6 lg:space-y-8 text-left"
        >
          <motion.div variants={itemVariants} className="space-y-1 md:space-y-2 drop-shadow-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase leading-tight drop-shadow-md">
              {texts.line1}
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-[56px] font-black text-transparent bg-clip-text tracking-tight uppercase leading-tight pb-2 filter drop-shadow-md" style={{backgroundImage: 'linear-gradient(90deg, #00b5d5, #0088b3)'}}>
              {texts.line2}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-white/90 tracking-widest pt-1 drop-shadow-md uppercase">
              {texts.sub}
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5 pt-4 lg:pt-6 max-w-xl md:max-w-2xl">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2.5 bg-white/80 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/60 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-[#00b5d5]/15 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/bed.png" alt="Rooms" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <p className="text-[11px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f1}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2.5 bg-white/80 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/60 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-[#00b5d5]/15 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/aqua-park1.png" alt="Aquapark" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <p className="text-[11px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f2}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2.5 bg-white/80 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/60 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-[#00b5d5]/15 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/carousel.png" alt="Lunapark" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <p className="text-[11px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f4}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2.5 bg-white/80 lg:bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/60 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-[#00b5d5]/15 flex items-center justify-center shrink-0 border border-[#00b5d5]/30">
                <Image src="/spoon.png" alt="Restaurant" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <p className="text-[11px] lg:text-[12.5px] text-slate-800 font-bold leading-tight tracking-wide">{texts.f3}</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: Premium Stats + CTA Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0"
        >
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
        </motion.div>

      </div>
    </section>
  );
}