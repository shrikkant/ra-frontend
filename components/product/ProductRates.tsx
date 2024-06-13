

import React, { useEffect, useState } from "react";
import Input from "../common/form/Input";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { IoMdAddCircleOutline, IoMdRemoveCircle } from "react-icons/io";
import SelectField from "../common/form/SelectField";

interface RatePlan {
  code?: string,
  title?: string,
  selected?:boolean,
  choices?:IChoice[]
}

interface IChoice {
  value: string,
  label: string,
  selected?:boolean,
}

const defaultChoices: RatePlan[] = [
  { code: "D", title: " 1-6 days" },
  { code: "W", title: "7-13 days" },
  { code: "M", title: "14+ days" }
];

export default function ProductRates() {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);

  const [planChoices, setPlanChoices] = useState<IChoice[]>();
  useEffect(() => {
    const planChoices: any = defaultChoices.map((plan) => {
      return {
        value: plan.code,
        label: plan.title
      }
    })
    setPlanChoices(planChoices)
  }, [])

  const addItem = () => {
    const plans = [...ratePlans];
    const planToAdd: any = defaultChoices[plans.length];

    planToAdd.choices = defaultChoices.filter((c) => { return plans.map((p) => p.code != c.code)}).map((plan) => {
      return {
        value: plan.code,
        label: plan.title,
      }
    });

    plans.push(planToAdd)
    setRatePlans(plans);
  }

  const removeItem = (addon) => {

  }

  const onRateChange = (id, event) => {
    const val = event.target.value;
  }

  return (<div className="mt-4">
    <div className="flex  text-gray-700 text-sm font-bold mb-2 items-center justify-center">
      <div className="flex-1">
        Rental Rates
      </div>
      <div >
        <div onClick={addItem} className="cursor-pointer">
          <IoMdAddCircleOutline className="h-6 w-6" />
        </div>
      </div>
    </div>

    {ratePlans && ratePlans.map((plan, i) => <div key={i} className="flex  items-center justify-center gap-4">
      <div className="flex-1/2 justify-center flex">
        <SelectField choices={plan.choices} defaultValue={ plan.code }></SelectField>
      </div>
      <div className="flex-1">
        <Input label={""} placeholder={plan.title} value={plan.code} onChange={(e) => onRateChange(e, plan)} />
      </div>
      <div className={"mb-4 cursor-pointer"} onClick={() => removeItem(plan)}>
        <label className="mb-2"></label>
        <IoMdRemoveCircle className="h-6 w-6" />
      </div>
    </div>)}

  </div>
  );
}
