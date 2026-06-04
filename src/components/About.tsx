'use client';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function About() {
  const { t } = useLanguage();

  // Анимации появления
  const leftCardVariants: Variants = {
    hidden: { opacity: 0, x: -60, y: 10 },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      transition: { duration: 0.9, ease: 'easeOut' } 
    }
  };

  const rightCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, x: 40, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0, 
      transition: { duration: 0.9, delay: 0.2, ease: 'easeOut' } 
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } 
    }
  };

  return (
    <section id="about" className="py-32 bg-[#ffff] scroll-mt-20 select-none overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* ЛЕВАЯ СТОРОНА: Панорамный, вытянутый в ширину коллаж */}
        <div className="lg:col-span-7 relative h-112.5 sm:h-125 md:h-162.5 w-full flex items-center">
          
          {/* Большая левая картинка (Широкоформатная панорама, w-[80%] при h-[68%]) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={leftCardVariants}
            className="absolute left-0 top-4 w-[90%] h-[68%] overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-700 ease-out z-10 rounded-2xl"
          >
            <Image 
              src="/AF-aqua.jpg" 
              alt="Premium Living Space" 
              fill
              sizes="(max-width: 1024px) 85vw, 50vw"
              className="object-cover object-[center_30%]"
              priority
            />
          </motion.div>
          
          {/* Маленькая правая картинка (Тоже вытянута в ширину: w-[60%] при h-[50%]) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={rightCardVariants}
            className="absolute right-0 bottom-4 w-[80%] h-[50%] overflow-hidden shadow-2xl border-8 border-[#fdfbf7] transform hover:scale-[1.03] transition-transform duration-700 ease-out z-20 rounded-2xl"
          >
            <Image 
              src="/AF-aqua2.jpg" 
              alt="Luxury Suite Interior" 
              fill
              sizes="(max-width: 1024px) 65vw, 35vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

        </div>

        {/* ПРАВАЯ СТОРОНА: Стилизованный премиальный текст */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
          className="lg:col-span-5 space-y-6 text-left"
        >
          <div className="space-y-3">
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block">
              {t.about.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] tracking-tight font-serif leading-[1.2]">
              {t.about.title}
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-500 font-light leading-relaxed max-w-xl font-sans">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          {/* Премиальная подпись бренда */}
          <div className="pt-4 border-t border-stone-200/60 max-w-xs">
            <p className="font-serif italic text-xl text-[#1e325c] tracking-wide">AF Hotel & Resort</p>
            {/* <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Premium Standard</p> */}
          </div>

          <div className="pt-4">
            <a 
              href="#rooms" 
              className="inline-flex items-center justify-center bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[11px] font-medium uppercase tracking-widest px-8 py-3.5 transition-colors duration-300 shadow-sm rounded-xl"
            >
              {t.about.more}
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}