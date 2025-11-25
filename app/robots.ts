import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/profile/', '/verify/'],
    },
    sitemap: 'https://www.notarobot.com/sitemap.xml',
  }
}
