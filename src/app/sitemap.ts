import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'http://localhost:3000', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'http://localhost:3000/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'http://localhost:3000/reviews', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'http://localhost:3000/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'http://localhost:3000/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
