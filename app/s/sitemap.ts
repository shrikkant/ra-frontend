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
  const now = new Date().toISOString()
  const sitemap: MetadataRoute.Sitemap = []

  // City landing page is always emitted regardless of category fetch.
  sitemap.push({
    url: `${BASE_URL}/${id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  })

  // Subcategory pages depend on the categories API. If the build host
  // can't reach the backend (DNS, network, timeout) we still want the
  // sitemap to ship — degrade to city-only URLs instead of failing
  // `next build` and blocking the whole deploy.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []
  try {
    categories = (await fetchStaticData('categories')) ?? []
  } catch (error) {
    console.warn(
      `sitemap[${id}]: categories fetch failed, emitting city-only URLs`,
      error,
    )
    return sitemap
  }

  for (const category of categories) {
    for (const subCategory of category?.subCategories ?? []) {
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
