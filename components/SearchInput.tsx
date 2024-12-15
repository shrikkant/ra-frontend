/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  currentVal: any;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
}
export function SearchInput({ currentVal, onChange, onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleReturn = (e) => {
    if (e.keyCode === 13) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      onSearch(e.target.value);
    }
  };
  return (
    <div className="w-full sm:w-96 gap-x-3 text-gray-800 relative px-1">
      <input
        ref={inputRef}
        defaultValue={currentVal}
        type="text"
        className="h-10 rounded px-2 w-full"
        placeholder="Canon 200D"
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={(e) => handleReturn(e)}
      />
      <button
        onClick={() => onSearch(inputRef.current?.value || '')}
        className="h-10 w-10 bg-amber-500 absolute top-0 right-1 flex justify-center content-center p-2 rounded-br rounded-tr"
      >
        <FaSearch className="h-7 w-7 text-gray-800" />
      </button>
    </div>
  );
}
