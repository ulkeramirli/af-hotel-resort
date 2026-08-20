'use client';

import RoomsComponent from "@/components/Rooms";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RoomsPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Otaqlar & Koteclər', en: 'Rooms & Cottages', ru: 'Номера и Коттеджи' };
  const subs = { az: 'RAHATLIĞI YENİDƏN KƏŞF EDİN', en: 'REDEFINE COMFORT', ru: 'ПЕРЕОСМЫСЛИТЕ КОМФОРТ' };
  return (
    <div className="w-full min-h-screen bg-(--color-hotel-light)">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/rooms.jpg"
        variant="rooms"
        imageClassName="object-cover object-center"
      />
      <div>
        <RoomsComponent className="pt-24 pb-20 md:pt-28 md:pb-32 scroll-mt-20 bg-transparent text-stone-800 antialiased selection:bg-stone-100" />
      </div>
    </div>
  );
}
