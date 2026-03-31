import {StarIcon} from '@heroicons/react/24/solid'

interface ICustomerReview {
  id: number
  name: string
  rating: number
  description: string
  img: string
  location?: string
}

interface ReviewsSectionProps {
  title?: string
  subtitle?: string
  showOverallRating?: boolean
  showCTA?: boolean
  variant?: 'compact' | 'full'
  maxReviews?: number
  className?: string
}

const reviews: ICustomerReview[] = [
  {
    id: 1,
    img: 'https://lh3.googleusercontent.com/a-/ALV-UjXkYufmG5FLSXekv_NrxPOoIYlVhG3V1-xs2poxmaDQXkCr8kRAuw',
    name: 'Shubham Naik',
    rating: 5,
    description:
      'Fantastic customer service. As a novice with cameras, their proactive communication and willingness to go the extra mile left a very positive impression. Highly recommended.',
  },
  {
    id: 2,
    name: 'Iman Malik',
    rating: 5,
    description:
      'Brand new gimbal, easy to handle, great balance. Online website is efficient, pick and drop service was reliable. Great people, great experience.',
    img: 'https://lh3.googleusercontent.com/a/ACg8ocJohtNHFPRadFqmuFhl8i3DqTI5UIwwSI77jFMV3uPm9xyysw',
  },
  {
    id: 3,
    name: 'Indrajeet Naik',
    rating: 5,
    description:
      'All equipment was in brand new condition. Surprised by their modest pricing. You will not find gear at such a low price point anywhere else.',
    img: 'https://lh3.googleusercontent.com/a/ACg8ocIj3xxq0aFnBeeRSnGXeqPk83TGszEjxtAS9UTbjD2CvfrKBQ',
    location: 'Pune',
  },
  {
    id: 4,
    name: 'Shridevi Pattanashetti',
    rating: 5,
    description:
      'Smooth and hassle-free rental process. Very prompt and responsive. The lights fulfilled my requirement perfectly. Would recommend.',
    img: 'https://lh3.googleusercontent.com/a/ACg8ocIKvhPJ2YLDUs84x_TOhu1kmrdkBilK9YxgO65HxtbalkYHK_hN',
  },
  {
    id: 5,
    name: 'Abhijeet Wakchaure',
    rating: 5,
    description:
      'Canon R50 was awesome — lightweight, user-friendly, excellent image quality. Rental service was smooth and hassle-free. Highly recommended.',
    img: 'https://lh3.googleusercontent.com/a/ACg8ocKvBpqg2WMfweQDZeb8kfdrVYBfWk813u-1tIRwe-qWNCRV',
  },
  {
    id: 6,
    name: 'Atharva Mophirkar',
    rating: 5,
    description:
      'Best place to rent photography equipment. Onboarding is smooth, booking and returning experience is great. Highly recommend for anyone new.',
    img: 'https://lh3.googleusercontent.com/a-/ALV-UjXI1Fd-JbjzxTgXCyvOKO9Y-QljBoS_oaIDA8TrbMhfhRVgoMOv',
  },
]

export function ReviewsSection(props: ReviewsSectionProps) {
  const {
    title,
    variant = 'full',
    maxReviews = 6,
    className = '',
  } = props

  const isCompact = variant === 'compact'
  const displayReviews = reviews.slice(0, isCompact ? maxReviews : 6)

  // Compact variant — used on other pages
  if (isCompact) {
    return (
      <section
        aria-label="Customer reviews"
        className={`py-12 bg-white ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          )}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map(review => (
              <article
                key={review.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-3.5 h-3.5 text-[#f7ca00]" />
                  ))}
                </div>
                <blockquote className="text-xs text-gray-600 leading-relaxed mb-3 flex-grow">
                  &ldquo;{review.description}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 mt-auto">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <cite className="text-xs font-medium text-gray-900 not-italic">
                    {review.name}
                  </cite>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default — home page social proof
  return (
    <section
      aria-label="Customer reviews"
      className={`relative overflow-hidden bg-white ${className}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f7ca00]/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto py-10 sm:py-16 md:py-20">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-5 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Loved by creators
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-[#f7ca00]" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">4.9</span>
            <span className="text-sm text-gray-400">· 1,500+ on Google</span>
          </div>
        </div>

        {/* Mobile: horizontal scroll · Desktop: 3-col grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 pl-4 pr-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:snap-none md:pb-0 md:px-6 lg:px-8">
          {displayReviews.map((review, i) => (
            <article
              key={review.id}
              className="group flex-shrink-0 w-[78vw] sm:w-[50vw] snap-center md:w-auto p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-[#fafaf8] border border-gray-100/80 flex flex-col transition-all duration-300 md:hover:shadow-lg md:hover:shadow-gray-200/40 md:hover:-translate-y-0.5"
            >
              {/* Hover accent — desktop only */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#f7ca00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />

              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <StarIcon key={j} className="w-3.5 h-3.5 text-[#f7ca00]" />
                ))}
              </div>

              <blockquote className="text-[14px] sm:text-[15px] text-gray-600 leading-relaxed flex-grow">
                &ldquo;{review.description}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 mt-4">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
                <div>
                  <cite className="text-sm font-semibold text-gray-900 not-italic block">
                    {review.name}
                  </cite>
                  {review.location && (
                    <span className="text-xs text-gray-400">{review.location}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
