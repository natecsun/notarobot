import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.notarobot.com'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/blog',
    '/pricing',
    '/game',
    '/leaderboard',
    '/services/resume',
    '/services/profile',
    '/services/essay',
    '/services/bulk',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/services') ? 0.9 : 0.8,
  }))

  // Blog posts
  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
