// Seed or update a cityCategoryPage editorial override in Sanity.
//
// Usage:
//   node scripts/seo/seed-city-category.mjs <path-to-page-module>
//
// Env (load from .env, e.g. `set -a && source .env && set +a`):
//   SANITY_TOKEN — Sanity write token
//
// A page module exports `data` with shape:
//   {
//     citySlug,            // string, required
//     subCategorySlug,     // string, required
//     seoTitle?, seoDescription?,
//     customH1?,           // string
//     customIntro?,        // string (plain text)
//     body?,               // PortableText[]
//     faqOverrides?,       // [{ question, answer: PortableText[] }]
//     publishedAt?,        // ISO date; defaults to now()
//   }

import {resolve, isAbsolute} from 'path'
import {pathToFileURL} from 'url'
import {SanityCityCategory} from './lib/sanity.mjs'

const SANITY_PROJECT_ID = '6y25plyx'
const SANITY_DATASET = 'production'

if (!process.env.SANITY_TOKEN) {
  console.error('SANITY_TOKEN is missing in env')
  process.exit(1)
}

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: node scripts/seo/seed-city-category.mjs <path>')
  process.exit(1)
}

const path = isAbsolute(arg) ? arg : resolve(process.cwd(), arg)
const mod = await import(pathToFileURL(path).href)
if (!mod.data) throw new Error(`${arg}: must export { data }`)

const sanity = new SanityCityCategory({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
})

const result = await sanity.upsert(mod.data)
console.log(
  `${result.action} ${result._id}  for /${mod.data.citySlug}/${mod.data.subCategorySlug}`,
)
