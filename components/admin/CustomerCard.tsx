import React from 'react'
import Link from 'next/link'
import {FaCheckDouble, FaSignInAlt, FaWhatsapp, FaUser} from 'react-icons/fa'

interface Customer {
  id: number
  firstname: string
  lastname: string
  email_address: string
  phone?: string
  city?: string
  profile_pic?: string
  verified?: number
}

interface CustomerCardProps {
  customer: Customer
  onAdminLogin: (customerId: number) => void
  onVisitProfile: (customerId: number) => void
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onAdminLogin,
  onVisitProfile,
}) => {
  const fullName = `${customer.firstname} ${customer.lastname}`

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 w-full max-w-full overflow-hidden">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Customer Info */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group flex-1 min-w-0"
          onClick={() => onVisitProfile(customer.id)}
        >
          <div className="flex-shrink-0">
            {customer.profile_pic ? (
              <img
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border border-gray-200 group-hover:border-amber-300 transition-colors"
                src={customer.profile_pic}
                alt={fullName}
              />
            ) : (
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                {fullName}
              </h3>
              {customer?.verified === 3 && (
                <FaCheckDouble
                  className="h-3 w-3 text-green-500 flex-shrink-0"
                  title="Verified"
                />
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
              {customer.email_address}
            </p>
            {customer.phone && (
              <Link
                href={`tel:+91${customer.phone}`}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors truncate block mt-1"
                onClick={e => e.stopPropagation()}
                title="Call customer"
              >
                📞 {customer.phone}
              </Link>
            )}
            {customer.city && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {customer.city}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {customer?.phone && (
            <Link
              href={`https://wa.me/91${customer.phone}?text=Hi ${customer.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}
              target="_blank"
              className="p-1 sm:p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Contact via WhatsApp"
            >
              <FaWhatsapp className="h-6 w-6 sm:h-8 sm:w-8" />
            </Link>
          )}

          <button
            onClick={() => onAdminLogin(customer.id)}
            className="p-1 sm:p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
            title="Login as customer"
          >
            <FaSignInAlt className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </div>
      </div>
    </div>
  )
}
