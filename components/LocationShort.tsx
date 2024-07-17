import React from "react";

export default function LocationShort({ location }: { location: any }) {
  return (<div className="r-comp">{location?.city}</div>);
}
