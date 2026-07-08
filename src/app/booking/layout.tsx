import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Hotel Rezervasiya | Online Otel Bron Et',
  description: 'AF Hotel & Aqua Park Novxanıda online rezervasiya. Birbaşa saytdan ən yaxşı qiymətlə otaq seçin və anında bron edin.',
  keywords: ['AF Hotel bron', 'Novxanı hotel reservation', 'online booking Baku', 'AF Hotel price', 'book AF Hotel'],
  openGraph: {
    title: 'AF Hotel Rezervasiya | Online Otel Bron Et',
    description: 'Birbaşa saytdan ən yaxşı qiymətlə otaq seçin. Novxanı sahilindəki 5 ulduzlu kurort.',
    url: 'https://af-hotel.az/booking',
    images: [{ url: '/AF-hotel.jpg', width: 1200, height: 630 }],
  }
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
