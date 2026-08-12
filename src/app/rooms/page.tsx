import { Metadata } from 'next';
import RoomsPageClient from './RoomsPageClient';

export const metadata: Metadata = {
  title: 'AF Hotel Otaqlar və Koteclər | Novxanıda Villalar və Nömrələr',
  description: 'AF Hotel & Aqua Park-da rahat otaqlar, villalar və koteclər. Ailəvi istirahət üçün dəniz mənzərəli nömrələr və lüks kotecləri ən sərfəli qiymətlərlə birbaşa bron edin.',
  keywords: ['AF Hotel otaqlar', 'Novxanı villalar', 'kotecler', 'dəniz mənzərəli otaqlar', 'AF Hotel qiymətlər', 'Novxani otel qiymetleri', 'baku hotel booking'],
  openGraph: {
    title: 'AF Hotel Otaqlar və Koteclər | Novxanıda Ən Yaxşı İstirahət',
    description: 'Xəzər dənizi sahilində, Novxanıda ən yaxşı otaqlar, villalar və ailəvi koteclər. Rezervasiya üçün AF Hotel Baku rəsmi saytı.',
    url: 'https://afhotel.az/rooms',
    images: [
      {
        url: '/rooms.jpg', // changed from AF-hotel.jpg to rooms.jpg which exists in public
        width: 1200,
        height: 630,
        alt: 'Otaqlar və Koteclər - AF Hotel',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/rooms',
  }
};

export default function RoomsPage() {
  return <RoomsPageClient />;
}
