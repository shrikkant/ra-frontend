// Publish a blog post module to Sanity.
//
// Usage:
//   node scripts/blog/publish.mjs <path-to-post-module> [--update]
//
//   --update   Overwrite an existing post with the same slug (in place).
//              Preserves _id and publishedAt; replaces title/body/short_desc/image.
//
// Env required (load from .env, e.g. `set -a && source .env && set +a`):
//   SANITY_TOKEN     - Sanity write token
//   PIXELS_API_KEY   - Pexels API key
//
// A post module exports:
//   - meta:   { slug, title, shortDesc, heroAlt, heroImage }   // heroImage is the key in `images`
//   - images: { [key]: { pexelsId, filename, variant? } }
//   - buildBody(imageRefs): PortableText[]                      // imageRefs[key] = { assetId, photographer, photoUrl, sourceUrl }
//   - buildShortDesc?(imageRefs): PortableText[]                // optional; falls back to meta.shortDesc string
//
// Pluggable: if a post needs images from somewhere other than Pexels later
// (uploads, Unsplash, generated), add a sibling `lib/<source>.mjs` and
// branch on `image.source` here.

import { resolve, isAbsolute } from 'path'
import { pathToFileURL } from 'url'
import { Pexels } from './lib/pexels.mjs'
import { SanityBlog } from './lib/sanity.mjs'
import { p, span } from './lib/pt.mjs'

const SANITY_PROJECT_ID = '6y25plyx'
const SANITY_DATASET = 'production'

const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const positional = args.filter((a) => !a.startsWith('--'))
const arg = positional[0]
const shouldUpdate = flags.has('--update')

if (!arg) {
  console.error('Usage: node scripts/blog/publish.mjs <path-to-post-module> [--update]')
  process.exit(1)
}
const postPath = isAbsolute(arg) ? arg : resolve(process.cwd(), arg)
const post = await import(pathToFileURL(postPath).href)

if (!post.meta?.slug) throw new Error(`${arg}: missing meta.slug`)
if (!post.meta?.title) throw new Error(`${arg}: missing meta.title`)
if (typeof post.buildBody !== 'function') throw new Error(`${arg}: missing buildBody()`)

const sanity = new SanityBlog({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
})

const existing = await sanity.postExistsBySlug(post.meta.slug)
if (existing && !shouldUpdate) {
  console.error(`Post with slug "${post.meta.slug}" already exists (${existing}).`)
  console.error('Pass --update to overwrite it in place, or change the slug.')
  process.exit(2)
}

const pexels = new Pexels(process.env.PIXELS_API_KEY)

const imageSpecs = post.images || {}
const imageRefs = {}

if (Object.keys(imageSpecs).length) {
  console.log(`Resolving ${Object.keys(imageSpecs).length} image(s)...`)
}

await Promise.all(
  Object.entries(imageSpecs).map(async ([key, spec]) => {
    if (!spec.pexelsId) {
      throw new Error(`images.${key}: only Pexels (pexelsId) is supported today`)
    }
    const photo = await pexels.fetchById(spec.pexelsId)
    const { buffer, sourceUrl } = await pexels.download(photo, spec.variant)
    const asset = await sanity.uploadImage(buffer, {
      filename: `${spec.filename || `${post.meta.slug}-${key}`}.jpg`,
      contentType: 'image/jpeg',
    })
    imageRefs[key] = {
      assetId: asset._id,
      photographer: photo.photographer,
      photoUrl: photo.url,
      sourceUrl,
    }
    console.log(`  ${key.padEnd(10)} ${asset._id}  (${photo.photographer})`)
  }),
)

const body = post.buildBody(imageRefs)
const shortDesc =
  typeof post.buildShortDesc === 'function'
    ? post.buildShortDesc(imageRefs)
    : [p(span(post.meta.shortDesc || ''))]

const heroAssetId =
  post.meta.heroImage && imageRefs[post.meta.heroImage]
    ? imageRefs[post.meta.heroImage].assetId
    : undefined

const result = existing
  ? await sanity.updatePost(existing, {
      title: post.meta.title,
      shortDesc,
      body,
      heroAssetId,
      heroAlt: post.meta.heroAlt,
    })
  : await sanity.createPost({
      title: post.meta.title,
      slug: post.meta.slug,
      shortDesc,
      body,
      heroAssetId,
      heroAlt: post.meta.heroAlt,
    })

console.log(`\n=== ${existing ? 'Updated' : 'Published'} ===`)
console.log('  _id     :', result._id)
console.log('  slug    :', post.meta.slug)
console.log('  Live    : https://rentacross.com/blog/' + post.meta.slug)
console.log('  Local   : http://localhost:3000/blog/' + post.meta.slug)
