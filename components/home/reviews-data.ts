export interface CustomerReview {
  id: number
  name: string
  rating: number
  description: string
  img: string
  location?: string
}

export const reviews: CustomerReview[] = [
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
