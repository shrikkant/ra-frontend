import {Fragment} from 'react'
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

export function ReviewsSection({
  title = 'What Our Customers Say',
  subtitle = 'Join thousands of satisfied customers who trust us for their photography and videography needs',
  showOverallRating = true,
  showCTA = true,
  variant = 'full',
  maxReviews = 6,
  className = '',
}: ReviewsSectionProps) {
  const reviews: ICustomerReview[] = [
    {
      id: 1,
      img: 'https://lh3.googleusercontent.com/a-/ALV-UjXkYufmG5FLSXekv_NrxPOoIYlVhG3V1-xs2poxmaDQXkCr8kRAuw',
      name: 'Shubham Naik',
      rating: 5,
      description:
        'Fantastic Customer Service from RentAcross \n\n I recently rented a DSLR from RentAcross, Balewadi,' +
        ' for my trip. As a novice with cameras, ' +
        ' I picked a model that looked good on their website. ' +
        'Their proactive communication and willingness to go the extra mile left a very positive ' +
        'impression on me. I will definitely consider renting from RentAcross again for my next trip!\n\n' +
        'Highly recommended for anyone looking for camera rentals with reliable and responsive service.',
    },
    {
      id: 2,
      name: 'Iman Malik',
      rating: 5,
      description:
        'Great service by RentAcross team. I rented RS4 ghimbal from them. Brand new! Easy to handle and the balance was great.\n\n' +
        'Their online website is efficient and the assistance was made with utmost care and support.' +
        'Their pick and drop service was also very reliable. Great people! Great experience!\n\n' +
        '-Iman (owner Darkwhite studio)',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocJohtNHFPRadFqmuFhl8i3DqTI5UIwwSI77jFMV3uPm9xyysw',
    },
    {
      id: 3,
      name: 'Indrajeet Naik',
      rating: 5,
      description:
        'Great service, all equipment was in a brand new like condition. Had a great time shooting with the rented lighting equipment from Rent Across.' +
        'I was surprised by their modest pricing. ' +
        "If you are reading this I'd recommend you to use their services.You will not get to rent cams, lighting gear, and etc at such a low price point as here.Thank you.",
      img: 'https://lh3.googleusercontent.com/a/ACg8ocIj3xxq0aFnBeeRSnGXeqPk83TGszEjxtAS9UTbjD2CvfrKBQ',
      location: 'Pune',
    },
    {
      id: 4,
      name: 'Shridevi Pattanashetti',
      rating: 5,
      description:
        'I rented Godox LC500R lights for my makeup shoot. ' +
        'The entire rental process was smooth and hassle free, ' +
        'very prompt and responsive. The lights were very good and fulfilled my requirement. ' +
        'The pictures came out as expected. Would recommend you to rent your equipments from them.',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocIKvhPJ2YLDUs84x_TOhu1kmrdkBilK9YxgO65HxtbalkYHK_hN',
    },
    {
      id: 5,
      name: 'Abhijeet Wakchaure',
      rating: 5,
      description:
        'I rented the Canon R50 and had an amazing experience. The camera was awesome—lightweight, user-friendly, and delivered excellent image and video quality. Autofocus was fast and reliable. The rental service was also smooth and hassle-free, making the whole process super convenient. Highly recommended for anyone looking for a quality camera and a seamless rental experience!',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocKvBpqg2WMfweQDZeb8kfdrVYBfWk813u-1tIRwe-qWNCRV',
    },
    {
      id: 6,
      name: 'Atharva Mophirkar',
      rating: 5,
      description:
        '😃 The best place to rent camera, photography equipment. The Onboarding process is smooth and so is your booking & returning experience. Would highly recommend it to anyone new trying to book equipments. Good Job guys! Keep it up 👍',
      img: 'https://lh3.googleusercontent.com/a-/ALV-UjXI1Fd-JbjzxTgXCyvOKO9Y-QljBoS_oaIDA8TrbMhfhRVgoMOv',
    },
  ]

  const displayReviews = reviews.slice(0, maxReviews)
  const isCompact = variant === 'compact'

  return (
    <section
      className={`py-12 ${isCompact ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-white'} ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`font-bold text-gray-900 mb-3 ${isCompact ? 'text-2xl' : 'text-3xl md:text-4xl'}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`text-gray-600 max-w-2xl mx-auto ${isCompact ? 'text-sm' : 'text-lg'}`}
            >
              {subtitle}
            </p>
          )}

          {/* Overall Rating */}
          {showOverallRating && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`text-[#f7ca00] ${isCompact ? 'w-5 h-5' : 'w-6 h-6'}`}
                    />
                  ))}
                </div>
                <span
                  className={`font-bold text-gray-900 ${isCompact ? 'text-lg' : 'text-2xl'}`}
                >
                  4.9
                </span>
              </div>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">1500+ Happy Customers</span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div
          className={`grid gap-4 ${isCompact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
        >
          {displayReviews.map(review => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg flex flex-col ${
                isCompact ? 'p-4' : 'p-6 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-[#f7ca00]" />
                ))}
              </div>

              {/* Review Text */}
              <div
                className={`text-gray-700 leading-relaxed mb-4 italic flex-grow ${
                  isCompact ? 'text-xs' : 'text-sm'
                }`}
              >
                &ldquo;
                {review.description.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    {index < review.description.split('\n').length - 1 && (
                      <br />
                    )}
                  </Fragment>
                ))}
                &rdquo;
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={review.img}
                  alt={`${review.name}'s profile`}
                  className={`rounded-full object-cover ring-2 ring-[#f7ca00]/20 ${
                    isCompact ? 'w-10 h-10' : 'w-12 h-12'
                  }`}
                />
                <div>
                  <h4
                    className={`font-semibold text-gray-900 ${
                      isCompact ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {review.name}
                  </h4>
                  {review.location && (
                    <p
                      className={`text-gray-500 ${
                        isCompact ? 'text-xs' : 'text-xs'
                      }`}
                    >
                      {review.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {showCTA && !isCompact && (
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-[#f7ca00] to-[#f4c500] rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience the Best?
              </h3>
              <p className="text-gray-800 mb-6">
                Join our community of satisfied customers and start your
                photography journey today
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Verified Equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Easy Booking</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
