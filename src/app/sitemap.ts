import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Room from '@/models/Room';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afhotel.az';
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

  // Fetch dynamic room routes
  let roomRoutes: { path: string; priority: number; changeFrequency: "weekly" }[] = [];
  try {
    await connectDB();
    const rooms = await Room.find({}, '_id').lean();
    roomRoutes = rooms.map(room => ({
      path: `/rooms/${room._id}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    }));
  } catch (error) {
    console.warn("Failed to fetch rooms for sitemap:", error);
  }

  const allRoutes = [...mainRoutes, ...roomRoutes];

  return allRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
