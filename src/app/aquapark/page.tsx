import { Metadata } from 'next';
import AquaparkPageClient from './AquaparkPageClient';

export const metadata: Metadata = {
  title: 'Aqua Park | AF Hotel & Aqua Park Resort',
  description: 'Azərbaycanın ən böyük su əyləncə mərkəzlərindən biri olan Aqua Park-da 25-dən çox su atraksionu və hovuzlar sizi gözləyir.',
  openGraph: {
    title: 'Aqua Park | AF Hotel & Aqua Park',
    description: 'Azərbaycanın ən böyük su əyləncə mərkəzlərindən biri olan Aqua Park-da 25-dən çox su atraksionu və hovuzlar sizi gözləyir.',
    url: 'https://afhotel.az/aquapark',
    images: [
      {
        url: '/AF-aqua2.jpg',
        width: 1200,
        height: 630,
        alt: 'Aqua Park - AF Hotel Novkhani',
      },
    ],
  },
};

export default function AquaparkPage() {
  return <AquaparkPageClient />;
}
