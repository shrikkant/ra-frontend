import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { StepHeader } from "./StepHeader";
import { authUser, selectAuthState } from "../../app-store/auth/auth.slice";
import { AddressList } from "../AddressList";


import { AddAddress } from "../../app/components/user/AddAddress.client";
import { Address } from "../../app/components/user/Address.client";
import { ILocation } from "../../app-store/types";

interface IAddressPickerProps {
  onAddressReset: () => void;
  onAddressPick: (address) => void;
  selectedAddress;
  onNewAddress: (address) => void;
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
  onNewAddress
}: IAddressPickerProps) => {

  const dispatch = useDispatch();

  const loggedUser = useSelector(selectAuthState);

  const hasAddress = loggedUser && loggedUser.address && loggedUser.address.length > 0;


  const onNewAddressSuccess = (address) => {
    let newAddressList: ILocation[] = [];
    if (loggedUser?.address) {
      newAddressList = [...loggedUser.address, address];
    } else {
      newAddressList = [address];
    }

    const updatedUser = { ...loggedUser, address: newAddressList };
    dispatch(authUser(updatedUser));
    onNewAddress(address);
  }

  return (
    <div>
      <StepHeader
        label={"Your Address"}
        onChangeAction={onAddressReset}
        showChange={selectedAddress}
      >
      </StepHeader>
      {selectedAddress ?
        (selectedAddress.id > 0 ?
          <Address
            address={selectedAddress}
            name={loggedUser?.firstname + " " + loggedUser?.lastname}
          /> :
          <div className="py-4">Store Pickup</div>) :
        ""
      }



      {!hasAddress && <AddAddress onNewAddress={onNewAddressSuccess} />}

      {
        (!selectedAddress && hasAddress) && (
          <AddressList
            onAddressChange={onAddressPick}
            addressList={loggedUser?.address ? loggedUser.address : []}
            userName={loggedUser?.firstname + " " + loggedUser?.lastname}
          />
        )
      }
    </div >
  );
};
