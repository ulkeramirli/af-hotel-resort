import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Park Wonderland | Ailəvi Əyləncə Parkı',
  description: 'Novxanıda yerləşən AF Park Wonderland — attraksionlar, karusellər və sehrli aləm. Ailənizlə birlikdə unudulmaz vaxt keçirin.',
  keywords: ['AF Park', 'Wonderland Baku', 'əyləncə parkı Novxanı', 'lunapark', 'attraksionlar Bakı', 'uşaqlar üçün əyləncə', 'amusement park Azerbaijan'],
  openGraph: {
    title: 'AF Park Wonderland | Ailəvi Əyləncə Parkı',
    description: 'Novxanıda yerləşən AF Park Wonderland — attraksionlar, karusellər və sehrli aləm.',
    url: 'https://afhotel.az/wonderland',
    images: [{ url: '/carousel.jpg', width: 1200, height: 630 }],
  }
};

export default function WonderlandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
