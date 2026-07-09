'use client';

import AquaparkComponent from "@/components/Aquapark";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AquaparkPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Aqua Park', en: 'Aqua Park', ru: 'Аквапарк' };
  const subs = { az: '25+ SU ƏYLƏNCƏSİ', en: '25+ WATER ATTRACTIONS', ru: '25+ ВОДНЫХ АТТРАКЦИОНОВ' };
  return (
    <div className="w-full min-h-screen bg-[var(--color-hotel-light)]">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-aqua2.jpg"
        variant="aquapark"
      />
      <div className="py-12">
        <AquaparkComponent />
      </div>
    </div>
  );
}
