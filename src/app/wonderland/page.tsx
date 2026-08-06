import { Metadata } from 'next';
import WonderlandPageClient from './WonderlandPageClient';

export const metadata: Metadata = {
  title: 'AF Park Wonderland | Əyləncə Mərkəzi - AF Hotel',
  description: 'Tezliklə açılacaq AF Park Wonderland əyləncə mərkəzində hər yaşdan uşaqlar və böyüklər üçün karusellər, atraksionlar və unudulmaz anlar olacaq.',
  openGraph: {
    title: 'AF Park Wonderland | Əyləncə Mərkəzi',
    description: 'Tezliklə açılacaq AF Park Wonderland əyləncə mərkəzində hər yaşdan uşaqlar və böyüklər üçün karusellər, atraksionlar və unudulmaz anlar olacaq.',
    url: 'https://afhotel.az/wonderland',
    images: [
      {
        url: '/AF-aqua2.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Park Wonderland - Baku, Novkhani',
      },
    ],
  },
};

export default function WonderlandPage() {
  return <WonderlandPageClient />;
}
