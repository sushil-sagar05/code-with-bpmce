import { blogsAPI, projectsAPI, eventsAPI, roadmapsAPI } from '@/lib/api';

export const revalidate = 3600; // revalidate sitemap every hour

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
    const [blogsRes, projectsRes, eventsRes, roadmapsRes] = await Promise.allSettled([
      blogsAPI.getAll(),
      projectsAPI.getAll(),
      eventsAPI.getAll(),
      roadmapsAPI.getAll(),
    ]);

    // Published blogs
    const blogs = (blogsRes.status === 'fulfilled' ? blogsRes.value?.data?.data : []) || [];
    const blogUrls = blogs
      .filter((b) => b.isPublished !== false)
      .map((b) => ({
        url: `${baseUrl}/blogs/${b.slug || b._id}`,
        lastModified: new Date(b.updatedAt || b.createdAt || Date.now()).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // Approved projects
    const projects = (projectsRes.status === 'fulfilled' ? projectsRes.value?.data?.data : []) || [];
    const projectUrls = projects
      .filter((p) => p.isApproved !== false)
      .map((p) => ({
        url: `${baseUrl}/projects`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

    // Published events
    const events = (eventsRes.status === 'fulfilled' ? eventsRes.value?.data?.data : []) || [];
    const eventUrls = events
      .filter((e) => e.isPublished !== false)
      .map((e) => ({
        url: `${baseUrl}/events`,
        lastModified: new Date(e.updatedAt || e.createdAt || Date.now()).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // Published roadmaps
    const roadmaps = (roadmapsRes.status === 'fulfilled' ? roadmapsRes.value?.data?.data : []) || [];
    const roadmapUrls = roadmaps
      .filter((r) => r.isPublished !== false)
      .map((r) => ({
        url: `${baseUrl}/roadmaps/${r.slug}`,
        lastModified: new Date(r.updatedAt || r.createdAt || Date.now()).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    dynamicRoutes = [...blogUrls, ...projectUrls, ...eventUrls, ...roadmapUrls];
  } catch (err) {
    console.error('Error generating dynamic sitemap entries:', err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
