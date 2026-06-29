import { MetadataRoute } from 'next';
import { productsApi } from '../lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://picklehub.com';

  const routes = ['', '/shop', '/track', '/cart', '/login', '/checkout'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const products = await productsApi.list();
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug || product.id}`,
      lastModified: new Date(product.createdAt || new Date()).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('Failed to fetch products for sitemap', error);
    return routes;
  }
}
