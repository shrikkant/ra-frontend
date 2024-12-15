

import React from "react";
import { FaSpinner } from "react-icons/fa";
import { INPUT_ICON_TYPES } from "../../../config/constants";

interface InputProps {
  name?: string;
  type?: string;
  value?: string;
  label?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  showClear?: boolean;
  error?: string;
  iconType?: INPUT_ICON_TYPES;
  loading?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  size?: "lg" | "sm";
  pattern?: string;
  inputMode?: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  placeholder?: string;
  icon?: string;
}

export default function Input({ ...props }: InputProps) {
  const label = () => {
    if (props.label) {
      return (
        <label className={"text-gray-700  bg-gradient-to-t from-white  text-sm pl-1 text-left z-10 pr-1  block " + ((props.value && props.value.length > 0) ? "visible" : "invisible")} htmlFor={props.name}>
          {props.label}
        </label>
      )
    }
  }

  const handleChange = (e) => {
    props.onChange(e.target.value);
  }

  const onClear = () => {
    // setCurrentValue("");
    if (props.onClear) {
      props.onClear();
    }
  }

  return (
    <div>
      {label()}

      <div className="relative">
        {props.iconType === INPUT_ICON_TYPES.MAP &&
          <div className="absolute bottom-2 left-1">
            <svg xmlns="http://www.w3.org/2000/svg"
              width={22} height={22}
              viewBox="0 0 232597 333333"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd">
              <path d="M151444 5419C140355 1916 128560 0 116311 0 80573 0 48591 16155 27269 41534l54942 46222 69232-82338z" fill="#1a73e8" />
              <path d="M27244 41534C10257 61747 0 87832 0 116286c0 21876 4360 39594 11517 55472l70669-84002-54942-46222z" fill="#ea4335" />
              <path d="M116311 71828c24573 0 44483 19910 44483 44483 0 10938-3957 20969-10509 28706 0 0 35133-41786 69232-82313-14089-27093-38510-47936-68048-57286L82186 87756c8166-9753 20415-15928 34125-15928z" fill="#4285f4" />
              <path d="M116311 160769c-24573 0-44483-19910-44483-44483 0-10863 3906-20818 10358-28555l-70669 84027c12072 26791 32159 48289 52851 75381l85891-102122c-8141 9628-20339 15752-33948 15752z" fill="#fbbc04" />
              <path d="M148571 275014c38787-60663 84026-88210 84026-158728 0-19331-4738-37552-13080-53581L64393 247140c6578 8620 13206 17793 19683 27900 23590 36444 17037 58294 32260 58294 15172 0 8644-21876 32235-58320z" fill="#34a853" />
            </svg>
          </div>
        }

        {props.iconType === INPUT_ICON_TYPES.PHONE &&
          <div className={`absolute left-2 ${props.size === "lg" ? "top-[12px]" : "top-[5px]"} flex gap-1 border-r border-r-[#FFDC2DAD]`}>
            <span>
              <img src={"/assets/img/countries/in.webp"} className="h-6" ></img>
            </span>
            <span className=" text-gray-700 text-[16px] mt-[1px] mr-1">
              +91
            </span>
          </div>
        }


        <input
          style={{
            height: props.size === "lg" ? "50px" : "36px"
          }}
          onKeyDown={props.onKeyDown}
          name={props.name}
          onChange={handleChange}
          className={
            (props.iconType === INPUT_ICON_TYPES.MAP ? "pl-7" : "") +
            (props.iconType === INPUT_ICON_TYPES.PHONE ? "pl-20" : "") +
            (props.showClear ? " pr-14" : " pr-3") +
            (props.error ? " border-red-500" : " ") +
            " shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
          id={props.name}
          type="text"
          placeholder={props.label}
          value={props.value}
          pattern={props?.pattern}
          inputMode={props.inputMode ? props.inputMode : "text"}
        />

        {props.loading &&
          <div className="absolute bottom-3 right-2">
            <FaSpinner className="animate-spin" />
          </div>
        }
        {props.showClear &&
          <div onClick={onClear} className="absolute bottom-2 right-3 cursor-pointer">
            <span className="text-red-500">Clear</span>
          </div>

        }

        {props.error && <div className="text-sm text-[#E03546] ml-2 w-full text-left">
          {props.error}
        </div>}

      </div>
    </div>

  );
}


