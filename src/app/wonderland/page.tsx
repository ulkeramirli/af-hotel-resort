import { Metadata } from 'next';
import WonderlandPageClient from './WonderlandPageClient';

export const metadata: Metadata = {
  title: 'AF Park Wonderland | Bakıda Ən Böyük Ailəvi Əyləncə Parkı',
  description: 'AF Park Wonderland əyləncə mərkəzində hər yaşdan uşaqlar və böyüklər üçün karusellər, atraksionlar və unudulmaz anlar olacaq. Novxanıda ən yaxşı istirahət.',
  keywords: ['AF Park', 'Wonderland Baku', 'əyləncə parkı Novxanı', 'lunapark', 'attraksionlar Bakı', 'uşaqlar üçün əyləncə', 'amusement park Azerbaijan', 'ailevi eylence merkezi'],
  openGraph: {
    title: 'AF Park Wonderland | Əyləncə Mərkəzi - AF Hotel',
    description: 'AF Park Wonderland əyləncə mərkəzində hər yaşdan uşaqlar və böyüklər üçün karusellər, atraksionlar və unudulmaz anlar.',
    url: 'https://afhotel.az/wonderland',
    images: [
      {
        url: '/karusel.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Park Wonderland - Baku, Novxani',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/wonderland',
  }
};

export default function WonderlandPage() {
  return <WonderlandPageClient />;
}
