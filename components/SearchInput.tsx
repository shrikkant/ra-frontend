import { FaSearch } from "react-icons/fa";

export function SearchInput({currentVal, onChange, onSearch}) {

  const handleReturn = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      onSearch(e.target.value);
    }
  }
  return (
    <div className="w-full sm:w-96 gap-x-3 text-gray-800 relative px-1">
      <input
        defaultValue={currentVal}
        type="text"
        className="h-10 rounded px-2 w-full"
        placeholder="Canon 200D"
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={(e) => handleReturn(e)}
      />
      <button
        onClick={onSearch}
        className="h-10 w-10 bg-amber-500 absolute top-0 right-1 flex justify-center content-center p-2 rounded-br rounded-tr"
      >
        <FaSearch className="h-7 w-7 text-gray-800" />
      </button>
    </div>
  );
}
