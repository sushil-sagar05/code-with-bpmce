import axios from 'axios';

// Use API base from env (on server-side) or relative path (on client-side) to leverage Next.js rewrites/proxy
const isServer = typeof window === 'undefined';
const API_BASE = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001')
  : '';

// Send credentials (cookies) with requests so server-set httpOnly cookie is used for auth
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// NOTE: switching to cookie-based auth. Do not attach Authorization header from localStorage anymore.
// Auto-logout on 401: clear any stored user and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('cwb_user');

      // Expanded public routes list — include login and register to avoid redirect loops
      const isPublicRoute = [
        '/members',
        '/blogs',
        '/projects',
        '/achievements',
        '/leaderboard',
        '/events',
        '/resources',
        '/about',
        '/roadmaps',
        '/login',
        '/register',
        '/',
      ].some((p) => window.location.pathname.startsWith(p));

      if (
        !isPublicRoute &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        // Prevent rapid redirect loops by only redirecting when not already on public auth pages
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),

  // Google OAuth / Google Identity Services
  googleLogin: (data) => api.post('/auth/google', data),

  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Users ──────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getCount: () => api.get('/users/count'),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// ─── Events ─────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
};

// ─── Blogs ──────────────────────────────────────────────────────────────────
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  like: (id) => api.post(`/blogs/${id}/like`),
};

// ─── Achievements ────────────────────────────────────────────────────────────
export const achievementsAPI = {
  getAll: (params) => api.get('/achievements', { params }),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (id) => api.post('/achievements', id),
  verify: (id) => api.put(`/achievements/${id}/verify`),
  reject: (id) => api.delete(`/achievements/${id}`),
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  create: (data) => api.post('/projects', data),
  approve: (id) => api.put(`/projects/${id}/approve`),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ─── Resources ──────────────────────────────────────────────────────────────
export const resourcesAPI = {
  getAll: (params) => api.get('/resources', { params }),
  create: (data) => api.post('/resources', data),
  upvote: (id) => api.post(`/resources/${id}/upvote`),
  delete: (id) => api.delete(`/resources/${id}`),
};

// ─── Roadmaps ────────────────────────────────────────────────────────────────
export const roadmapsAPI = {
  getAll: () => api.get('/roadmaps'),
  getBySlug: (slug) => api.get(`/roadmaps/${slug}`),
  create: (data) => api.post('/roadmaps', data),
  update: (id, data) => api.put(`/roadmaps/${id}`, data),
  delete: (id) => api.delete(`/roadmaps/${id}`),
};

// ─── Upload ──────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Applications ────────────────────────────────────────────────────────────
export const applicationsAPI = {
  create: (data) => api.post('/applications', data),
  getMyApplication: () => api.get('/applications/my-application'),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

export default api;