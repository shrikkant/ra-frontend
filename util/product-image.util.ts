import {ENV_CONFIG} from '../config/environment'
import {IProduct} from '../app-store/types'

/**
 * Resolves a product's photo URL from the configured client API base.
 *
 * The image is fetched from the same backend as the product data, so
 * `master_product_id` always matches what the API returned (no
 * "data from labs, image from prod" mismatch).
 *
 * Falls back to `photos[0].path` then `masterPhotos[0].path` when
 * `master_product_id` isn't set, then `null` for callers to render
 * a placeholder.
 */
export function productPhotoUrl(
  product: Pick<IProduct, 'master_product_id' | 'photos' | 'masterPhotos'>,
  width = 240,
): string | null {
  if (product.master_product_id) {
    const base = ENV_CONFIG.CLIENT_API_URL.replace(/\/?$/, '/')
    return `${base}products/${product.master_product_id}/photo?width=${width}`
  }
  const photo = product.photos?.[0] ?? product.masterPhotos?.[0]
  return photo?.path ?? null
}
