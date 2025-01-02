import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { StepHeader } from "./StepHeader";
import { authUser, selectAuthState } from "../../app-store/auth/auth.slice";
import { AddressList } from "../AddressList";

// import AutoComplete from "../common/form/AutoComplete";
// import httpClient from "../../api/axios.config";
import { AddAddress } from "../../app/components/user/AddAddress.client";
import { Address } from "../../app/components/user/Address.client";


// interface IOption {
//   label: string;
//   value: string;
// }

// interface IGooglePlace {
//   description: string;
//   place_id: string;
// }

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
  // const [options, setOptions] = React.useState<IOption[]>([]);
  // const [place_id, setPlaceId] = React.useState<string>("");


  // const [loading, setLoading] = React.useState<boolean>(false);

  const hasAddress = loggedUser && loggedUser.address && loggedUser.address.length > 0;



  // const lookUpAddress = async (query: string) => {
  //   setLoading(true);
  //   const data: IGooglePlace[] = await httpClient.get(`user/addresses/lookup/${query}`);

  //   const options = data.map((item) => ({
  //     label: item.description,
  //     value: item.place_id,
  //   }));
  //   setLoading(false);
  //   setOptions(options);

  // }

  // const onSelectPlace = (place: IOption) => {
  //   setPlaceId(place?.value);
  //   setOptions([]);
  // }


  const onNewAddressSuccess = (address) => {
    const newAddressList = [...loggedUser.address, address];
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



      <AddAddress onNewAddress={onNewAddressSuccess} />

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
