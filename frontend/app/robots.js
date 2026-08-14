export default function robots() {
  const baseUrl = 'https://www.devbuddies.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/profile',
          '/login',
          '/register',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
