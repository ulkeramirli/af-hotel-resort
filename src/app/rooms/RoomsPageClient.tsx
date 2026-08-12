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
      <div className="py-12">
        <RoomsComponent />
      </div>
    </div>
  );
}
