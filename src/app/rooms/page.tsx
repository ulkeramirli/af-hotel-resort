import { Metadata } from 'next';
import RoomsPageClient from './RoomsPageClient';

export const metadata: Metadata = {
  title: 'Otaqlar və Koteclər | AF Hotel & Aqua Park Resort',
  description: 'AF Hotel & Aqua Park-da rahat otaqlar və koteclər. Ailəvi istirahət üçün dəniz mənzərəli nömrələr və lüks koteclər sərfəli qiymətlərlə.',
  openGraph: {
    title: 'Otaqlar və Koteclər | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park-da rahat otaqlar və koteclər. Ailəvi istirahət üçün dəniz mənzərəli nömrələr və lüks koteclər sərfəli qiymətlərlə.',
    url: 'https://afhotel.az/rooms',
    images: [
      {
        url: '/AF-hotel.jpg',
        width: 1200,
        height: 630,
        alt: 'Otaqlar və Koteclər - AF Hotel',
      },
    ],
  },
};

export default function RoomsPage() {
  return <RoomsPageClient />;
}
