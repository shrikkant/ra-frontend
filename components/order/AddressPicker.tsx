import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StepHeader} from './StepHeader'
import {authUser, selectAuthState} from '../../app-store/auth/auth.slice'
import {AddressList} from '../AddressList'

import {AddAddress} from '../../app/components/user/AddAddress.client'
import {Address} from '../../app/components/user/Address.client'
import {ILocation} from '../../app-store/types'

interface IAddressPickerProps {
  onAddressReset: () => void
  onAddressPick: (address) => void
  selectedAddress
  onNewAddress?: (address) => void
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
  onNewAddress,
}: IAddressPickerProps) => {
  const dispatch = useDispatch()

  const loggedUser = useSelector(selectAuthState)

  const hasAddress =
    loggedUser && loggedUser.address && loggedUser.address.length > 0

  const onNewAddressSuccess = address => {
    let newAddressList: ILocation[] = []
    if (loggedUser?.address) {
      newAddressList = [...loggedUser.address, address]
    } else {
      newAddressList = [address]
    }

    const updatedUser = {...loggedUser, address: newAddressList}
    dispatch(authUser(updatedUser))
    onNewAddress?.(address)
  }

  return (
    <div>
      <StepHeader
        label={!hasAddress ? 'Your Address' : 'Delivery Address'}
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

      {!hasAddress && <AddAddress onNewAddress={onNewAddressSuccess} />}

      {!selectedAddress && hasAddress && (
        <AddressList
          onAddressChange={onAddressPick}
          addressList={loggedUser?.address ? loggedUser.address : []}
          userName={loggedUser?.firstname + ' ' + loggedUser?.lastname}
          userCity={loggedUser?.city}
        />
      )}
    </div>
  )
}
