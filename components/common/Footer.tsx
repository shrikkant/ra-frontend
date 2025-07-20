import React from 'react'
import Scripts from './Scripts'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1f2937] to-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#ffd910]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/rental-agreement"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Rental Agreement
                </a>
              </li>
              <li>
                <a
                  href="/why-us"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Why Us?
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-use"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/our-story"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Our Story
                </a>
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
                <a
                  href="/pune"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Pune
                </a>
              </li>
              <li>
                <a
                  href="/mumbai"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Mumbai
                </a>
              </li>
              <li>
                <a
                  href="/bangalore"
                  className="text-gray-300 hover:text-[#ffd910] transition-colors duration-300 text-sm"
                >
                  Bengaluru
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 RentAcross. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy-policy"
                className="text-gray-400 hover:text-[#ffd910] transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/return-refund-policy"
                className="text-gray-400 hover:text-[#ffd910] transition-colors duration-300"
              >
                Returns & Refunds
              </a>
            </div>
          </div>
        </div>
      </div>
      <Scripts />
    </footer>
  )
}
