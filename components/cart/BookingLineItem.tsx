
import React from "react"
import PriceTag from "../PriceTag"
export const BookingLineItem = ({ children, amount, primary }: { children: any, amount: number, primary?: boolean }) => {

  return (<div className={"flex justify-between m-1 " + (primary ? " border-t text-2xl pt-2 text-red-800" : "")}>
    <div className="flex gap-1">
      {children}
    </div >
    <div className="text-md font-semibold flex gap-1">
      <PriceTag price={amount} />
    </div>
  </div >)
}
