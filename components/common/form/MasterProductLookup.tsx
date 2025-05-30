import React, {useState, useRef, useEffect} from 'react'
import Input from './Input'
import _debounce from 'lodash/debounce'

interface IOption {
  label: string
  value: string
}

interface IMasterProductLookupProps {
  name: string
  label: string
  onChange: (val: string) => void
  onSelect: (val: IOption) => void
  options: IOption[]
  isLoading: boolean
  initialValue?: string
}

export default function MasterProductLookup({
  name,
  label,
  onChange,
  onSelect,
  options,
  isLoading,
  initialValue = '',
}: IMasterProductLookupProps) {
  const [inputValue, setInputValue] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null)
  const [localOptions, setLocalOptions] = useState<IOption[]>([])
  const debounceFn = _debounce(handleDebounceFn, 1200)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Update local options when props options change
  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        // Restore the initial value
        setInputValue(initialValue)
        setLocalOptions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [initialValue])

  const onLocalChange = (val: string) => {
    setInputValue(val)
    setLocalOptions([]) // Clear options when typing
    setIsOpen(true)
    debounceFn(val)
  }

  function handleDebounceFn(inputValue: string) {
    if (inputValue.length < 3) {
      setLocalOptions([]) // Clear options if input is too short
      return
    }
    onChange(inputValue)
  }

  const onLocalSelect = (option: IOption) => {
    setInputValue(option.label)
    setSelectedOption(option)
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        name={name}
        label={label}
        onChange={onLocalChange}
        value={inputValue}
        loading={isLoading}
      />
      {isOpen && localOptions && localOptions.length > 0 && (
        <div className="absolute bg-white w-full border border-gray-300 rounded-md shadow-md z-50 mt-1 max-h-[200px] overflow-auto">
          {localOptions.map((option, index) => (
            <div
              key={`${name}-${index}`}
              onClick={() => onLocalSelect(option)}
              className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
