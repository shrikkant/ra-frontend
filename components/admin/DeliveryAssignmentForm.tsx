import React from "react";
// import { Button, Form, Select } from "antd"

import { useEffect, useState } from "react";
import { assignDeliveryRep, fetchOrderDelivery } from "../../api/admin/orders.api";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryReps, setActiveOrder, setDeliveryReps } from "../../app-store/admin/index.slice";
import { fetchDeliveryReps } from "../../api/admin/index.api";
import { IOrder, IUser } from "../../app-store/types";
import SelectField from "../common/form/SelectField";

enum DeliveryType {
  DELIVERY = 1,
  PICKUP = 2
}

export function DeliveryAssignmentForm({ order }: { order: IOrder }) {
  const dispatch = useDispatch();

  const [deliveyAssignment, setDeliveryAssignment] = useState({ repId: -1, orderId: order.id, type: DeliveryType.DELIVERY });
  // const [form] = Form.useForm();
  const deliveryReps = useSelector(getDeliveryReps);

  useEffect(() => {
    const newOrder = { ...order };
    if (order.delivery_id) {
      fetchOrderDelivery(order.delivery_id).then(data => {
        newOrder.delivery = data;
        dispatch(setActiveOrder(newOrder));
      });

      fetchDeliveryReps().then(data => {
        dispatch(setDeliveryReps(data));
      });

      setDeliveryAssignment({
        ...deliveyAssignment,
        orderId: order.id,
        repId: order?.delivery?.rep_id || 0
      });
    }
  }, [])

  const handleSubmit = () => {
    const newOrder = { ...order };

    assignDeliveryRep(deliveyAssignment).then(data => {
      newOrder.delivery = data;
      dispatch(setActiveOrder(newOrder));
    });
  }

  const handleRepChange = (value) => {
    setDeliveryAssignment({ ...deliveyAssignment, repId: value });
  }

  const repOptions = () => {
    const reps = deliveryReps?.map((rep: IUser) => {
      return { label: (rep.firstname + " " + rep.lastname), value: rep.id }
    })
    reps.push({ label: "Unassigned", value: 0 });
    return reps;
  }

  return (<div>
    {deliveryReps && <form
      style={{ border: "1px solid #ddd", padding: 10, borderRadius: 4 }}
    >

      <div className="flex">
        <SelectField defaultValue={deliveyAssignment.repId + ""} onChange={handleRepChange}
          choices={repOptions()}>
        </SelectField>
      </div>
      <div>
        <button onClick={handleSubmit} >Assign</button>
      </div>
    </form>}

  </div>)
}
