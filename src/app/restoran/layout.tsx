import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Hotel Restoranlar | Ləziz Təamlar',
  description: 'AF Hotel & Aqua Park restoranlarında milli və Avropa mətbəxinin ən dadlı təamları. Açıq hava terrası, dəniz mənzərəsi və yüksək xidmət.',
  keywords: ['AF Hotel restoran', 'Novxanı restoranlar', 'dənizkənarı restoran', 'AF Hotel menu', 'Baku fine dining'],
  openGraph: {
    title: 'AF Hotel Restoranlar | Ləziz Təamlar',
    description: 'Milli və Avropa mətbəxinin ən dadlı təamları. Açıq hava terrası və dəniz mənzərəsi.',
    url: 'https://af-hotel.az/restoran',
    images: [{ url: '/AF-hotel.jpg', width: 1200, height: 630 }],
  }
};

export default function RestoranLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
