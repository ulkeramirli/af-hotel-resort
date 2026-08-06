import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'AF Hotel, Aqua Park & AF Park Complex | İstirahət Mərkəzi',
  description: 'Novxanıda yerləşən AF Hotel & Aqua Park-da ailəvi istirahət, rahat otaqlar, hovuzlar və 25-dən çox su əyləncəsi sizi gözləyir.',
  openGraph: {
    title: 'AF Hotel, Aqua Park & AF Park Complex | İstirahət Mərkəzi',
    description: 'Novxanıda yerləşən AF Hotel & Aqua Park-da ailəvi istirahət, rahat otaqlar, hovuzlar və 25-dən çox su əyləncəsi sizi gözləyir.',
    url: 'https://afhotel.az/',
    siteName: 'AF Hotel, Aqua Park & AF Park Complex',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel & Aqua Park Resort in Baku, Novkhani',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function Home() {
  return <HomePageClient />;
}
