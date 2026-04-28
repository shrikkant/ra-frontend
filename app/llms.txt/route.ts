// llms.txt — emerging standard for answer engines (ChatGPT, Perplexity,
// Claude, Gemini) to discover the structure and canonical entry points
// of a site. https://llmstxt.org
//
// Format: H1 site name, > description blockquote, H2 sections of links.
// Keep it short and link-heavy — bots read it as a map, not a manual.

export const dynamic = 'force-static'
export const revalidate = 86400

const BASE = 'https://rentacross.com'

const TOP_CITIES: Array<[string, string]> = [
  ['pune', 'Pune'],
  ['mumbai', 'Mumbai'],
  ['bangalore', 'Bangalore'],
  ['hyderabad', 'Hyderabad'],
  ['chennai', 'Chennai'],
  ['kolkata', 'Kolkata'],
  ['gurugram', 'Gurugram'],
  ['ahmedabad', 'Ahmedabad'],
]

const POPULAR_CATEGORIES: Array<[string, string]> = [
  ['rent-camera', 'Cameras'],
  ['rent-lenses', 'Lenses'],
  ['rent-gopro-cameras', 'GoPros and action cameras'],
  ['rent-lights', 'Photography lights'],
  ['rent-gimbals', 'Gimbals'],
  ['rent-drones', 'Drones'],
]

export async function GET() {
  const cityLinks = TOP_CITIES.map(
    ([slug, name]) => `- [${name}](${BASE}/${slug})`,
  ).join('\n')

  const puneCategoryLinks = POPULAR_CATEGORIES.map(
    ([slug, label]) => `- [${label} in Pune](${BASE}/pune/${slug})`,
  ).join('\n')

  const mumbaiCategoryLinks = POPULAR_CATEGORIES.map(
    ([slug, label]) => `- [${label} in Mumbai](${BASE}/mumbai/${slug})`,
  ).join('\n')

  const body = `# RentAcross

> India's camera and photography gear rental service. Rent DSLRs, mirrorless cameras, lenses, drones, lights, and action cameras for daily, weekly, or monthly periods. Free home delivery in major cities. Daily rentals start at ₹300.

## About
- [About RentAcross](${BASE}/about-us)
- [How it works / FAQ](${BASE}/help)
- [Why RentAcross](${BASE}/why-us)
- [Rental agreement](${BASE}/rental-agreement)

## Rent gear by city
${cityLinks}

## Popular categories in Pune
${puneCategoryLinks}

## Popular categories in Mumbai
${mumbaiCategoryLinks}

## Blog
- [RentAcross blog](${BASE}/blog)

## Sitemap
- [XML sitemap](${BASE}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
