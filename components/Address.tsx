import React from "react";
import { ILocation } from "../app-store/types";
export const Address = ({ name, address }: { name: string, address: ILocation }) => {
  return (
    <div className={"text-base font-normal flex flex-col"}>
      <div>{address.name}</div>
      {address.id > 0 && <div className={"flex-col"}>
        <span>{address.address_line_1},</span>
        <span>
          {address.address_line_2}, {address.city}
        </span>
        <span>{address.state},</span>
        <span>{address.postal_code}</span>
      </div>}
      {!address.id && <div className={"font-semibold"}>Store Pickup</div>}
    </div>
  );
};
