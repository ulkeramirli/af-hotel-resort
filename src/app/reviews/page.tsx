import { Metadata } from 'next';
import ReviewsPageClient from './ReviewsPageClient';

export const metadata: Metadata = {
  title: 'Qonaq Rəyləri | AF Hotel & Aqua Park | Novxanı, Bakı',
  description: 'AF Hotel & Aqua Park haqqında qonaqlarımızın rəyləri və təəssüratları. Real müştəri şərhlərini oxuyun.',
  keywords: ['AF Hotel rəylər', 'AF Hotel reviews', 'AF Hotel отзывы', 'qonaq rəyləri', 'musteri serhleri'],
  openGraph: {
    title: 'Qonaq Rəyləri | AF Hotel & Aqua Park',
    description: 'AF Hotel & Aqua Park haqqında qonaqlarımızın rəyləri və təəssüratları.',
    url: 'https://afhotel.az/reviews',
    images: [
      {
        url: '/AF-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AF Hotel Rəylər - Novxanı',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://afhotel.az/reviews',
  }
};

export default function ReviewsPage() {
  return <ReviewsPageClient />;
}
