import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Room from '@/models/Room';
import Activity from '@/models/Activity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afhotel.az';
  
  // Default static routes
  const staticRoutes = [
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

  let dynamicRoutes: { url: string; priority: number; changeFrequency: any; lastModified: Date }[] = [];

  try {
    await connectDB();
    
    // Fetch active rooms
    const rooms = await Room.find({ isAvailable: true }).select('_id updatedAt').lean();
    const roomRoutes = rooms.map((room) => ({
      url: `/rooms/${room._id.toString()}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      lastModified: room.updatedAt || new Date(),
    }));

    // Fetch activities if model exists and has data
    let activityRoutes: any[] = [];
    try {
      const activities = await Activity.find().select('_id updatedAt').lean();
      activityRoutes = activities.map((activity) => ({
        url: `/activities/${activity._id.toString()}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
        lastModified: activity.updatedAt || new Date(),
      }));
    } catch (e) {
      // Activity model might not exist or might fail, ignore
    }

    dynamicRoutes = [...roomRoutes, ...activityRoutes];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  const allRoutes = [...staticRoutes.map(r => ({ ...r, lastModified: new Date() })), ...dynamicRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = allRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        'az-AZ': `${baseUrl}${route.url}`,
        'en-US': `${baseUrl}${route.url}?lang=en`,
        'ru-RU': `${baseUrl}${route.url}?lang=ru`,
      },
    },
  }));

  return sitemapEntries;
}
