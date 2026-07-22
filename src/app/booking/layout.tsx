import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onlayn Rezervasiya | AF Hotel & Aqua Park',
  description: 'AF Hotel & Aqua Park-da otaq və ya kotecinizi onlayn rezervasiya edin. Ən yaxşı qiymətlər və rahat qeydiyyat prosesi ilə istirahətinizi planlaşdırın.',
  keywords: ['Otel rezervasiyası', 'AF Hotel online booking', 'Novxani otel bron', 'book hotel Baku', 'rezervasiya', 'onlayn bron'],
  openGraph: {
    title: 'Onlayn Rezervasiya | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park-da otaq və ya kotecinizi onlayn rezervasiya edin. Ən yaxşı qiymətlər.',
    url: 'https://afhotel.az/booking',
    images: [{ url: '/AF-hero.jpg', width: 1200, height: 630 }],
  }
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
