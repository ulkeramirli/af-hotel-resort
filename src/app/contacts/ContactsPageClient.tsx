'use client';

import ContactsComponent from "@/components/Contacts";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactsPage() {
  const { language } = useLanguage();
  const l = language;
  const titles = { az: 'Əlaqə', en: 'Contact Us', ru: 'Контакты' };
  const subs = { az: 'BİZİMLƏ ƏLAQƏ SAXLAYIN', en: "LET'S STAY IN TOUCH", ru: 'СВЯЖИТЕСЬ С НАМИ' };
  return (
    <div className="w-full min-h-screen bg-[var(--color-hotel-light)]">
      <PageHero
        title={titles[l]}
        subtitle={subs[l]}
        imagePath="/AF-aqua.jpg"
        variant="contacts"
      />
      <div className="py-12">
        <ContactsComponent />
      </div>
    </div>
  );
}
