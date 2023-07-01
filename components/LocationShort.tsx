import React from "react";

export default function LocationShort({location}) {


  return (<div className="r-comp">{location?.address_line_2 + ", " + location?.city}</div>);
}
