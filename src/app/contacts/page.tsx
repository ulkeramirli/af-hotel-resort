import { Metadata } from 'next';
import ContactsPageClient from './ContactsPageClient';

export const metadata: Metadata = {
  title: 'Əlaqə və Ünvan | AF Hotel & Aqua Park | Novxanı, Bakı',
  description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Ünvan: Novxanı qəsəbəsi, Bakı. Telefon nömrələri, e-poçt və xəritədə yerləşmə yeri.',
  keywords: ['AF Hotel əlaqə', 'AF Hotel ünvan', 'Novxanı hotel telefon', 'AF Hotel Baku contact', 'how to get to AF Hotel', 'otel nomreleri'],
  openGraph: {
    title: 'Əlaqə və Ünvan | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park ilə əlaqə saxlayın. Ünvan, telefon nömrələri və e-poçt ünvanımız. Rezervasiya üçün bizimlə əlaqəyə keçin.',
    url: 'https://afhotel.az/contacts',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel Əlaqə - Novxanı',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/contacts',
  }
};

export default function ContactsPage() {
  return <ContactsPageClient />;
}
