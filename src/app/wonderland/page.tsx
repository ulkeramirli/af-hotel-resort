'use client';

import WonderlandComponent from "@/components/Wonderland";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WonderlandPage() {
  const { language } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';
  const titles = { az: 'Wonderland', en: 'Wonderland', ru: 'Вондерлэнд' };
  const subs = { az: 'SEHRLI ALƏM — AİLƏ ÜÇÜN', en: 'MAGICAL WORLD — FOR FAMILIES', ru: 'ВОЛШЕБНЫЙ МИР — ДЛЯ СЕМЬИ' };
  return (
    <div className="w-full min-h-screen bg-[var(--color-hotel-light)]">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-aqua.jpg"
        variant="wonderland"
      />
      <div className="py-12">
        <WonderlandComponent />
      </div>
    </div>
  );
}
