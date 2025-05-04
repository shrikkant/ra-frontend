import React from 'react'
import {ILocation} from '../../../app-store/types'

export function Address({address, name}: {address: ILocation; name: string}) {
  return (
    <div className="py-4">
      <div className={'font-semibold'}>{name}</div>
      <div>
        <span>{address.address_line_1},</span>
        <span>{address.address_line_2},</span>
        <span>{address.city},</span>
        <span>{address.state},</span>
        <span>{address.postal_code}</span>
      </div>
    </div>
  )
}
