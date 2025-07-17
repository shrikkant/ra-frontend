import React from 'react'
import {HeadCard} from './HeadCard'
import {Package} from './Package'
import {Description} from './Description'
import {PRODUCT_LAYOUT, CARD_STYLES} from './constants'
import {ProductDetailsSectionProps} from './types'

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  addons,
}) => {
  return (
    <div className={PRODUCT_LAYOUT.PRODUCT_DETAILS_WIDTH}>
      <div className="space-y-8">
        {/* Product Header Card */}
        <div className={CARD_STYLES.PRODUCT_CARD}>
          <HeadCard product={product} />
        </div>

        {/* Package/Addons Section */}
        {addons && addons.length > 0 && (
          <div className={CARD_STYLES.SECTION_CARD}>
            <Package addons={addons} />
          </div>
        )}

        {/* Product Description */}
        {product.masterProduct.details_json && (
          <div className={CARD_STYLES.SECTION_CARD}>
            <Description details={product.masterProduct.details_json} />
          </div>
        )}
      </div>
    </div>
  )
}
