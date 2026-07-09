'use client';

import AboutComponent from "@/components/About";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Haqqımızda', en: 'About Us', ru: 'О нас' };
  const subs = { az: 'AF HOTEL & AQUA PARK KOMPLEKSİ', en: 'AF HOTEL & AQUA PARK COMPLEX', ru: 'AF HOTEL & AQUA PARK КОМПЛЕКС' };
  return (
    <div className="w-full min-h-screen bg-[var(--color-hotel-light)]">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-hero.jpg"
        variant="about"
      />
      <div className="py-12">
        <AboutComponent />
      </div>
    </div>
  );
}
