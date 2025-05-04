import type {MetadataRoute} from 'next'
import {BASE_URL, ICountry} from '../../config/constants'
import {fetchData} from '../../api/axios.config'
import {fetchProducts} from '../../api/products.api'
import {IProductFilter} from '../../app-store/types'
import COUNTRIES from '../../config/constants'

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
  const categories = await fetchData(`categories`)
  const filter: IProductFilter = {
    city: id.split('-').join(' '),
  }

  const sitemap: SitemapLink[] = []

  for (const category of categories) {
    filter.category = category.id

    for (const subCategory of category.subCategories) {
      filter.subCategory = subCategory.id

      const response = await fetchProducts('', filter)

      const map = response.results.map(product => ({
        url: `${BASE_URL}/${id}/${subCategory.slug}/${product.slug}`,
        lastModified: new Date().toISOString(),
      }))
      sitemap.push(...map)
    }
  }

  return sitemap
}
