import React from "react";
import { OrderStages, resolveOrderStage } from "../../util/global.util"
import { updateStage } from "api/admin/orders.api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveOrder } from "app-store/admin/index.slice";
import { IOrder } from "../../app-store/types";
import Input from "../common/form/Input";


export function OrderStageForm({ order }: { order: IOrder }) {
  const dispatch = useDispatch();
  const [orderChange, setOrderChange] = useState({ serialNoInfo: [], stage: order.stage, id: 0 });

  const handleStageChange = (value: string) => {
    setOrderChange({ ...orderChange, stage: parseInt(value) });
  }

  const updateOrderStage = async (id: number) => {
    const updatedOrder = { ...order };
    updatedOrder.stage = orderChange.stage;
    updateStage(id, { ...orderChange, id }).then(data => {
      dispatch(setActiveOrder(updatedOrder));
    })
  }

  useEffect(() => {
    console.log(orderChange);
  }, [orderChange]);

  const handleSerialNoInput = async (transactionId, addon, value) => {

    const orderUpdate: any = { ...orderChange };

    const alreadyExists: any = await orderUpdate.serialNoInfo.find((item: any) => (item.id == transactionId));


    if (alreadyExists) {
      let serialInfo: any = alreadyExists?.serial_no_json.find((item) => (item.id == addon.id));
      if (serialInfo) {
        serialInfo.serial_no = value;
      } else {
        serialInfo = {};

        serialInfo.id = addon.id;
        serialInfo.productId = addon.masterProduct.id;
        serialInfo.name = addon.masterProduct.name;
        serialInfo.serial_no = value;
        alreadyExists.serial_no_json.push(serialInfo);
      }
    } else {
      const newInfo: any = {};

      newInfo.id = transactionId;
      newInfo.serial_no_json = [];
      const serialInfo: any = {};

      serialInfo.id = addon.id;
      serialInfo.productId = addon.masterProduct.id;
      serialInfo.name = addon.masterProduct.name;
      serialInfo.serial_no = value;
      newInfo.serial_no_json.push(serialInfo);
      orderUpdate.serialNoInfo.push(newInfo);
    }

    setOrderChange(orderUpdate);
    return;
  }


  return (<div className={"w-96 m-auto p-4"}>


    <form>
      <div className="flex items-center justify-between gap-x-2">
        <div>
          <label className="font-semibold">Order Stage: </label>
          <select value={String(orderChange.stage)} onChange={(e) => handleStageChange(e.target.value)} className="border border-gray-200 py-1 px-2">
            <option value={String(0)} >{resolveOrderStage(0)}</option>
            <option value={String(1)}>{resolveOrderStage(1)}</option>
            <option value={String(2)}>{resolveOrderStage(2)}</option>
            <option value={String(3)}>{resolveOrderStage(3)}</option>
            <option value={String(4)}>{resolveOrderStage(4)}</option>
            <option value={String(97)}>{resolveOrderStage(97)}</option>
          </select>
        </div>
        <div>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center h-8" style={{ textAlign: "right" }}
            onClick={() => updateOrderStage(order?.id)}>
            Update
          </button>
        </div>
      </div>

      {(order.stage !== OrderStages.InProgress && orderChange.stage === OrderStages.InProgress) &&

        order.items?.map((transaction) => {
          return transaction.product.masterProductList &&
            <div key={transaction.id}>
              {transaction.product.masterProductList?.map((addon: any) => {
                return addon &&
                  <div key={addon?.id} >
                    <Input
                      label={addon?.masterProduct?.name}
                      onChange={(e) => { handleSerialNoInput(transaction.id, addon, e) }}
                    />
                  </div>
              })}
            </div>
        }
        )}
    </form>

  </div>)
}
