import {ENV_CONFIG} from '../config/environment'
import {IProduct} from '../app-store/types'

const PROD_PHOTO_BASE = 'https://rentacross.com/api'
// Dev fallback — matches REACT_APP_API_URL in .env / .env.local. Override
// at the env level by setting NEXT_PUBLIC_DEV_PHOTO_BASE for a different
// dev backend (e.g. http://localhost:8082/api).
const DEV_PHOTO_BASE =
  process.env.NEXT_PUBLIC_DEV_PHOTO_BASE ??
  'https://labs.rentacross.com/api'

/**
 * Resolves a product's photo URL.
 *
 * In production, returns the same hardcoded `https://rentacross.com/api/...`
 * URL the codebase has always used — prod behavior is unchanged.
 *
 * In development, returns a URL pointing at the configured dev backend
 * (labs/alpha) so we don't 504 against prod when local data has IDs that
 * don't exist on prod.
 *
 * Falls back to `photos[0].path` (or `masterPhotos[0].path`) when no
 * `master_product_id` is set, then `null` when there's nothing usable.
 */
export function productPhotoUrl(
  product: Pick<IProduct, 'master_product_id' | 'photos' | 'masterPhotos'>,
  width = 240,
): string | null {
  if (product.master_product_id) {
    const base = ENV_CONFIG.IS_DEVELOPMENT ? DEV_PHOTO_BASE : PROD_PHOTO_BASE
    return `${base}/products/${product.master_product_id}/photo?width=${width}`
  }
  const photo = product.photos?.[0] ?? product.masterPhotos?.[0]
  return photo?.path ?? null
}
