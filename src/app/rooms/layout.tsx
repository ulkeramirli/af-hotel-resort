import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Hotel & Aqua Park | Otaqlar & Lüks Villalar',
  description: 'Xəzər dənizi sahilində, Novxanıda ən yaxşı otaqlar, lüks villalar və ailəvi koteclər. Rezervasiya üçün AF Hotel Baku rəsmi saytı.',
  keywords: ['AF Hotel otaqlar', 'Novxanı lüks villalar', 'Baku hotel reservation', 'AF Hotel Baku qiymətlər', 'Caspian sea hotel rooms'],
  openGraph: {
    title: 'AF Hotel & Aqua Park | Otaqlar & Lüks Villalar',
    description: 'Xəzər dənizi sahilində, Novxanıda ən yaxşı otaqlar və lüks villalar. Dəniz mənzərəli nömrələr.',
    url: 'https://af-hotel.az/rooms',
    images: [{ url: '/AF-hotel.jpg', width: 1200, height: 630 }],
  }
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
