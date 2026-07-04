import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Aqua Park | Ən Böyük Su Əyləncə Mərkəzi',
  description: 'Azərbaycanın ən böyük aquaparkında 20-dən çox su sürüşkəni, uşaq hovuzları və ekstremal əyləncələr. AF Hotel & Aqua Park.',
  keywords: ['AF Aqua park', 'Baku aqua park', 'Novxanı su parkı', 'Aqua park qiymətlər', 'uşaqlar üçün hovuz'],
  openGraph: {
    title: 'AF Aqua Park | Ən Böyük Su Əyləncə Mərkəzi',
    description: 'Azərbaycanın ən böyük aquaparkında 20-dən çox su sürüşkəni və ekstremal əyləncələr.',
    url: 'https://af-hotel.az/aquapark',
    images: [{ url: '/AF-aqua.jpg', width: 1200, height: 630 }],
  }
};

export default function AquaparkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
