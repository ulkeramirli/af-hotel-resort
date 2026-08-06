import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Haqqımızda | AF Hotel, Aqua Park & AF Park Complex',
  description: 'AF Hotel & Aqua Park haqqında məlumat. Azərbaycanın ən böyük ailəvi istirahət və əyləncə mərkəzi.',
  openGraph: {
    title: 'Haqqımızda | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park haqqında məlumat. Azərbaycanın ən böyük ailəvi istirahət və əyləncə mərkəzi.',
    url: 'https://afhotel.az/about',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel & Aqua Park Haqqımızda',
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
