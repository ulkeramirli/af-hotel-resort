'use client';

import AquaparkComponent from "@/components/Aquapark";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AquaparkPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Aqua Park', en: 'Aqua Park', ru: 'Аквапарк' };
  const subs = { az: '10+ SU ƏYLƏNCƏSİ', en: '10+ WATER ATTRACTIONS', ru: '10+ ВОДНЫХ АТТРАКЦИОНОВ' };
  return (
    <div className="w-full min-h-screen">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-aqua3.jpg"
        variant="aquapark"
        imageClassName="object-cover object-[50%_0%] translate-y-20 md:translate-y-0 md:object-center"
      />
      <div className="py-12 bg-white">
        <AquaparkComponent />
      </div>
    </div>
  );
}
