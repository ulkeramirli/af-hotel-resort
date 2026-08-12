import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'AF Hotel, Aqua Park & AF Park | Novxanıda İstirahət',
  description: 'Baku və Novxanıda ən yaxşı ailəvi istirahət mərkəzi! AF Hotel, ən böyük Aqua Park, lüks otaqlar, restoranlar və atraksionlarla dolu AF Park. Booking-dən daha sərfəli qiymətlərlə birbaşa bron edin.',
  openGraph: {
    title: 'AF Hotel, Aqua Park & AF Park | Novxanıda İstirahət',
    description: 'Baku və Novxanıda ən yaxşı ailəvi istirahət mərkəzi! AF Hotel, ən böyük Aqua Park, lüks otaqlar, restoranlar və atraksionlarla dolu AF Park. Booking-dən daha sərfəli qiymətlərlə birbaşa bron edin.',
    url: 'https://afhotel.az/',
    siteName: 'AF Hotel, Aqua Park & AF Park | İstirahət və Əyləncə',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel, Aqua Park & AF Park Complex — Resort and Amusement Park in Baku',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function Home() {
  return <HomePageClient />;
}
