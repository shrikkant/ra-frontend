import type {MetadataRoute} from 'next'

const COMMON_DISALLOW = ['/p/', '/rent/', '/uploads/', '/a/rent/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...COMMON_DISALLOW, '/api/'],
      },
      {
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: '/api/products/*/photo',
        disallow: [...COMMON_DISALLOW, '/api/'],
      },
    ],
    sitemap: 'https://www.rentacross.com/sitemap.xml',
  }
}
