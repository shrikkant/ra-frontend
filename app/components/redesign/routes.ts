// Routes that have been migrated to the 2026 redesign.
// The legacy Header/Footer is suppressed on these paths;
// redesigned screens render their own MobileChrome + TabBar.

// Cities/states that route through the catch-all `[...slug]` listing.
// First-segment match means the URL is a city/state listing page (not a
// reserved route like /about-us, /blog, /p/profile, etc.).
const CITY_SLUGS = new Set([
  'pune',
  'mumbai',
  'navi-mumbai',
  'thane',
  'nashik',
  'kolhapur',
  'nagpur',
  'bengaluru',
  'bangalore', // legacy alias
  'mysuru',
  'mangalore',
  'hyderabad',
  'vishakhapatnam',
  'vijayawada',
  'chennai',
  'coimbatore',
  'madurai',
  'trichy',
  'kochi',
  'thiruvananthapuram',
  'kolkata',
  'patna',
  'ranchi',
  'bhubaneswar',
  'guwahati',
  'lucknow',
  'gurugram',
  'chandigarh',
  'amritsar',
  'ludhiana',
  'dehradun',
  'jaipur',
  'jodhpur',
  'udaipur',
  'jaisalmer',
  'ahmedabad',
  'surat',
  'vadodara',
  'rajkot',
  'gandhinagar',
  'indore',
  'bhopal',
  'raipur',
  'goa',
])

/** Exact-match paths that opt into the redesign chrome. */
const EXACT_PATHS = new Set(['/'])

/** Path prefixes that opt into the redesign chrome (any depth). */
const PREFIX_PATHS: string[] = ['/p/mycart', '/join']

export function isRedesignedRoute(pathname: string): boolean {
  if (!pathname) return false
  if (EXACT_PATHS.has(pathname)) return true
  if (PREFIX_PATHS.some(p => pathname.startsWith(p))) return true

  // Catch-all detection — first segment must be a city slug.
  // 1 segment → city listing; 2 → city + sub listing; 3 → product detail.
  const segs = pathname.split('/').filter(Boolean)
  if (segs.length >= 1 && segs.length <= 3 && CITY_SLUGS.has(segs[0])) {
    return true
  }

  return false
}
