'use client'
import React from 'react'
import {Section} from '../common/Section'
import AddressModal from '../../../components/user/AddressModal'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import {ILocation} from '../../../app-store/types'

export default function AddressListCard() {
  const loggedUser = useSelector(selectAuthState)

  return (
    <Section
      title="Address Book"
      actions={[<AddressModal key={'addr_modal'}></AddressModal>]}
    >
      <div className="flex flex-col px-4">
        {loggedUser.address?.map((a: ILocation) => (
          <div key={a.id} className="flex justify-between items-center py-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700">
                {a.address_line_1}
              </h3>
              <p className="text-sm text-gray-500">
                {a.city} {a.postal_code}
              </p>
            </div>
            {/* <button className="text-sm text-blue-500">Edit</button> */}
          </div>
        ))}
      </div>
    </Section>
  )
}
