import React, { useState } from "react";
import { ILocation } from "../app-store/types";
import { RadioListItem } from "./RadioListItem";
import { Address } from "../app/components/user/Address.client";

interface IAddressList {
  userName: string;
  addressList: ILocation[];
  onAddressChange;
}

export const AddressList = ({
  addressList,
  userName,
  onAddressChange,
}: IAddressList) => {
  const [selectedAddress, setSelectedAddress] = useState(0);

  const checkRadio = (addressId) => {
    const el = document.getElementById("addr_" + addressId) as HTMLInputElement;
    el.checked = true;
    setSelectedAddress(addressId);
    onAddressChange(addressId);
  };
  return (
    <div className={"mt-3"}>
      <div className={"border border-gray-400  rounded-md p-4"}>
        <RadioListItem
          value={"-1"}
          onCheck={checkRadio}
          key={"storePickup"}
          active={selectedAddress === -1}
        >
          <div>
            <div className="font-semibold">Store Pickup</div>
            <div className={" font-semibold text-green-800"}>No additional cost</div>
          </div>

        </RadioListItem>
        {addressList &&
          addressList.map((addr) => (
            <RadioListItem
              key={addr.id}
              value={addr.id + ""}
              onCheck={checkRadio}
              active={addr.id === selectedAddress}
            >
              <Address address={addr} name={userName} />
            </RadioListItem>
          ))}
      </div>
    </div>
  );
};
