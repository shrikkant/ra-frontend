import type {MetadataRoute} from 'next'
import {BASE_URL, ICountry} from '../../config/constants'

import {fetchProducts} from '../../api/products.api'
import {IProductFilter} from '../../app-store/types'
import COUNTRIES from '../../config/constants'
import {fetchStaticData} from '../utils/api'

interface SitemapLink {
  url: string
  lastModified: string
}

interface SitemapRef {
  id: string
}

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
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
  const categories = await fetchStaticData(`categories`)
  const city = id.split('-').join(' ')
  const now = new Date().toISOString()

  // Collect all subcategory fetch promises to run in parallel
  const fetchPromises: Promise<SitemapLink[]>[] = []

  for (const category of categories) {
    for (const subCategory of category.subCategories) {
      const filter: IProductFilter = {
        city,
        category: category.id,
        subCategory: subCategory.id,
      }

      const promise = fetchProducts('', filter)
        .then(response =>
          response.results.map(product => ({
            url: `${BASE_URL}/${id}/${subCategory.slug}/${product.slug}`,
            lastModified: now,
          })),
        )
        .catch(() => [] as SitemapLink[]) // Return empty array on error to avoid failing entire sitemap

      fetchPromises.push(promise)
    }
  }

  // Execute all fetches in parallel
  const results = await Promise.all(fetchPromises)

  return results.flat()
}
