import React from 'react'

import {ILocation} from '../app-store/types'
interface Address {
  id: number
  name?: string
  address_line_1?: string
  address_line_2?: string
  sublocality?: string
  city?: string
  pin_code?: string
  landmark?: string
}

interface AddressDisplayProps {
  addresses: ILocation[]
}

const ADDRESS_FIELDS = [
  {key: 'name', label: 'Name'},
  {key: 'address_line_1', label: 'Address Line 1'},
  {key: 'address_line_2', label: 'Address Line 2'},
  {key: 'sublocality', label: 'Sublocality'},
  {key: 'city', label: 'City'},
  {key: 'pin_code', label: 'PIN Code'},
  {key: 'landmark', label: 'Landmark'},
] as const

export default function AddressDisplay({addresses}: AddressDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-4">
      {addresses &&
        addresses.map(addr => (
          <div
            key={addr.id}
            className="border rounded-md p-4 w-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-y-2">
              {ADDRESS_FIELDS.map(({key}) => {
                const value = addr[key as keyof Address]
                if (!value) return null
                return (
                  <div
                    key={key}
                    className={`text-gray-700 ${key === 'name' ? 'font-bold text-lg' : ''}`}
                  >
                    {value}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}
