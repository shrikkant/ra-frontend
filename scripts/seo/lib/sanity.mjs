import {createClient} from 'next-sanity'

// Thin Sanity client for the cityCategoryPage editorial-override schema.
// Mirrors the SanityBlog wrapper (scripts/blog/lib/sanity.mjs); kept
// separate because it's a different doc type with different read paths.
export class SanityCityCategory {
  constructor({projectId, dataset, apiVersion = '2024-01-01', token}) {
    if (!token) throw new Error('SanityCityCategory: token required')
    this.client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  }

  async findBySlugs(citySlug, subCategorySlug) {
    return this.client.fetch(
      `*[_type=="cityCategoryPage" && citySlug==$c && subCategorySlug==$s][0]{_id}`,
      {c: citySlug, s: subCategorySlug},
    )
  }

  // Upsert by (citySlug, subCategorySlug). Creates a fresh doc if none
  // exists, otherwise patches the existing one in place (preserves _id).
  async upsert(data) {
    if (!data?.citySlug || !data?.subCategorySlug) {
      throw new Error('upsert: citySlug and subCategorySlug are required')
    }
    const existing = await this.findBySlugs(
      data.citySlug,
      data.subCategorySlug,
    )

    const doc = {
      _type: 'cityCategoryPage',
      citySlug: data.citySlug,
      subCategorySlug: data.subCategorySlug,
      publishedAt: data.publishedAt ?? new Date().toISOString(),
      ...(data.seoTitle && {seoTitle: data.seoTitle}),
      ...(data.seoDescription && {seoDescription: data.seoDescription}),
      ...(data.customH1 && {customH1: data.customH1}),
      ...(data.customIntro && {customIntro: data.customIntro}),
      ...(data.body && {body: data.body}),
      ...(data.faqOverrides && {faqOverrides: data.faqOverrides}),
    }

    if (existing?._id) {
      const {_type, ...patch} = doc
      await this.client.patch(existing._id).set(patch).commit()
      return {_id: existing._id, action: 'updated'}
    }
    const created = await this.client.create(doc)
    return {_id: created._id, action: 'created'}
  }
}
