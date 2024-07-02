import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Address } from "../Address";
import { StepHeader } from "./StepHeader";
import { authUser, selectAuthState } from "../../app-store/auth/auth.slice";
import { AddressList } from "../AddressList";
import Form from "../common/form/Form";
import Input from "../common/form/Input";
import AutoComplete from "../common/form/AutoComplete";
import { fetchData } from "../../api/axios.config";
import { addNewAddress } from "../../api/user/index.api";

interface IOption {
  label: string;
  value: string;
}

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
}) => {

  const dispatch = useDispatch();

  const loggedUser: any = useSelector(selectAuthState);
  const [options, setOptions] = React.useState<IOption[]>([]);
  const [place_id, setPlaceId] = React.useState<string>("");
  const [address_line_1, setAddressLine1] = React.useState<string>("");

  const hasAddress = loggedUser && loggedUser.address && loggedUser.address.length > 0;



  const lookUpAddress = async (query: string) => {
    const data = await fetchData(`user/addresses/lookup/${query}`);
    const options = data.map((item) => ({
      label: item.description,
      value: item.place_id,
    }));
    setOptions(options);

  }

  const onSelectPlace = (place: IOption) => {
    setPlaceId(place.value);
    setOptions([]);
  }

  const handleLine1Change = (inputValue: string) => {
    console.log("Logged User : ", loggedUser);
    setAddressLine1(inputValue);

  }
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await addNewAddress(place_id, address_line_1);
    const newUser = { ...loggedUser };
    newUser.address = [...newUser.address, res];
    dispatch(authUser(newUser));
  }

  return (
    <>
      <StepHeader
        index={1}
        label={"Delivery Address"}
        onChangeAction={onAddressReset}
        showChange={selectedAddress}
      >
        {selectedAddress && (
          <Address
            address={selectedAddress}
            name={loggedUser.firstname + " " + loggedUser.lastname}
          />
        )}
      </StepHeader>

      {(!hasAddress) && (
        <div className="text-center mt-4">
          {/* <DocumentUpload /> */}
          <Form>
            <h3 className="text-left text-2xl">Add a new address</h3>
            <Input label={"Flat No, Building/ Society Name"} name={"address_line_1"} onChange={handleLine1Change}></Input>

            {(address_line_1 && address_line_1.length > 5) && <AutoComplete
              label={"Search your locality"}
              name={"title"}
              onChange={lookUpAddress}
              options={options}
              onSelect={onSelectPlace} />}

            <button className="bg-gray-200 p-2 rounded border-gray-800" type="button" onClick={onSubmit}>
              Add Address</button>
          </Form>
        </div>
      )}


      {(!selectedAddress && hasAddress) && (
        <AddressList
          onAddressChange={onAddressPick}
          addressList={loggedUser && loggedUser.address}
          userName={loggedUser?.firstname + " " + loggedUser?.lastname}
        />
      )}
    </>
  );
};
