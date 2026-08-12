import { Metadata } from 'next';
import AquaparkPageClient from './AquaparkPageClient';

export const metadata: Metadata = {
  title: 'Aqua Park | Bakı və Novxanıda Ən Böyük Su Əyləncə Mərkəzi',
  description: 'AF Hotel & Aqua Park-da 25-dən çox su atraksionu, sürüşmələr və böyük hovuzlar sizi gözləyir. Ailəvi istirahət və əyləncə üçün mükəmməl su parkı.',
  keywords: ['Aqua park baku', 'su parkı', 'aquapark Novxani', 'water park Azerbaijan', 'ailəvi su əyləncəsi', 'hovuzlu istirahet', 'AF Hotel aquapark qiymetleri'],
  openGraph: {
    title: 'Aqua Park | Bakı və Novxanıda Su Əyləncəsi',
    description: 'Azərbaycanın ən böyük su əyləncə mərkəzlərindən biri olan Aqua Park-da 25-dən çox su atraksionu və hovuzlar sizi gözləyir.',
    url: 'https://afhotel.az/aquapark',
    images: [
      {
        url: '/AF-aqua2.jpg',
        width: 1200,
        height: 630,
        alt: 'Aqua Park - AF Hotel Novxani',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/aquapark',
  }
};

export default function AquaparkPage() {
  return <AquaparkPageClient />;
}
