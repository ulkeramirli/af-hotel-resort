import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Hotel Əlaqə | Ünvan, Telefon & Yer',
  description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Ünvan: Novxanı, Bakı. Telefon, e-poçt və Google Xəritə ilə yerləşmə məlumatları.',
  keywords: ['AF Hotel əlaqə', 'AF Hotel ünvan', 'Novxanı hotel telefon', 'AF Hotel Baku contact', 'how to get to AF Hotel'],
  openGraph: {
    title: 'AF Hotel Əlaqə | Ünvan, Telefon & Yer',
    description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Novxanı, Bakı. Telefon, e-poçt və yer məlumatları.',
    url: 'https://af-hotel.az/contacts',
    images: [{ url: '/AF-hero.jpg', width: 1200, height: 630 }],
  }
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
