import React, { useState } from "react";
import Input from "./Input";
import _debounce from "lodash/debounce";


export default function AutoComplete({ name, label, onChange, onSelect, options, isLoading }) {
  const [inputValue, setInputValue] = React.useState("");
  const debounceFn = _debounce(handleDebounceFn, 1200);
  const [showClear, setShowClear] = useState(false);
  const [error, setError] = useState("");

  const onLocalChange = (val: string) => {
    if (val.length === 0) {
      setShowClear(false);
      setError("Locality or Landmark is required");
    }
    setInputValue(val);
    debounceFn(val);
  }

  function handleDebounceFn(inputValue: string) {
    if (inputValue.length < 3) {
      return;
    }
    setError("");
    onChange(inputValue);
  }

  const onLocalSelect = (option) => {
    setInputValue(option.label);
    onSelect(option);
    setShowClear(true);
  }

  const onClear = () => {
    setInputValue("");
    onSelect("");
    setError("Locality or Landmark is required");
    setShowClear(false);
  }

  return (
    <div className="relative">
      <Input
        name={name}
        label={label}
        onChange={onLocalChange}
        value={inputValue}
        icon="map"
        loading={isLoading}
        showClear={showClear}
        onClear={onClear}
        error={error} />
      {
        (options && options.length > 0) && (
          <div className="absolute bg-white w-full border border-gray-300 rounded-md shadow-md z-20">
            {options.map((option, index) => (
              <div key={index} onClick={() => onLocalSelect(option)} className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200">
                {option.label}
              </div>
            ))}
          </div>
        )}
    </div>);
}
