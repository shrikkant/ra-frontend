import type {MetadataRoute} from 'next'
import COUNTRIES, {ICountry} from '../config/constants'
import {BASE_URL} from '../config/constants'
interface SitemapLink {
  url: string
  lastModified: Date
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority: number
}
export default function sitemap(): MetadataRoute.Sitemap {
  const countries: ICountry[] = COUNTRIES
  const urls: SitemapLink[] = []

  for (const country of countries) {
    for (const city of country.locations) {
      urls.push({
        url: `${BASE_URL}/s/sitemap/${city.toLowerCase().split(' ').join('-')}.xml`,
        lastModified: new Date('2024-08-31'),
        changeFrequency: 'weekly',
        priority: 1,
      })
    }
  }

  return urls
}
