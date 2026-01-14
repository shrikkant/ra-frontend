import {format} from 'date-fns'
import {IAadhaar} from '../app-store/auth/types'
import {IUser} from '../app-store/types'
import {SIGNIN_SOURCE} from '../config/constants'
interface IDCardProps {
  aadhaar?: IAadhaar
  customer?: IUser
  phone: string
}

const getProfilePicUrl = (
  profilePic: string | undefined,
  source: string | undefined,
) => {
  if (!profilePic || !source) return null

  if (source === SIGNIN_SOURCE.GOOGLE) {
    return profilePic.substring(0, profilePic.lastIndexOf('='))
  }

  return null
}

export default function IDCard({aadhaar, customer, phone}: IDCardProps) {
  const hasAadhaar = !!aadhaar && Object.keys(aadhaar).length > 0
  const hasCustomer = !!customer

  if (!hasAadhaar && !hasCustomer) {
    return null
  }

  return (
    <div className="shadow-md max-w-[400px] w-full rounded-lg my-4 border border-gray-200 overflow-hidden">
      <div className="flex">
        <div className="w-[140px] h-[180px] border-r border-gray-200">
          {hasAadhaar && (
            <img
              src={`data:image/png;base64,${aadhaar.profile_image}`}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          )}
          {hasCustomer &&
            !hasAadhaar &&
            (customer.profile_pic ? (
              <img
                className="w-full h-full object-cover"
                src={
                  getProfilePicUrl(
                    customer.profile_pic,
                    customer.signin_source,
                  ) || ''
                }
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">No Photo</span>
              </div>
            ))}
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {hasAadhaar
                ? aadhaar.full_name
                : `${customer?.firstname || ''} ${customer?.lastname || ''}`}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              {hasAadhaar && (
                <p>DOB: {format(new Date(aadhaar.dob), 'd MMM yyyy')}</p>
              )}
              <p>Phone: {phone}</p>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium text-gray-700">Address:</p>
              <p className="mt-1">
                {hasAadhaar
                  ? Object.values(aadhaar.address).join(', ')
                  : customer?.address
                      ?.map(
                        location =>
                          `${location.address_line_1}, ${location.city}, ${location.state}, ${location.postal_code}`,
                      )
                      .join(', ') || 'No address available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
