'use client';

import RoomsComponent from "@/components/Rooms";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RoomsPage() {
  const { language } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';
  const titles = { az: 'Otaqlar & Koteclər', en: 'Rooms & Cottages', ru: 'Номера и Коттеджи' };
  const subs = { az: 'LÜKSİ YENİDƏN KƏŞF EDİN', en: 'REDEFINE LUXURY', ru: 'ПЕРЕОСМЫСЛИТЕ РОСКОШЬ' };
  return (
    <div className="w-full min-h-screen bg-[var(--color-hotel-light)]">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-hotel.jpg"
        variant="rooms"
      />
      <div className="py-12">
        <RoomsComponent />
      </div>
    </div>
  );
}
