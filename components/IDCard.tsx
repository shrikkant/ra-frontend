import Moment from 'moment'
import {IAadhaar} from '../app-store/auth/types'

interface IDCardProps {
  aadhaar: IAadhaar
  phone: string
}

export default function IDCard({aadhaar, phone}: IDCardProps) {
  return (
    <div className="shadow-md w-[400px] rounded-lg my-4 border border-gray-200 overflow-hidden">
      <div className="flex">
        <div className="w-[140px] h-[180px] border-r border-gray-200">
          <img
            src={`data:image/png;base64,${aadhaar.profile_image}`}
            className="w-full h-full object-cover"
            alt="Profile"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {aadhaar.full_name}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>DOB: {Moment(aadhaar.dob).format('D MMM YYYY')}</p>
              <p>Phone: {phone}</p>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium text-gray-700">Address:</p>
              <p className="mt-1">
                {Object.values(aadhaar.address).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
