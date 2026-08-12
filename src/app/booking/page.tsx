'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import Booking from "@/components/Booking";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function BookingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";

  const texts = {
    az: { back: "Geri qayıt", tag: "ONLİNE REZERVASYON", title: "Otağınızı Seçin", sub: "Asan, sürətli və etibarlı" },
    en: { back: "Go Back", tag: "ONLINE BOOKING", title: "Reserve Your Room", sub: "Easy, fast and reliable" },
    ru: { back: "Назад", tag: "ОНЛАЙН БРОНИРОВАНИЕ", title: "Забронируйте Номер", sub: "Легко, быстро и надежно" },
  }[l];

  return (
    <div className="min-h-screen bg-[#f7f5f0] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00b5d5]/5 blur-[150px]" />
        <div className="absolute top-[50%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c5a880]/5 blur-[150px]" />
      </div>

      {/* Hero Banner */}
      <div className="relative h-100 md:h-120 w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/AF-aqua.jpg"
            alt="AF Hotel Booking"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        
        {/* Subtle Gradients for Left-Aligned Text */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0f1e]/95 via-[#0a0f1e]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0a0f1e]/10 to-[#f7f5f0] pointer-events-none" />
        
        <div className="relative z-10 w-full h-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-end pb-16 md:pb-20 pt-32 md:pt-40">
          {/* Minimalist Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
             <button
              onClick={() => router.back()}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white text-xs sm:text-sm font-bold tracking-wide border border-white/10 hover:border-white/30 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {texts.back}
            </button>
          </motion.div>

          {/* Left-Aligned Typography Block */}
          <div className="flex flex-col items-start space-y-2 md:space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/30 backdrop-blur-sm shadow-sm">
                <CalendarCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#c5a880]" />
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#c5a880] uppercase drop-shadow-md">
                {texts.tag}
              </span>
              <div className="w-16 h-px bg-linear-to-r from-[#c5a880]/50 to-transparent hidden sm:block" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-2xl"
            >
              {texts.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-white/80 text-sm md:text-lg font-medium tracking-wide max-w-lg leading-relaxed drop-shadow-lg"
            >
              {texts.sub}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="relative z-20 -mt-8">
        <Booking standalone />
      </div>
    </div>
  );
}
