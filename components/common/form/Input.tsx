

import React from "react";
export default function Input({ ...props }) {

  const label = () => {
    if (props.label) {
      return (
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.name}>
          {props.label}
        </label>
      )
    }
  }
  return (
    <div className="mb-4">
      {label()}

      <input
        name={props.name}
        onChange={props.onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={props.name} type="text" placeholder={props.placeholder} />
    </div>
  );
}


