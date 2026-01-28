import React from 'react'
import {
  StarIcon,
  CogIcon,
  ListBulletIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import {FAQAccordion} from './FAQAccordion'

export interface FAQItem {
  question: string
  answer: string
}

interface PerformanceMetrics {
  key_stat_1: string
  key_stat_2: string
  compatibility: string
}

interface ProductDetails {
  overview: string[]
  features: Array<{[key: string]: string}>
  specifications: Array<{[key: string]: string}>
  aeo_faq?: FAQItem[]
  category?: string
  performance_metrics?: PerformanceMetrics
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
    <div className="flex justify-between items-center py-3 lg:py-4 px-4 lg:px-6 bg-gray-50 rounded-lg">
      <span className="text-gray-700 font-medium text-base lg:text-lg">
        {key}
      </span>
      <span className="text-gray-900 font-semibold text-base lg:text-lg">
        {value}
      </span>
    </div>
  )
}

// Reusable component for rendering specification items
const SpecificationItem: React.FC<{spec: {[key: string]: string}}> = ({
  spec,
}) => {
  const [key, value] = Object.entries(spec)[0]
  return (
    <div className="flex justify-between items-center py-3 lg:py-4 px-4 lg:px-6 bg-gray-50 rounded-lg">
      <span className="text-gray-700 font-medium text-base lg:text-lg">
        {key}
      </span>
      <span className="text-gray-900 font-semibold text-base lg:text-lg">
        {value}
      </span>
    </div>
  )
}

// Reusable component for rendering overview items
const OverviewItem: React.FC<{item: string}> = ({item}) => (
  <li className="flex items-start space-x-3 lg:space-x-4 py-2 lg:py-3">
    <StarIcon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 mt-0.5 lg:mt-1 flex-shrink-0" />
    <span className="text-gray-700 leading-relaxed text-base lg:text-lg">
      {item}
    </span>
  </li>
)

// Performance Metrics Card component
const PerformanceMetricsCard: React.FC<{metrics: PerformanceMetrics}> = ({
  metrics,
}) => (
  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 lg:p-8 text-white">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-lg flex items-center justify-center">
        <BoltIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </div>
      <h3 className="text-xl lg:text-2xl font-bold">Performance Highlights</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
      <div className="bg-white/10 rounded-xl p-4 lg:p-5 backdrop-blur-sm">
        <p className="text-white/70 text-sm lg:text-base mb-1">Key Specification</p>
        <p className="text-lg lg:text-xl font-semibold">{metrics.key_stat_1}</p>
      </div>
      <div className="bg-white/10 rounded-xl p-4 lg:p-5 backdrop-blur-sm">
        <p className="text-white/70 text-sm lg:text-base mb-1">Standout Feature</p>
        <p className="text-lg lg:text-xl font-semibold">{metrics.key_stat_2}</p>
      </div>
    </div>
    <div className="bg-white/10 rounded-xl p-4 lg:p-5 backdrop-blur-sm">
      <p className="text-white/70 text-sm lg:text-base mb-2">Compatibility</p>
      <p className="text-white/90 leading-relaxed text-base lg:text-lg">
        {metrics.compatibility}
      </p>
    </div>
  </div>
)

export const Description: React.FC<ProductProps> = ({
  details,
}: ProductProps) => {
  const {
    overview,
    features,
    specifications,
    aeo_faq,
    category,
    performance_metrics,
  } = details

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Category Badge */}
      {category && (
        <div className="flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-indigo-600" />
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {category}
          </span>
        </div>
      )}

      {/* Performance Metrics Section */}
      {performance_metrics && (
        <PerformanceMetricsCard metrics={performance_metrics} />
      )}

      {/* Overview Section */}
      <div>
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <ListBulletIcon className="w-6 h-6 lg:w-7 lg:h-7 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
              Overview
            </h3>
            <p className="text-gray-600 text-base lg:text-lg">
              Key highlights of this equipment
            </p>
          </div>
        </div>
        <ul className="space-y-2 lg:space-y-3">
          {overview.map((item, index) => (
            <OverviewItem key={index} item={item} />
          ))}
        </ul>
      </div>

      {/* Features Section */}
      <div>
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <StarIcon className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
              Features
            </h3>
            <p className="text-gray-600 text-base lg:text-lg">
              What makes this equipment special
            </p>
          </div>
        </div>
        <div className="space-y-3 lg:space-y-4">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* Specifications Section */}
      <div>
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CogIcon className="w-6 h-6 lg:w-7 lg:h-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
              Specifications
            </h3>
            <p className="text-gray-600 text-base lg:text-lg">
              Technical details and specifications
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          {specifications.map((spec, index) => (
            <SpecificationItem key={index} spec={spec} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      {aeo_faq && aeo_faq.length > 0 && (
        <div>
          <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <QuestionMarkCircleIcon className="w-6 h-6 lg:w-7 lg:h-7 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 text-base lg:text-lg">
                Common questions about this equipment
              </p>
            </div>
          </div>
          <FAQAccordion faqs={aeo_faq} />
        </div>
      )}

      {/* Additional Information */}
      <div className="mt-8 lg:mt-10 p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl border border-blue-200">
        <div className="flex">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
            This equipment is maintained to professional standards and comes
            with full support. Our team ensures everything is in perfect working
            condition before delivery.
          </p>
        </div>
      </div>
    </div>
  )
}
