import React from "react";
import Input from "./Input";
import _debounce from "lodash/debounce";


export default function AutoComplete({ name, label, onChange, onSelect, options, ...rest }) {
  const [inputValue, setInputValue] = React.useState("");
  const debounceFn = _debounce(handleDebounceFn, 1200);

  const onLocalChange = (val: string) => {
    debounceFn(val);
  }

  function handleDebounceFn(inputValue: string) {
    onChange(inputValue);
  }

  const onLocalSelect = (option) => {
    setInputValue(option.label);
    onSelect(option);
  }

  return (
    <div className="relative">

      <Input name={name} label={label} onChange={onLocalChange} value={inputValue} icon="map" />

      {
        (options && options.length > 0) && (
          <div className="absolute bg-white w-full border border-gray-300 rounded-md shadow-md">
            {options.map((option, index) => (
              <div key={index} onClick={() => onLocalSelect(option)} className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200">
                {option.label}
              </div>
            ))}
          </div>
        )}
    </div>);
}