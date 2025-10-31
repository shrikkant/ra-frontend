import React from 'react'
import Link from 'next/link'
import Scripts from './Scripts'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa'
import {headers} from 'next/headers'

export default async function Footer() {
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  // You can now use pathname to conditionally render
  // For example, hide footer on photobooth pages:
  if (pathname.startsWith('/photobooth')) {
    return <Scripts />
  }

  return (
    <footer className="bg-gradient-to-br from-[#1f2937] to-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2 flex-col flex justify-between">
            <div className="mb-6">
              <img
                className="h-8 mb-4"
                src="/assets/v2/img/logo.png"
                alt="RentAcross"
              />
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Your trusted partner for equipment rentals across India. Quality
                gear, reliable service, and unforgettable adventures await.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/rentacross"
                aria-label="Visit our Facebook page"
                className="bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://x.com/rentacross"
                aria-label="Follow us on X"
                className="bg-gray-700 hover:bg-blue-400 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/rent_across"
                aria-label="Follow us on Instagram"
                className="bg-gray-700 hover:bg-pink-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.youtube.com/@rentacross"
                aria-label="Subscribe our YouTube channel"
                className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaYoutube className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://wa.me/7720829444?text=Hello%20I%20need%20support"
                aria-label="Contact us on WhatsApp"
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaWhatsapp className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
            <div className="text-sm font-light">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy">Privacy Policy</a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms">Terms of Service</a>{' '}
              apply.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#ffd910]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/rental-agreement"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Rental Agreement
                </Link>
              </li>
              <li>
                <Link
                  href="/why-us"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Why Us?
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/our-story"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#ffd910]">
              Our Locations
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pune"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Pune
                </Link>
              </li>
              <li>
                <Link
                  href="/mumbai"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Mumbai
                </Link>
              </li>
              <li>
                <Link
                  href="/bangalore"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Bengaluru
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RentAcross™. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-[#ffd910] transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/return-refund-policy"
                className="text-gray-400 hover:text-[#ffd910] transition-colors duration-300"
              >
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Scripts />
    </footer>
  )
}
