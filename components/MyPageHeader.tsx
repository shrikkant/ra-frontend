import React from "react";

import { ArrowLeftIcon, } from "@heroicons/react/24/outline";

export default function MyPageHeader({ ...props }) {

  return (<div className={"flex p-4 gap-2 justify-between items-center "}>
    <div onClick={() => window.history.back()} className="flex mt-4 gap-x-2">
      <span>
        <ArrowLeftIcon className="h-6 w-6" />
      </span>
      <span>
        {props.title}
      </span>
    </div>
    <div className="flex justify-end">
      {props.children}
    </div>

  </div>)

}
