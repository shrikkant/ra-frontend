'use client'
import React from 'react'
import {StarIcon} from '@heroicons/react/24/solid'

interface ICustomerReview {
  id: number
  name: string
  rating: number
  description: string
  img: string
  location?: string
}

export function CustomerReviews() {
  const reviews: ICustomerReview[] = [
    {
      id: 1,
      name: 'Prathamesh Dalvi',
      rating: 5,
      description:
        'I recently rented the Nikkor 70-300mm lens for a photo shoot and was extremely satisfied. The procedure was easy and lens was in excellent condition. The images I captured were stunning!',
      img: 'https://lh3.googleusercontent.com/a-/ALV-UjUIHossDX68OWhierQScgMeRCBhRA9RwusuGCK3C8iqxZSVqxpU',
      location: 'Mumbai',
    },
    {
      id: 2,
      name: 'Sam Barton',
      rating: 5,
      description:
        'Hassle-free camera rental experience! As a beginner, I took Canon EOS 200D with dual lens and loved taking pictures. Camera was in good condition and affordable.',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocK1hTOa8OlfN77Klr7SstJT3ar_IFZMusfvgOT4CkN4jEWG8Q',
      location: 'Pune',
    },
    {
      id: 3,
      name: 'Prasad Kaiche',
      rating: 5,
      description:
        'Great experience getting GoPro 11 from RentAcross. I was provided with proper mods and selfie stick. Received multiple memory cards. Very reliable and recommendable!',
      img: 'https://lh3.googleusercontent.com/a-/ALV-UjWvQL2KRApAD6k8PgtB2sSMbhmCKCgQXG0VWaZdvmPmKfOBjGuL',
      location: 'Bangalore',
    },
    {
      id: 4,
      name: 'Aniket D',
      rating: 5,
      description:
        'It was a great experience again! I did take DSLR on rent previously too. Process is quite simple and equipment was clean and in mint condition. Highly recommend!',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocKTd0fQ1ZHDizpTXVhF8b67Apyti05HzkksPSBctJbUUkX_Dw',
      location: 'Delhi',
    },
    {
      id: 5,
      name: 'Digvijay Gore',
      rating: 5,
      description:
        'Hassle-free services for rental camera and gears in Pune. Best arrangement and convenient from owner. Strongly recommend for rental camera services. Budget friendly!',
      img: 'https://lh3.googleusercontent.com/a/ACg8ocLgzppJl3B9IZ8DKdsZgpRDUNwT6OGd6B4b7QUVigtA1CAASA',
      location: 'Pune',
    },
    {
      id: 6,
      name: 'Shridhar Kinkar',
      rating: 5,
      description:
        'Rent Across is a great initiative and like a boon to photographers. I have availed their services twice for event photography and both times it was a pleasant experience.',
      img: 'https://lh3.googleusercontent.com/a-/ALV-UjVc4w_Xfb94JWiOj2VXL73jk-uKwk9qHYMb1aK6l0H3WOiDxkOm',
      location: 'Pune',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            photography and videography needs
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-[#f7ca00]" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9</span>
            </div>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">1500+ Happy Customers</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-[#f7ca00]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                "{review.description}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <img
                  src={review.img}
                  alt={`${review.name}'s profile`}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#f7ca00]/20"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {review.name}
                  </h4>
                  {review.location && (
                    <p className="text-gray-500 text-xs">{review.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
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
      </div>
    </section>
  )
}
