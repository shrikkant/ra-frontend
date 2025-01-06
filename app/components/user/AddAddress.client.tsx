
import React from "react";

import { addLocalAddress } from "../../../api/user/index.api";
import { ILocation } from "../../../app-store/types";
import Input from "components/common/form/Input";


interface IAddressErrors {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}


export function AddAddress({ onNewAddress }: { onNewAddress: (address: ILocation) => void }) {

  const [address_line_1, setAddressLine1] = React.useState<string>("");
  const [address_line_2, setAddressLine2] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [postal_code, setPostalCode] = React.useState<string>("");
  const [errors, setErrors] = React.useState<IAddressErrors | null>();

  const handleLine1Change = (inputValue: string) => {
    if (errors?.address_line_1) {
      setErrors({ ...errors, address_line_1: "" });
    }
    setAddressLine1(inputValue);
  }

  const handleLine2Change = (inputValue: string) => {
    if (errors?.address_line_2) {
      setErrors({ ...errors, address_line_2: "" });
    }
    setAddressLine2(inputValue);
  }

  const handleCityChange = (inputValue: string) => {
    if (errors?.city) {
      setErrors({ ...errors, city: "" });
    }
    setCity(inputValue);
  }

  const handleStateChange = (inputValue: string) => {
    if (errors?.state) {
      setErrors({ ...errors, state: "" });
    }
    setState(inputValue);
  }

  const handlePostalCodeChange = (inputValue: string) => {
    if (errors?.postal_code) {
      setErrors({ ...errors, postal_code: "" });
    }

    setPostalCode(inputValue);
  }

  const onSubmit = async (e) => {
    if (!isValid()) {
      return;
    }
    const newAddress: ILocation = await addLocalAddress(address_line_1, address_line_2, city, state, postal_code);
    onNewAddress(newAddress);
    e.preventDefault();
  }

  const isValid = () => {
    const errors: IAddressErrors = {};
    const required = "This field is required";

    let hasErrors = false;

    if (!address_line_1) {
      errors.address_line_1 = required;
      hasErrors = true;
    }

    if (!address_line_2) {
      errors.address_line_2 = required;
      hasErrors = true;
    }

    if (!city) {
      errors.city = required;
      hasErrors = true;
    }

    if (!state) {
      errors.state = required;
      hasErrors = true;
    }

    if (!postal_code) {
      errors.postal_code = required;
      hasErrors = true;
    }

    setErrors(errors);
    return !hasErrors;
  }


  return (
    <div className="text-center xs:w-full pt-4">
      <div className="flex flex-col gap-y-4">
        <Input
          label={"Flat No, Building/ Society Name"}
          name={"address_line_1"}
          onChange={handleLine1Change}
          value={address_line_1}
          error={errors?.address_line_1}></Input>

        <Input
          label={"Locality, Landmark"}
          name={"address_line_2"}
          onChange={handleLine2Change}
          error={errors?.address_line_2}
        ></Input>

        <div className="flex gap-x-4">
          <Input
            label={"City"}
            name={"city"}
            onChange={handleCityChange}
            error={errors?.city}
          ></Input>

          <Input
            label={"State"}
            name={"state"}
            onChange={handleStateChange}
            error={errors?.state}
          ></Input>
        </div>

        <div className="w-32">
          <Input
            label={"Postal code"}
            name={"postal_code"}
            onChange={handlePostalCodeChange}
            error={errors?.postal_code}
          ></Input>
        </div>



        <div className="border-2 border-gray-500 rounded-md p-2">
          We will need at least 2 original documents to verify your address. Your address should match the address on the documents.
        </div>
        {/* {<AutoComplete
              label={"Locality, Landmark"}
              name={"title"}
              onChange={lookUpAddress}
              options={options}
              onSelect={onSelectPlace}
              isLoading={loading} />} */}

        <div className="flex justify-end pt-2">

          <button
            className={`p-2 rounded border-gray-800 text-right bg-yellow-400`}
            type="button"
            onClick={onSubmit}>
            Save Address
          </button>
        </div>

      </div>
    </div>
  )
}
