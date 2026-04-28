import { createClient } from 'next-sanity'

// Sanity wrapper for the blog pipeline.
// Construct once per run; reuses a single authenticated client.
export class SanityBlog {
  constructor({ projectId, dataset, apiVersion = '2024-01-01', token }) {
    if (!token) throw new Error('SanityBlog: token required (write access)')
    this.client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  }

  async postExistsBySlug(slug) {
    const existing = await this.client.fetch(
      `*[_type=="post" && slug.current==$s][0]{_id}`,
      { s: slug },
    )
    return existing?._id || null
  }

  async uploadImage(buffer, { filename, contentType = 'image/jpeg' }) {
    return this.client.assets.upload('image', buffer, { filename, contentType })
  }

  async createPost({ title, slug, shortDesc, body, heroAssetId, heroAlt }) {
    return this.client.create({
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      publishedAt: new Date().toISOString(),
      short_desc: shortDesc,
      body,
      ...(heroAssetId && {
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: heroAssetId },
          ...(heroAlt && { alt: heroAlt }),
        },
      }),
    })
  }

  // Updates an existing post in place. Preserves _id, slug, and publishedAt
  // so existing URLs / SEO ranking aren't disturbed.
  async updatePost(id, { title, shortDesc, body, heroAssetId, heroAlt }) {
    const set = { title, short_desc: shortDesc, body }
    if (heroAssetId) {
      set.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: heroAssetId },
        ...(heroAlt && { alt: heroAlt }),
      }
    }
    return this.client.patch(id).set(set).commit()
  }
}
