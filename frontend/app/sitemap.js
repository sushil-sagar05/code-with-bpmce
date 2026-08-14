import { blogsAPI, roadmapsAPI } from '@/lib/api';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap() {
  const baseUrl = 'https://www.devbuddies.in';

  // Static indexable public routes
  const staticRoutes = [
    '',
    '/about',
    '/members',
    '/roadmaps',
    '/projects',
    '/resources',
    '/achievements',
    '/leaderboard',
    '/community',
    '/events',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dynamicRoutes = [];

  try {
    const [blogsRes, roadmapsRes] = await Promise.allSettled([
      blogsAPI.getAll(),
      roadmapsAPI.getAll(),
    ]);

    // Published blogs
    const blogs =
      (blogsRes.status === 'fulfilled'
        ? blogsRes.value?.data?.data
        : []) || [];

    const blogUrls = blogs
      .filter((b) => b.isPublished !== false)
      .map((b) => ({
        url: `${baseUrl}/blogs/${b.slug || b._id}`,
        lastModified: new Date(
          b.updatedAt || b.createdAt || Date.now()
        ).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // Published roadmaps
    const roadmaps =
      (roadmapsRes.status === 'fulfilled'
        ? roadmapsRes.value?.data?.data
        : []) || [];

    const roadmapUrls = roadmaps
      .filter(
        (r) =>
          r.isPublished !== false &&
          r.slug &&
          !r.slug.toLowerCase().startsWith('test')
      )
      .map((r) => ({
        url: `${baseUrl}/roadmaps/${r.slug}`,
        lastModified: new Date(
          r.updatedAt || r.createdAt || Date.now()
        ).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    dynamicRoutes = [...blogUrls, ...roadmapUrls];
  } catch (err) {
    console.error('Error generating dynamic sitemap entries:', err);
  }

  // Remove duplicate URLs
  const uniqueRoutes = Array.from(
    new Map(
      [...staticRoutes, ...dynamicRoutes].map((route) => [
        route.url,
        route,
      ])
    ).values()
  );

  return uniqueRoutes;
}