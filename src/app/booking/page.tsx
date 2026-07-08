'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import Booking from "@/components/Booking";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const l = (language as "az" | "en" | "ru") || "az";

  const texts = {
    az: { back: "Geri Qayıt", tag: "ONLİNE REZERVASYON", title: "Otağınızı Seçin", sub: "Asan, sürətli və etibarlı" },
    en: { back: "Go Back", tag: "ONLINE BOOKING", title: "Reserve Your Room", sub: "Easy, fast and reliable" },
    ru: { back: "Назад", tag: "ОНЛАЙН БРОНИРОВАНИЕ", title: "Забронируйте Номер", sub: "Легко, быстро и надежно" },
  }[l];

  return (
    <div className="min-h-screen bg-[#f7f5f0] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#00b5d5]/5 blur-[150px]" />
        <div className="absolute top-[50%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#c5a880]/5 blur-[150px]" />
      </div>

      {/* Hero Banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden">
        <Image
          src="/AF-aqua.jpg"
          alt="AF Hotel Booking"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0f1e]/70 via-[#0a0f1e]/50 to-[#f7f5f0]" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 md:px-12 max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-5 left-4 md:left-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold hover:bg-white/30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {texts.back}
          </button>

          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#c5a880] uppercase flex items-center gap-2">
              <CalendarCheck className="w-3 h-3" />
              {texts.tag}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white">{texts.title}</h1>
            <p className="text-white/60 text-sm font-light">{texts.sub}</p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="relative z-10 -mt-4">
        <Booking standalone />
      </div>
    </div>
  );
}
