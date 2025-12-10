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

// Cache categories at module level to avoid repeated fetches during build
let categoriesCache: unknown[] | null = null
let categoriesCachePromise: Promise<unknown[]> | null = null

async function getCachedCategories() {
  if (categoriesCache) {
    return categoriesCache
  }

  if (!categoriesCachePromise) {
    categoriesCachePromise = fetchStaticData('categories').then(data => {
      categoriesCache = data
      return data
    })
  }

  return categoriesCachePromise
}

// Process tasks in chunks to limit concurrency
async function processInChunks<T>(
  tasks: (() => Promise<T>)[],
  chunkSize: number,
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < tasks.length; i += chunkSize) {
    const chunk = tasks.slice(i, i + chunkSize)
    const chunkResults = await Promise.all(chunk.map(task => task()))
    results.push(...chunkResults)
  }

  return results
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
  // Use cached categories to avoid repeated API calls across city sitemaps
  const categories = await getCachedCategories()
  const city = id.split('-').join(' ')
  const now = new Date().toISOString()

  // Collect all subcategory fetch tasks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks: (() => Promise<SitemapLink[]>)[] = []

  for (const category of categories as any[]) {
    for (const subCategory of category.subCategories) {
      const filter: IProductFilter = {
        city,
        category: category.id,
        subCategory: subCategory.id,
      }

      tasks.push(() =>
        fetchProducts('', filter)
          .then(response =>
            response.results.map(product => ({
              url: `${BASE_URL}/${id}/${subCategory.slug}/${product.slug}`,
              lastModified: now,
            })),
          )
          .catch(() => [] as SitemapLink[]),
      )
    }
  }

  // Execute in chunks of 2 to avoid overwhelming the API (conservative for build)
  const results = await processInChunks(tasks, 2)

  return results.flat()
}
