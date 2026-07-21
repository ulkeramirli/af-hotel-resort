import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-cormorant'
});

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"], 
  variable: '--font-montserrat'
});

const greatVibes = Great_Vibes({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: '--font-great-vibes'
});

export const metadata: Metadata = {
  title: {
    default: "AF Hotel, Aqua Park & AF Park Complex | İstirahət Mərkəzi - Bakı, Novxanı",
    template: "%s | AF Hotel, Aqua Park & AF Park Complex"
  },
  description: "AF Hotel & Aqua Park, eləcə də möhtəşəm AF Park ilə əyləncə və rahat istirahət — hamısı bir yerdə! Ən yaxşı qiymətlərlə rahat otaqlar. 4.9 Reytinq, 50+ Otaq, 500+ Qonaq, 24/7 Servis. Novxanı Ünvan. Otaqlar və Koteclər.",
  keywords: [
    "AF Park", "AF Park Novxanı", "AF PARK Wonderland", "AF Hotel", "AF Hotel & Aqua Park", "Aqua Park Baku",
    "Bakı əyləncə mərkəzi", "Novxanı", "lunapark Baku", "istirahət mərkəzi", "su parkı Bakı", "aquapark", 
    "ailəvi istirahət", "otel rezervasiya", "hotel Baku", "Novkhani resort", "restoran", "hovuz", "atraksionlar"
  ],
  authors: [{ name: "AF Hotel, Aqua Park & AF Park Complex", url: "https://afhotel.az" }],
  creator: "AF Hotel, Aqua Park & AF Park Complex",
  publisher: "AF Hotel, Aqua Park & AF Park Complex",
  metadataBase: new URL("https://afhotel.az"),
  alternates: {
    canonical: "/",
    languages: {
      "az": "/",
      "en": "/?lang=en",
      "ru": "/?lang=ru",
    }
  },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    alternateLocale: ["en_US", "ru_RU"],
    url: "https://afhotel.az",
    siteName: "AF Hotel, Aqua Park & AF Park Complex | İstirahət və Əyləncə",
    title: "AF Hotel, Aqua Park & AF Park Complex | İstirahət Mərkəzi - Bakı, Novxanı",
    description: "AF Hotel & Aqua Park, eləcə də möhtəşəm AF Park ilə əyləncə və rahat istirahət — hamısı bir yerdə! Ən yaxşı qiymətlərlə rahat otaqlar. 4.9 Reytinq. 24/7 Servis.",
    images: [
      {
        url: "/AF-hero.jpg",
        width: 1200,
        height: 630,
        alt: "AF Hotel, Aqua Park & AF Park Complex — Resort and Amusement Park in Baku",
      },
      {
        url: "/AF-aqua.jpg",
        width: 1200,
        height: 630,
        alt: "AF Aqua Park & AF Park — Water Park and Wonderland in Novkhani",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AF Hotel, Aqua Park & AF Park Complex | İstirahət Mərkəzi",
    description: "AF Hotel & Aqua Park, eləcə də möhtəşəm AF Park ilə əyləncə və rahat istirahət — hamısı bir yerdə!",
    images: ["/AF-hero.jpg"],
    creator: "@AFHotelBaku",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-new.png",
    shortcut: "/favicon-new.png",
    apple: "/favicon-new.png",
  },
  category: "travel",
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification=...", 
    yandex: "yandex-verification=...", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'Resort', 'EntertainmentBusiness', 'AmusementPark'],
    name: 'AF Hotel, Aqua Park & AF Park Complex',
    description: 'Novxanıda mükəmməl ailəvi istirahət! 4-star resort in Novkhani, Baku with comfortable rooms, aqua park, AF Park Wonderland theme park, and fine dining.',
    url: 'https://afhotel.az',
    logo: 'https://afhotel.az/loqo-af.png',
    image: 'https://afhotel.az/AF-hero.jpg',
    telephone: '+994502233285',
    priceRange: '$$$',
    starRating: { '@type': 'Rating', ratingValue: '4' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Novkhani',
      addressRegion: 'Baku',
      addressCountry: 'AZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.5833',
      longitude: '50.1000',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'AF Park (Amusement Park)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Aqua Park', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wonderland Theme Park', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Istirahət Mərkəzi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Swimming Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
    ],
    sameAs: ['https://www.instagram.com/afhotel.az', 'https://www.facebook.com/afhotel'],
  };

  return (
    <html lang="az" className={`${cormorant.variable} ${montserrat.variable} ${greatVibes.variable}`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden w-full bg-[var(--color-hotel-light)] text-[var(--color-hotel-dark)]">
        <Providers>
          <Header />
          <main className="flex-1 w-full flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}