import { getBlogs, getBlogById, getApprovedBlogsSitemap } from '../controllers/blogController';
import { getProjects, getApprovedProjectsSitemap } from '../controllers/projectController';
import { getAchievements, getApprovedAchievementsSitemap } from '../controllers/achievementController';
import { getEvents, getApprovedEventsSitemap } from '../controllers/eventController';
import { getRoadmaps, getApprovedRoadmapsSitemap } from '../controllers/roadmapController';

// We can expose an open sitemap API endpoint in backend or query DB in Next.js backend API
