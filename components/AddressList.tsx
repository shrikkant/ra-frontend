import { useState } from "react";
import { ILocation } from "../app-store/types";
import { RadioListItem } from "./RadioListItem";

interface IAddressList {
  userName: string;
  addressList: ILocation[];
  onAddressChange: any;
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
    <div className={"mt-3 ml-8"}>
      <div className={"border border-gray-400  rounded-md"}>
        <div className={"border-b border-gray-300 p-2 mb-3 text-lg font-semibold pl-5"}>
          Your addresses
        </div>
        <RadioListItem
          value={-1}
          onCheck={checkRadio}
          key={"storePickup"}
          active={selectedAddress === -1}
        >
          <span className={"font-semibold"}>Store Pickup</span>
        </RadioListItem>
        {addressList.map((addr) => (
          <RadioListItem
            key={addr.id}
            value={addr.id}
            onCheck={checkRadio}
            active={addr.id === selectedAddress}
          >
            <span className={"font-bold"}>{userName}</span>
            <span>{addr.address_line_1},</span>
            <span>{addr.address_line_2},</span>
            <span>{addr.city},</span>
            <span>{addr.state},</span>
            <span>{addr.postal_code}</span>
          </RadioListItem>
        ))}
      </div>
    </div>
  );
};
