import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://af-hotel.az';
  const lastModified = new Date();

  const mainRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/rooms', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/aquapark', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/wonderland', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/booking', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/restoran', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contacts', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/booking-policy', priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  return mainRoutes.flatMap(({ path, priority, changeFrequency }) => [
    {
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    },
    {
      url: `${baseUrl}${path}?lang=en`,
      lastModified,
      changeFrequency,
      priority: priority - 0.05,
    },
    {
      url: `${baseUrl}${path}?lang=ru`,
      lastModified,
      changeFrequency,
      priority: priority - 0.05,
    },
  ]);
}
