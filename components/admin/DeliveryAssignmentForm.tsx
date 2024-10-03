import React from "react";
import { Button, Form, Select } from "antd"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { assignDeliveryRep, fetchOrderDelivery } from "../../api/admin/orders.api";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryReps, setActiveOrder, setDeliveryReps } from "../../app-store/admin/index.slice";
import { fetchDeliveryReps } from "../../api/admin/index.api";
import { IOrder, IUser } from "../../app-store/types";

enum DeliveryType {
  DELIVERY = 1,
  PICKUP = 2
}

export function DeliveryAssignmentForm({ order }: { order: IOrder }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const [deliveyAssignment, setDeliveryAssignment] = useState({ repId: -1, orderId: order.id, type: DeliveryType.DELIVERY });
  const [form] = Form.useForm();
  const deliveryReps = useSelector(getDeliveryReps);


  useEffect(() => {
    const newOrder = { ...order };
    (order.delivery_id && !order.delivery) && fetchOrderDelivery(order.delivery_id).then(data => {
      newOrder.delivery = data;
      dispatch(setActiveOrder(newOrder));
    });
  }, [router.isReady])

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

  useEffect(() => {
    fetchDeliveryReps().then(data => {
      dispatch(setDeliveryReps(data));
    });

    router.isReady && setDeliveryAssignment({
      ...deliveyAssignment,
      orderId: order.id,
      repId: order?.delivery?.rep_id || 0
    });


  }, [router.isReady])


  return (<div>
    {deliveryReps && <Form
      layout={"inline"}
      form={form}
      size="small"
      initialValues={{ layout: "inline" }}
      style={{ border: "1px solid #ddd", padding: 10, borderRadius: 4 }}
    >

      <div className="flex">
        <Select style={{ width: 160 }} defaultValue={deliveyAssignment.repId} value={deliveyAssignment.repId} onChange={handleRepChange}
          options={repOptions()}>
        </Select>
      </div>
      <div>
        <Button onClick={handleSubmit} type="link">Assign</Button>
      </div>
    </Form>}

  </div>)
}
