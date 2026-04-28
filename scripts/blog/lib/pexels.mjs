// Thin Pexels client — only what the blog pipeline needs.w

export class Pexels {
  constructor(apiKey) {
    if (!apiKey) throw new Error('Pexels: apiKey required')
    this.apiKey = apiKey
  }

  async fetchById(id) {
    const r = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: { Authorization: this.apiKey },
    })
    if (!r.ok) throw new Error(`Pexels fetchById(${id}): ${r.status} ${r.statusText}`)
    return r.json()
  }

  async search(query, { perPage = 5, orientation = 'landscape' } = {}) {
    const url = new URL('https://api.pexels.com/v1/search')
    url.searchParams.set('query', query)
    url.searchParams.set('per_page', String(perPage))
    if (orientation) url.searchParams.set('orientation', orientation)
    const r = await fetch(url, { headers: { Authorization: this.apiKey } })
    if (!r.ok) throw new Error(`Pexels search "${query}": ${r.status}`)
    const data = await r.json()
    return data.photos || []
  }

  // Downloads the requested src variant (default: large2x ≈ 1880px wide,
  // good balance of quality vs payload). Returns { buffer, sourceUrl }.
  async download(photo, variant = 'large2x') {
    const sourceUrl = photo.src?.[variant] || photo.src?.original
    if (!sourceUrl) throw new Error(`Pexels download: no src.${variant} on photo ${photo.id}`)
    const r = await fetch(sourceUrl)
    if (!r.ok) throw new Error(`Pexels download ${sourceUrl}: ${r.status}`)
    const buffer = Buffer.from(await r.arrayBuffer())
    return { buffer, sourceUrl }
  }
}
