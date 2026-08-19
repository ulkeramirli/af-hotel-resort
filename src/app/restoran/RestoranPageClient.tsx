'use client';

import RestoranComponent from "@/components/Restoran";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RestoranPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Restoranlar', en: 'Restaurants', ru: 'Рестораны' };
  const subs = { az: 'LƏZİZ MƏTBƏX & MÜKƏMMƏL XİDMƏT', en: 'FINE DINING & PERFECT SERVICE', ru: 'ИЗЫСКАННАЯ КУХНЯ & ПРЕМИУМ СЕРВИС' };
  return (
    <div className="w-full min-h-screen bg-(--color-hotel-light)">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/restoran1.jpg"
        variant="restoran"
      />
      <div className="py-12">
        <RestoranComponent />
      </div>
    </div>
  );
}
