import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afhotel.az';

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/rooms', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/aquapark', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/wonderland', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/restoran', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/booking', priority: 0.8, changeFrequency: 'always' as const },
    { url: '/contacts', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const sitemapEntries = routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return sitemapEntries;
}
