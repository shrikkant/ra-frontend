import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/p/', '/api/', '/rent/', '/uploads/', '/a/rent/'],
    },
    sitemap: 'https://www.rentacross.com/sitemap.xml',
  }
}
