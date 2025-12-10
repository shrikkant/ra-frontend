import type {MetadataRoute} from 'next'
import {BASE_URL, ICountry} from '../../config/constants'

import COUNTRIES from '../../config/constants'
import {fetchStaticData} from '../utils/api'

interface SitemapRef {
  id: string
}

export async function generateSitemaps() {
  const countries: ICountry[] = COUNTRIES
  const urls: SitemapRef[] = []

  for (const country of countries) {
    for (const city of country.locations) {
      urls.push({
        id: city.toLowerCase().split(' ').join('-'),
      })
    }
  }

  return urls
}

export default async function sitemap({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  const categories = await fetchStaticData('categories')
  const now = new Date().toISOString()

  // Generate category-level URLs only (no product fetches to avoid timeouts)
  // Format: /city/subcategory-slug
  const sitemap: MetadataRoute.Sitemap = []

  // Add city landing page
  sitemap.push({
    url: `${BASE_URL}/${id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  })

  // Add subcategory pages for this city
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const category of categories as any[]) {
    for (const subCategory of category.subCategories) {
      sitemap.push({
        url: `${BASE_URL}/${id}/${subCategory.slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7,
      })
    }
  }

  return sitemap
}
