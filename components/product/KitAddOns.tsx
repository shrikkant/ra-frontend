

import React, { useEffect, useState } from "react";
import Input from "../common/form/Input";

import { IoMdAddCircleOutline, IoMdRemoveCircle } from "react-icons/io";

interface IAddOnItem {
  id: number,
  label: string
}
const defaultAddons: IAddOnItem[] = [
  { id: 1, label: "Camera" }
];

export default function KitAddOns() {
  const [addons, setAddons] = useState<IAddOnItem[]>(defaultAddons);

  useEffect(() => {
    const kitAddons = [...addons]
    setAddons(kitAddons);
  }, [])

  const addItem = (i) => {
    const currentAddons = [...addons];
    const index = currentAddons.length + 1
    currentAddons.push({
      id: index,
      label: "Add on "
    })


    setAddons(currentAddons);
  }

  const removeItem = (addon) => {
    const currentAddons: IAddOnItem[] = addons.filter((a) => a.id !== addon.id);

    setAddons(currentAddons);
  }

  const onAddonChange = (id, event) => {
    const val = event.target.value;
    const updateAddon: any = addons.find((a) => a.id === id);
    updateAddon.label = event.target.value;
  }

  return (<div className="mt-4">
    <div className="flex  text-gray-700 text-sm font-bold mb-2 items-center justify-center">
      <div className="flex-1">
        Addons
      </div>
      <div >
        <div onClick={addItem} className="cursor-pointer">
          <IoMdAddCircleOutline className="h-6 w-6" />
        </div>
      </div>
    </div>

    {addons && addons.map((addon, i) => <div key={addon.id} className="flex  items-center justify-center gap-4">
      <div className="flex-1">
        <Input label={""} placeholder={addon.label + " : " + addon.id} value={addon.label} onChange={(e) => onAddonChange(addon.id, e)} />
      </div>
      <div className={"mb-4 cursor-pointer"} onClick={() => removeItem(addon)}>
        <label className="mb-2"></label>
        <IoMdRemoveCircle className="h-6 w-6" />
      </div>
    </div>)}

  </div>
  );
}
