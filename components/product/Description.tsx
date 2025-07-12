import React from 'react'

interface ProductDetails {
  overview: string[]
  features: Array<{[key: string]: string}>
  specifications: Array<{[key: string]: string}>
}

interface ProductProps {
  details: ProductDetails
}

// Reusable component for rendering feature items
const FeatureItem: React.FC<{feature: {[key: string]: string}}> = ({
  feature,
}) => {
  const [key, value] = Object.entries(feature)[0]
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 font-medium">{key}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

// Reusable component for rendering specification items
const SpecificationItem: React.FC<{spec: {[key: string]: string}}> = ({
  spec,
}) => {
  const [key, value] = Object.entries(spec)[0]
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 font-medium">{key}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

// Reusable component for rendering overview items
const OverviewItem: React.FC<{item: string}> = ({item}) => (
  <li className="flex items-center space-x-3 py-1">
    <span className="text-amber-500 text-lg">•</span>
    <span className="text-gray-700">{item}</span>
  </li>
)

export const Description: React.FC<ProductProps> = ({
  details,
}: ProductProps) => {
  const {overview, features, specifications} = details

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
        <ul className="space-y-1">
          {overview.map((item, index) => (
            <OverviewItem key={index} item={item} />
          ))}
        </ul>
      </div>

      {/* Features Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* Specifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Specifications
        </h3>
        <div className="space-y-2">
          {specifications.map((spec, index) => (
            <SpecificationItem key={index} spec={spec} />
          ))}
        </div>
      </div>
    </div>
  )
}
