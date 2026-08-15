import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account/', '/login', '/auth/', '/payment/'],
    },
    sitemap: 'https://afhotel.az/sitemap.xml',
  };
}
