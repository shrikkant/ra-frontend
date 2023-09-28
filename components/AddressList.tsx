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
    document.getElementById("addr_" + addressId).checked = true;
    setSelectedAddress(addressId);
    onAddressChange(addressId);
  };
  return (
    <>
      <RadioListItem value={-1} onCheck={checkRadio} key={"storePickup"} active={selectedAddress === -1} >
        <span className={"font-semibold"}>Store Pickup</span>
      </RadioListItem>
      {addressList.map((addr) => (
        <RadioListItem key={addr.id} value={addr.id} onCheck={checkRadio} active={addr.id === selectedAddress}>
          <span className={"font-bold"}>{userName}</span>
          <span>{addr.address_line_1},</span>
          <span>{addr.address_line_2},</span>
          <span>{addr.city},</span>
          <span>{addr.state},</span>
          <span>{addr.postal_code}</span>
        </RadioListItem>
      ))}
    </>
  );
};
