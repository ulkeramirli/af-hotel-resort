'use client';

import ReviewsComponent from "@/components/Reviews";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ReviewsPageClient() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Qonaq Rəyləri', en: 'Guest Reviews', ru: 'Отзывы Гостей' };
  const subs = { az: 'QONAQLARIMIZ DANIŞIR', en: "OUR GUESTS SPEAK", ru: 'ГОВОРЯТ НАШИ ГОСТИ' };
  return (
    <div className="w-full  min-h-screen bg-(--color-hotel-light)">
      <PageHero
        title={titles[l as 'az'|'en'|'ru']}
        subtitle={subs[l as 'az'|'en'|'ru']}
        imagePath="/AF-reviews.jpg"
        variant="contacts"
      />
      <div>
        <ReviewsComponent />
      </div>
    </div>
  );
}
