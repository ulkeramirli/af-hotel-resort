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
    default: "AF Hotel & Aqua Park Complex | Bakı, Novxanı — Lüks Ailəvi İstirahət Mərkəzi",
    template: "%s | AF Hotel & Aqua Park"
  },
  description: "AF Hotel & Aqua Park Complex — Novxanı sahilindəki premium 5 ulduzlu lüks ailəvi istirahət mərkəzi. Ən yaxşı istirahət üçün 20+ sürüşkənli aquapark, Wonderland lunapark, hovuzlar, restoranlar və Xəzər dənizi mənzərəsi. Birbaşa bron edin!",
  keywords: [
    "istirahət", "istirahət mərkəzi", "ailəvi istirahət", "istirahet", "novxani istirahet",
    "AF Hotel", "AF Hotel Baku", "AF Aqua Park", "Wonderland Baku", "Wonderland Novxanı",
    "hotel Baku Azerbaijan", "Novkhani resort", "luxury hotel Baku", "aqua park Baku", 
    "Xəzər sahili hotel", "5 star hotel Azerbaijan", "family resort Baku", "əyləncə mərkəzi",
    "ən yaxşı istirahət", "aquapark", "lunapark Baku", "AF Hotel Aqua Park Complex",
    "best hotel Baku", "Caspian Sea resort", "hotel Novkhani", "бронирование отель Баку",
    "AF Hotel qiymətlər", "Novxanı otel", "Bakı kurort", "su parkı Bakı",
    "AF Hotel Novxanı", "Xəzər dənizi otel", "ailə istirahəti Bakı",
    "Azərbaycan kurort", "otel rezervasiya", "AF Hotel telefon",
    "отель Баку Новханы", "аквапарк Баку цены", "отдых Новханы Баку", "отдых в Баку"
  ],
  authors: [{ name: "AF Hotel & Aqua Park Complex", url: "https://afhotel.az" }],
  creator: "AF Hotel & Aqua Park Complex",
  publisher: "AF Hotel & Aqua Park Complex",
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
    siteName: "AF Hotel & Aqua Park Complex | İstirahət və Əyləncə",
    title: "AF Hotel & Aqua Park | Bakı Novxanı — Lüks Ailəvi İstirahət Mərkəzi",
    description: "Mükəmməl istirahət axtarırsınız? Novxanı sahilində 5 ulduzlu lüks kurort. Premium otaqlar, Aqua Park, Wonderland lunapark, və restoranlar.",
    images: [
      {
        url: "/AF-hero.jpg",
        width: 1200,
        height: 630,
        alt: "AF Hotel & Aqua Park Complex — Premium Resort in Baku, Azerbaijan",
      },
      {
        url: "/AF-aqua.jpg",
        width: 1200,
        height: 630,
        alt: "AF Aqua Park — Water Park in Novkhani Baku",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AF Hotel & Aqua Park | Mükəmməl İstirahət Mərkəzi",
    description: "Novxanıda 5 ulduzlu lüks kurort. Mükəmməl istirahət üçün Aquapark, Wonderland lunapark & restoranlar.",
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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
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
    '@type': ['Hotel', 'Resort', 'EntertainmentBusiness'],
    name: 'AF Hotel & Aqua Park Complex',
    description: 'Novxanıda mükəmməl ailəvi istirahət! Premium 5-star resort in Novkhani, Baku with luxury rooms, aqua park, Wonderland theme park, and fine dining.',
    url: 'https://afhotel.az',
    logo: 'https://afhotel.az/loqo-af.png',
    image: 'https://afhotel.az/AF-hero.jpg',
    telephone: '+994502233285',
    priceRange: '$$$',
    starRating: { '@type': 'Rating', ratingValue: '5' },
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