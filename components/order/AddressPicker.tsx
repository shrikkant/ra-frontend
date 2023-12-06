import { useSelector } from "react-redux";
import { Address } from "../Address";
import { StepHeader } from "./StepHeader";
import { selectAuthState } from "../../app-store/auth/auth.slice";
import { AddressList } from "../AddressList";

export const AddressPicker = ({
  onAddressReset,
  onAddressPick,
  selectedAddress,
}) => {
  const loggedUser = useSelector(selectAuthState);

  return (
    <>
      <StepHeader
        index={1}
        label={"Delivery Address"}
        onChangeAction={onAddressReset}
      >
        {selectedAddress && (
          <Address
            address={selectedAddress}
            name={loggedUser.firstname + " " + loggedUser.lastname}
          />
        )}
      </StepHeader>
      {!selectedAddress && (
        <AddressList
          onAddressChange={onAddressPick}
          addressList={loggedUser && loggedUser.address}
          userName={loggedUser?.firstname + " " + loggedUser?.lastname}
        />
      )}
    </>
  );
};
