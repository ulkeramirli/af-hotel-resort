    'use client';
    import { useLanguage } from '@/contexts/LanguageContext';
    import { useRouter } from 'next/navigation';
    import Image from 'next/image';
    import { motion, useScroll, useTransform } from 'framer-motion';
    import { CalendarCheck, BedDouble, Waves, Star, ArrowRight } from 'lucide-react';
    import TiltCard from './TiltCard';
    import MagneticButton from './MagneticButton';
    import TextReveal from './TextReveal';

    export default function Hero() {
      const { t } = useLanguage();
      const router = useRouter();
      const { scrollY } = useScroll();
      const yBg = useTransform(scrollY, [0, 1000], [0, 300]); // Parallax effect

      const handleNav = (path: string, hash: string) => {
        if (window.innerWidth >= 1024) {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push(path);
        }
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.05 }
        }
      };

    const itemVariants = {
      hidden: { opacity: 0, y: 20, scale: 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          ease: "easeOut" as const,
          duration: 0.5,
        }
      }
    };

      return (
        <section className="relative min-h-[95vh] lg:min-h-screen pt-28 pb-16 lg:pb-24 flex items-center bg-stone-50 overflow-hidden select-none">
          {/* Background image */}
          <motion.div 
            style={{ y: yBg }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" as const }}
            className="absolute inset-0 z-0 w-full h-[120%]"
          >
            <Image
              src="/AF-aqua.jpg"
              alt="AF Hotel Grand Aquapark"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[25%_center] md:object-center w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 md:bg-black/30 lg:bg-none" />
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
              <motion.div variants={itemVariants} className="space-y-4 md:space-y-5">
                {/* Small elegant badge */}
                <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm lg:bg-[#00b5d5]/10 border border-white/30 lg:border-[#00b5d5]/20 px-4 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c02] animate-pulse shrink-0" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white lg:text-[#00b5d5]">
                    {t.hero.line1}
                  </span>
                </div>

                {/* Main heading */}
                <div>
                  <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-wide text-[#1e325c] filter-[drop-shadow(0_0_15px_rgba(255,255,255,0.8))_drop-shadow(0_0_30px_rgba(255,255,255,0.8))] lg:filter-none"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    <TextReveal text={t.hero.line2} delay={0.2} />
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xs font-light uppercase tracking-[0.15em] text-white/90 lg:text-stone-500 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] lg:text-shadow-none">
                  {t.hero.sub}
                </p>
              </motion.div>

              {/* Feature cards — clickable, soft square shape */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 lg:pt-6 max-w-lg md:max-w-xl">
                <TiltCard tiltAmount={10} className="h-full">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => handleNav('/rooms', 'rooms')} className="w-full h-full flex flex-row items-center space-x-3 bg-white/95 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-100 shadow-[0_6px_20px_rgba(0,0,0,0.08)] cursor-pointer text-left transition-all hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00b5d5]/10 flex items-center justify-center shrink-0 border border-[#00b5d5]/20 group-hover:scale-105 transition-transform">
                      <Image src="/bed.png" alt="Rooms" width={32} height={32} className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-snug tracking-wide">{t.hero.f1}</p>
                  </motion.button>
                </TiltCard>
                <TiltCard tiltAmount={10} className="h-full">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => handleNav('/aquapark', 'aquapark')} className="w-full h-full flex flex-row items-center space-x-3 bg-white/95 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-100 shadow-[0_6px_20px_rgba(0,0,0,0.08)] cursor-pointer text-left transition-all hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00b5d5]/10 flex items-center justify-center shrink-0 border border-[#00b5d5]/20 group-hover:scale-105 transition-transform">
                      <Image src="/aqua-park1.png" alt="Aquapark" width={32} height={32} className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-snug tracking-wide">{t.hero.f2}</p>
                  </motion.button>
                </TiltCard>
                <TiltCard tiltAmount={10} className="h-full">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => handleNav('/wonderland', 'wonderland')} className="w-full h-full flex flex-row items-center space-x-3 bg-white/95 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-100 shadow-[0_6px_20px_rgba(0,0,0,0.08)] cursor-pointer text-left transition-all hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00b5d5]/10 flex items-center justify-center shrink-0 border border-[#00b5d5]/20 group-hover:scale-105 transition-transform">
                      <Image src="/carousel.png" alt="Lunapark" width={32} height={32} className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-snug tracking-wide">{t.hero.f4}</p>
                  </motion.button>
                </TiltCard>
                <TiltCard tiltAmount={10} className="h-full">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => handleNav('/restoran', 'restoran')} className="w-full h-full flex flex-row items-center space-x-3 bg-white/95 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-100 shadow-[0_6px_20px_rgba(0,0,0,0.08)] cursor-pointer text-left transition-all hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00b5d5]/10 flex items-center justify-center shrink-0 border border-[#00b5d5]/20 group-hover:scale-105 transition-transform">
                      <Image src="/spoon.png" alt="Restaurant" width={32} height={32} className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-snug tracking-wide">{t.hero.f3}</p>
                  </motion.button>
                </TiltCard>
              </motion.div>
            </motion.div>

            {/* Right: Stats + CTA Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ease: "easeOut" as const, duration: 0.6, delay: 0.3 }}
              className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-5 sm:p-7 w-full max-w-md shadow-[0_16px_40px_rgba(30,50,92,0.10)] border border-white/60 space-y-4 sm:space-y-5">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pb-4 sm:pb-5 border-b border-stone-100/70">
                  <div className="text-center space-y-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00b5d5]/10 rounded-xl flex items-center justify-center mx-auto">
                      <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 text-[#00b5d5]" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-[#1e325c]">350+</p>
                    <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">{t.hero.statRooms}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00b5d5]/10 rounded-xl flex items-center justify-center mx-auto">
                      <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-[#00b5d5]" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-[#1e325c]">10+</p>
                    <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">{t.hero.statAqua}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-[#1e325c]">4.9</p>
                    <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">{t.hero.statRating}</p>
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
                      {t.hero.review}
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <MagneticButton
                    onClick={() => router.push('/booking')}
                    className="w-full block"
                  >
                    <div className="flex items-center justify-center gap-2 w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[13px] font-semibold uppercase tracking-widest py-4 rounded-2xl transition-all shadow-md shadow-[#ff6c02]/30 cursor-pointer">
                      <CalendarCheck className="w-4 h-4" />
                      {t.hero.bookBtn}
                    </div>
                  </MagneticButton>
                  <MagneticButton
                    onClick={() => router.push('/rooms')}
                    className="w-full block"
                  >
                    <div className="flex items-center justify-center gap-2 w-full bg-white/90 border border-[#1e325c]/20 hover:border-[#00b5d5] hover:bg-[#00b5d5]/5 text-[#1e325c] text-[13px] font-semibold uppercase tracking-widest py-3.5 rounded-2xl transition-all cursor-pointer">
                      {t.hero.btnRooms}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </MagneticButton>
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