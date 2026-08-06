import { Metadata } from 'next';
import RestoranPageClient from './RestoranPageClient';

export const metadata: Metadata = {
  title: 'Restoranlar və Barlar | AF Hotel Novxanı',
  description: 'AF Hotel-in restoranlarında Azərbaycan, Avropa və Gürcü mətbəxinin ən dadlı təamlarını dada, barlarında dincələ bilərsiniz.',
  openGraph: {
    title: 'Restoranlar və Barlar | AF Hotel & Aqua Park',
    description: 'AF Hotel-in restoranlarında Azərbaycan, Avropa və Gürcü mətbəxinin ən dadlı təamlarını dada, barlarında dincələ bilərsiniz.',
    url: 'https://afhotel.az/restoran',
    images: [
      {
        url: '/AF-hotel.jpg',
        width: 1200,
        height: 630,
        alt: 'Restoranlar və Barlar - AF Hotel Novkhani',
      },
    ],
  },
};

export default function RestoranPage() {
  return <RestoranPageClient />;
}
