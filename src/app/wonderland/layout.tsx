import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Park | Yaxında açılır',
  description: 'AF Hotel daxilində AF Park — yeni əyləncə mərkəzi tezliklə açılır. Karusellər, attraksionlar, uşaq oyun zonaları.',
  keywords: ['AF Park Baku', 'Lunapark AF Hotel', 'uşaq əyləncə mərkəzi', 'attraksionlar Bakı', 'AF Park Novxanı'],
  openGraph: {
    title: 'AF Park | Yaxında açılır',
    description: 'AF Hotel daxilində AF Park tezliklə açılır. Attraksionlar və oyun zonaları.',
    url: 'https://af-hotel.az/wonderland',
    images: [{ url: '/AF-aqua2.jpg', width: 1200, height: 630 }],
  }
};

export default function WonderlandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
