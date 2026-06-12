'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function About() {
  const { language } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';

  const ABOUT = {
    az: {
      tag: "Haqqımızda",
      title: "AF Hotel & Aqua Park – Dəniz Kənarında Unudulmaz İstirahət",
      p1: "AF Hotel & Aqua Park Bakı şəhərinin Novxanı qəsəbəsində yerləşən müasir və geniş istirahət kompleksidir. Otel Xəzər dənizinin sahilində yerləşərək qonaqlara təmiz hava, gözəl dəniz mənzərəsi və rahat istirahət mühiti təqdim edir.",
      p2: "Kompleksdə müxtəlif kateqoriyalı otaqlar, lüks villalar, aqua park, restoranlar, spa mərkəzi, idman meydançaları və uşaqlar üçün əyləncə zonaları mövcuddur.",
      p3: "AF Hotel yalnız bir otel deyil, həm də tam istirahət təcrübəsidir — burada sakitlik, əyləncə və yüksək xidmət bir aradadır.",
      more: "Otaqlara Bax"
    },
    en: {
      tag: "About Us",
      title: "AF Hotel & Aqua Park – Unforgettable Seaside Experience",
      p1: "AF Hotel & Aqua Park is a modern resort complex located in Novkhany near Baku, offering fresh sea air and beautiful views of the Caspian Sea.",
      p2: "The resort includes various room types, luxury villas, aqua park, restaurants, spa center, sports areas, and entertainment zones for children.",
      p3: "AF Hotel is more than a hotel — it is a complete resort experience combining comfort, entertainment, and premium service.",
      more: "Explore Rooms"
    },
    ru: {
      tag: "О нас",
      title: "AF Hotel & Aqua Park – Незабываемый отдых у моря",
      p1: "AF Hotel & Aqua Park — современный курортный комплекс в Новханы, расположенный на берегу Каспийского моря.",
      p2: "На территории есть номера, виллы, аквапарк, рестораны, спа, спорт и зоны отдыха для детей.",
      p3: "AF Hotel — это не просто отель, а полноценный курорт с комфортом, развлечениями и высоким уровнем сервиса.",
      more: "Посмотреть Номера"
    }
  };

  const about = ABOUT[l];

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
    <section id="about" className="py-32 bg-white scroll-mt-20 select-none overflow-hidden font-sans">

      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

        {/* LEFT IMAGES */}
        <div className="lg:col-span-7 relative h-112.5 sm:h-125 md:h-162.5 w-full flex items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={leftCardVariants}
            className="absolute left-0 top-4 w-[90%] h-[68%] overflow-hidden shadow-2xl rounded-2xl"
          >
            <Image
              src="/AF-aqua.jpg"
              alt="AF Hotel"
              fill
              className="object-cover object-[center_30%]"
              priority
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rightCardVariants}
            className="absolute right-0 bottom-4 w-[80%] h-[50%] overflow-hidden shadow-2xl border-8 border-[#fdfbf7] rounded-2xl"
          >
            <Image
              src="/AF-aqua2.jpg"
              alt="AF Hotel Resort"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>

        </div>

        {/* RIGHT TEXT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
          className="lg:col-span-5 space-y-6"
        >

          <div className="space-y-3">
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block">
              {about.tag}
            </span>

            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] tracking-tight font-serif leading-[1.2]">
              {about.title}
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-500 font-light leading-relaxed max-w-xl">
            <p>{about.p1}</p>
            <p>{about.p2}</p>
            <p>{about.p3}</p>
          </div>

          <div className="pt-4 border-t border-stone-200/60 max-w-xs">
            <p className="font-serif italic text-xl text-[#1e325c] tracking-wide">
              AF Hotel & Resort
            </p>
          </div>

          <div className="pt-4">
            <a
              href="#rooms"
              className="inline-flex items-center justify-center bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[11px] font-medium uppercase tracking-widest px-8 py-3.5 rounded-xl"
            >
              {about.more}
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}