import React from 'react'
import {ILocation} from '../../../app-store/types'

export function Address({address, name}: {address: ILocation; name: string}) {
  return (
    <div className="py-4">
      <span className="font-semibold">{address.address_line_1}</span>
      <div>
        <span>{address.address_line_2},</span>
        <span>{address.city},</span>
        <span>{address.state},</span>
        <span>{address.postal_code}</span>
      </div>
    </div>
  )
}
