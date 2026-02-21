import React from 'react'
import {useSelector} from 'react-redux'

import {StepHeader} from './StepHeader'
import {selectAuthState} from '../../app-store/auth/auth.slice'
import {AddressList} from '../AddressList'

import {AddAddress} from '../../app/components/user/AddAddress.client'
import {Address} from '../../app/components/user/Address.client'
import {ILocation} from '../../app-store/types'

interface IAddressPickerProps {
  onAddressReset: () => void
  onAddressPick: (address: number) => void
  selectedAddress: ILocation | null | undefined
  addresses: ILocation[]
  addressesLoaded?: boolean
  onNewAddress?: (address: ILocation) => void
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
  addresses,
  addressesLoaded = true,
  onNewAddress,
}: IAddressPickerProps) => {
  const [showingAddForm, setShowingAddForm] = React.useState(false)
  const loggedUser = useSelector(selectAuthState)
  const canAddMoreAddresses = addresses.length < 3

  const onNewAddressSuccess = (address: ILocation) => {
    setShowingAddForm(false)
    onNewAddress?.(address)
  }

  const handleAddNewClick = () => {
    setShowingAddForm(true)
  }

  // State 1: Address selected — show selected address + Change button
  if (selectedAddress) {
    return (
      <div>
        <StepHeader label="Delivery Address" />
        {selectedAddress.id > 0 ? (
          <Address
            address={selectedAddress}
            name={loggedUser?.firstname + ' ' + loggedUser?.lastname}
          />
        ) : (
          <div className="py-4">Store Pickup</div>
        )}
        <span
          onClick={onAddressReset}
          className="px-2 py-1 border border-gray-300 rounded-md bg-gray-500 cursor-pointer text-gray-50"
        >
          Change
        </span>
      </div>
    )
  }

  // Still loading addresses — don't render yet to avoid flash
  if (!addressesLoaded) {
    return (
      <div>
        <StepHeader label="Delivery Address" />
      </div>
    )
  }

  // State 2: No addresses — show add address form
  if (addresses.length === 0) {
    return (
      <div>
        <StepHeader label="Your Address" />
        <AddAddress onNewAddress={onNewAddressSuccess} />
      </div>
    )
  }

  // State 3: 1+ addresses, none selected — show delivery options list
  return (
    <div>
      <StepHeader label="Delivery Address" />
      {showingAddForm ? (
        <AddAddress onNewAddress={onNewAddressSuccess} />
      ) : (
        <>
          <AddressList
            onAddressChange={onAddressPick}
            addressList={addresses}
            userName={loggedUser?.firstname + ' ' + loggedUser?.lastname}
            userCity={loggedUser?.city}
          />
          {canAddMoreAddresses && (
            <button
              onClick={handleAddNewClick}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer"
            >
              + Add New Address
            </button>
          )}
        </>
      )}
    </div>
  )
}
