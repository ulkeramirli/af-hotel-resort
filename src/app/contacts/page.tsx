import { Metadata } from 'next';
import ContactsPageClient from './ContactsPageClient';

export const metadata: Metadata = {
  title: 'Əlaqə | AF Hotel & Aqua Park Resort',
  description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Ünvan, telefon nömrələri və e-poçt ünvanımız. Bizimlə əlaqəyə keçin və rezervasiya edin.',
  openGraph: {
    title: 'Əlaqə | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Ünvan, telefon nömrələri və e-poçt ünvanımız. Bizimlə əlaqəyə keçin və rezervasiya edin.',
    url: 'https://afhotel.az/contacts',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel Əlaqə - Novxanı',
      },
    ],
  },
};

export default function ContactsPage() {
  return <ContactsPageClient />;
}
