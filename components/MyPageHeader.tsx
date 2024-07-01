import React from "react";

import { ArrowLeftIcon, } from "@heroicons/react/24/outline";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function MyPageHeader({ ...props }) {

  return (<div className={"flex p-10 gap-2"}>
    <div className="flex-20" onClick={() => window.history.back()}>
      <ArrowLeftIcon className="h-6 w-6" />
    </div>
    <div className="text-bold flex-1">
      {props.title}
    </div>
    <div className="flex-1 flex justify-end">
      {props.addAction && <button onClick={props.addAction}>
        <IoMdAddCircleOutline className="h-8 w-8" />
      </button>}
    </div>

  </div>)

}
