import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wonderland Baku | Möhtəşəm Lunapark',
  description: 'AF Hotel daxilində Wonderland ailəvi əyləncə parkı və lunapark. Uşaqlar və böyüklər üçün karusellər, oyun aparatları və unudulmaz vaxt.',
  keywords: ['Wonderland Baku', 'Lunapark AF Hotel', 'uşaq əyləncə mərkəzi', 'karusellər Bakı', 'Wonderland Novxanı'],
  openGraph: {
    title: 'Wonderland Baku | Möhtəşəm Lunapark',
    description: 'AF Hotel daxilində Wonderland ailəvi əyləncə parkı. Karusellər və oyun aparatları.',
    url: 'https://af-hotel.az/wonderland',
    images: [{ url: '/AF-aqua2.jpg', width: 1200, height: 630 }],
  }
};

export default function WonderlandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
