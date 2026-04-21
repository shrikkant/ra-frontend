// Routes that have been migrated to the 2026 redesign.
// The legacy Header/Footer is suppressed on these paths;
// redesigned screens render their own MobileChrome + TabBar.
export const REDESIGNED_ROUTES = ['/'] as const

export function isRedesignedRoute(pathname: string): boolean {
  if (!pathname) return false
  return REDESIGNED_ROUTES.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route),
  )
}
