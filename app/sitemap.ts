import type { MetadataRoute } from 'next'
import COUNTRIES from '../config/constants';
import { BASE_URL } from '../config/constants';
interface SitemapLink {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}
export default function sitemap(): MetadataRoute.Sitemap {
  const countries = COUNTRIES;
  const urls: SitemapLink[] = [];

  for (const country of countries) {

    for (const city of country.locations) {
      urls.push({
        url: `${BASE_URL}/sitemap/s/${city.toLowerCase()}.xml`,
        lastModified: new Date("2024-08-31"),
        changeFrequency: 'weekly',
        priority: 1,
      })
    }
  }

  return urls;
}
