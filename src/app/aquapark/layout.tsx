import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aqua Park | Bakının Ən Böyük Su Əyləncə Mərkəzi',
  description: 'AF Hotel & Aqua Park-da 25-dən çox su əyləncəsi, sürüşmələr və hovuzlar. Ailəvi istirahət üçün mükəmməl seçim. İndi biletləri və otaqları kəşf edin.',
  keywords: ['Aqua park', 'su parkı Baku', 'aquapark Novxani', 'water park Azerbaijan', 'ailəvi su əyləncəsi', 'hovuz', 'AF Hotel aquapark'],
  openGraph: {
    title: 'Aqua Park | Bakının Ən Böyük Su Əyləncə Mərkəzi',
    description: 'AF Hotel & Aqua Park-da 25-dən çox su əyləncəsi, sürüşmələr və hovuzlar. Ailəvi istirahət.',
    url: 'https://afhotel.az/aquapark',
    images: [{ url: '/AF-aqua.jpg', width: 1200, height: 630 }],
  }
};

export default function AquaparkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
