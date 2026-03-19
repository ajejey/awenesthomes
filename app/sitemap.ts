import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://awenesthomes.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/become-a-host`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic property routes
  try {
    await dbConnect();
    const properties = await Property.find({ status: 'published' })
      .select('_id updatedAt')
      .lean();

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((property: any) => ({
      url: `${BASE_URL}/properties/${property._id.toString()}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    // Return static routes if DB is unavailable
    return staticRoutes;
  }
}
