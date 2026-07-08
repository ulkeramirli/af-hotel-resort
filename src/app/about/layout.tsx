import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AF Hotel Haqqında | Novxanı Premium Kurort',
  description: 'AF Hotel & Aqua Park — Novxanı sahilindəki premium 5 ulduzlu kurort haqqında. Missiyamız, hekayəmiz və dəyərlərimiz.',
  keywords: ['AF Hotel haqqında', 'Novxanı kurort', 'AF Hotel tarixi', 'Baku luxury resort about', '5 star hotel Azerbaijan'],
  openGraph: {
    title: 'AF Hotel Haqqında | Novxanı Premium Kurort',
    description: 'Novxanı sahilindəki premium 5 ulduzlu kurort. Xəzər dənizinin sahilində unudulmaz istirahət.',
    url: 'https://af-hotel.az/about',
    images: [{ url: '/AF-hero.jpg', width: 1200, height: 630 }],
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
