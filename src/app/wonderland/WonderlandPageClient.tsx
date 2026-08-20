'use client';

import WonderlandComponent from "@/components/Wonderland";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WonderlandPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'AF Park', en: 'AF Park', ru: 'AF Park' };
  const subs = { az: 'SEHRLI ALƏM — AİLƏ ÜÇÜN', en: 'MAGICAL WORLD — FOR FAMILIES', ru: 'ВОЛШЕБНЫЙ МИР — ДЛЯ СЕМЬИ' };
  return (
    <div className="w-full min-h-screen">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/karusel.jpg"
        variant="wonderland"
      />
      <div className="py-12 bg-[#f8fafc]">
        <WonderlandComponent />
      </div>
    </div>
  );
}
