import { Metadata } from 'next';
import RestoranPageClient from './RestoranPageClient';

export const metadata: Metadata = {
  title: 'Restoranlar və Barlar | Novxanıda Ən Dadlı Təamlar | AF Hotel',
  description: 'AF Hotel-in dəniz mənzərəli restoranlarında Azərbaycan, Avropa və Gürcü mətbəxinin ən dadlı təamlarını dada, barlarında dincələ bilərsiniz.',
  keywords: ['AF Hotel restoran', 'Novxanı restoranlar', 'dənizkənarı restoran', 'AF Hotel menu', 'Baku fine dining', 'ailevi restoran', 'restoran novxani'],
  openGraph: {
    title: 'Restoranlar və Barlar | AF Hotel & Aqua Park',
    description: 'AF Hotel-in dəniz mənzərəli restoranlarında Azərbaycan, Avropa və Gürcü mətbəxinin ən dadlı təamlarını dada bilərsiniz.',
    url: 'https://afhotel.az/restoran',
    images: [
      {
        url: '/spoon.png',
        width: 1200,
        height: 630,
        alt: 'Restoranlar və Barlar - AF Hotel Novxani',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/restoran',
  }
};

export default function RestoranPage() {
  return <RestoranPageClient />;
}
