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
  onNewAddress?: (address: ILocation) => void
  showAddForm?: boolean
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
  addresses,
  onNewAddress,
  showAddForm = false,
}: IAddressPickerProps) => {
  const [showingAddForm, setShowingAddForm] = React.useState(false)
  const loggedUser = useSelector(selectAuthState)
  const hasMultipleAddresses = addresses.length >= 2
  const canAddMoreAddresses = addresses.length < 3

  // Show form if: no addresses, OR (1 address and user clicked change), OR user clicked Add New
  const showAddAddressForm =
    addresses.length === 0 ||
    (addresses.length === 1 && showAddForm) ||
    showingAddForm

  const onNewAddressSuccess = (address: ILocation) => {
    // Hide the form and notify parent to refetch addresses
    setShowingAddForm(false)
    onNewAddress?.(address)
  }

  const handleAddNewClick = () => {
    setShowingAddForm(true)
  }

  return (
    <div>
      <StepHeader
        label={addresses.length === 0 ? 'Your Address' : 'Delivery Address'}
      ></StepHeader>

      {selectedAddress ? (
        selectedAddress.id > 0 ? (
          <Address
            address={selectedAddress}
            name={loggedUser?.firstname + ' ' + loggedUser?.lastname}
          />
        ) : (
          <div className="py-4">Store Pickup</div>
        )
      ) : (
        ''
      )}
      {selectedAddress && (
        <span
          onClick={onAddressReset}
          className="px-2 py-1 border border-gray-300 rounded-md bg-gray-500 cursor-pointer text-gray-50"
        >
          Change
        </span>
      )}

      {showAddAddressForm && <AddAddress onNewAddress={onNewAddressSuccess} />}

      {!selectedAddress && hasMultipleAddresses && !showingAddForm && (
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
