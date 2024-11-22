import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Address } from "../Address";
import { StepHeader } from "./StepHeader";
import { authUser, selectAuthState } from "../../app-store/auth/auth.slice";
import { AddressList } from "../AddressList";
import Input from "../common/form/Input";
import AutoComplete from "../common/form/AutoComplete";
import httpClient from "../../api/axios.config";
import { addNewAddress } from "../../api/user/index.api";

interface IOption {
  label: string;
  value: string;
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
  onNewAddress
}) => {

  const dispatch = useDispatch();

  const loggedUser: any = useSelector(selectAuthState);
  const [options, setOptions] = React.useState<IOption[]>([]);
  const [place_id, setPlaceId] = React.useState<string>("");
  const [address_line_1, setAddressLine1] = React.useState<string>("");
  const [line1error, setLine1Error] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(false);

  const hasAddress = loggedUser && loggedUser.address && loggedUser.address.length > 0;



  const lookUpAddress = async (query: string) => {
    setLoading(true);
    const data: any = await httpClient.get(`user/addresses/lookup/${query}`);

    const options = data.map((item) => ({
      label: item.description,
      value: item.place_id,
    }));
    setLoading(false);
    setOptions(options);

  }

  const onSelectPlace = (place: IOption) => {
    setPlaceId(place?.value);
    setOptions([]);
  }

  const handleLine1Change = (inputValue: string) => {
    if (inputValue.length === 0) {
      setLine1Error("This field is required");
    } else {
      setLine1Error("");
    }

    setAddressLine1(inputValue);
  }



  const onSubmit = async (e) => {
    e.preventDefault();
    if (!place_id) {
      return;
    }
    const newAddress = await addNewAddress(place_id, address_line_1);
    const newUser = { ...loggedUser };
    newUser.address = [newAddress];
    onNewAddress(newAddress);
    dispatch(authUser(newUser));
  }

  return (
    <div className="p-4">
      <StepHeader
        label={"Delivery Address"}
        onChangeAction={onAddressReset}
        showChange={selectedAddress}
      >
      </StepHeader>
      {selectedAddress && (
        <Address
          address={selectedAddress}
          name={loggedUser.firstname + " " + loggedUser.lastname}
        />
      )}
      {(!hasAddress) && (
        <div className="text-center xs:w-full pt-4">
          <div className="flex flex-col gap-y-4">
            <Input
              label={"Flat No, Building/ Society Name"}
              name={"address_line_1"}
              onChange={handleLine1Change}
              value={address_line_1}
              error={line1error}></Input>

            {<AutoComplete
              label={"Locality, Landmark"}
              name={"title"}
              onChange={lookUpAddress}
              options={options}
              onSelect={onSelectPlace}
              isLoading={loading} />}

            <div className="flex justify-end pt-2">

              <button
                className={`p-2 rounded border-gray-800 text-right ${place_id ? "bg-yellow-400" : "bg-gray-300"}`}
                type="button"
                onClick={onSubmit}
                disabled={!place_id}>
                Add Address
              </button>
            </div>

          </div>
        </div>
      )
      }


      {
        (!selectedAddress && hasAddress) && (
          <AddressList
            onAddressChange={onAddressPick}
            addressList={loggedUser && loggedUser.address}
            userName={loggedUser?.firstname + " " + loggedUser?.lastname}
          />
        )
      }
    </div >
  );
};
