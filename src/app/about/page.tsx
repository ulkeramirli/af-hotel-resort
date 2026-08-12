import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Haqqımızda | AF Hotel, Aqua Park & AF Park Complex',
  description: 'AF Hotel & Aqua Park haqqında məlumat. Azərbaycanın ən böyük ailəvi istirahət və əyləncə mərkəzi. Novxanı sahilindəki 4 ulduzlu kurort, missiyamız və dəyərlərimiz.',
  keywords: ['AF Hotel haqqında', 'Novxanı kurort', 'AF Hotel tarixi', 'Baku resort about', '4 star hotel Azerbaijan', 'ailevi istirahet merkezi'],
  openGraph: {
    title: 'Haqqımızda | AF Hotel & Aqua Park | Novxanı',
    description: 'AF Hotel & Aqua Park haqqında ətraflı məlumat. Azərbaycanın ən böyük ailəvi istirahət və əyləncə mərkəzi ilə tanış olun.',
    url: 'https://afhotel.az/about',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel & Aqua Park Haqqımızda',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/about',
  }
};

export default function AboutPage() {
  return <AboutPageClient />;
}
