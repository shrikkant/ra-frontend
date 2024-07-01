import { Button, Form, Select } from "antd"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { assignDeliveryRep } from "../../api/admin/orders.api";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryReps, setDeliveryReps } from "../../app-store/admin/index.slice";
import { fetchDeliveryReps } from "../../api/admin/index.api";
import { IUser } from "../../app-store/types";

enum DeliveryType {
  DELIVERY = 1,
  PICKUP = 2
}

export function DeliveryAssignmentForm({ order }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const [deliveyAssignment, setDeliveryAssignment] = useState({ repId: -1, orderId: 0, type: DeliveryType.DELIVERY });
  const [form] = Form.useForm();
  const deliveryReps = useSelector(getDeliveryReps);


  const handleSubmit = () => {

    assignDeliveryRep(deliveyAssignment).then(data => {
      console.log("Delivery assignment is ", data);
    });
  }

  const handleRepChange = (value) => {
    setDeliveryAssignment({ ...deliveyAssignment, repId: value });
  }

  const repOptions = () => {
    return deliveryReps?.map((rep: IUser) => {
      return { label: (rep.firstname + " " + rep.lastname), value: rep.id }
    })
  }

  useEffect(() => {
    fetchDeliveryReps().then(data => {
      dispatch(setDeliveryReps(data));
    });

    router.isReady && setDeliveryAssignment({
      ...deliveyAssignment,
      orderId: order.id,
      repId: order?.delivery?.rep_id
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

      <Form.Item label={"Delivery Rep"}>
        <Select style={{ width: 160 }} defaultValue={deliveyAssignment.repId} value={deliveyAssignment.repId} onChange={handleRepChange}
          options={repOptions()}>
        </Select>
      </Form.Item>
      <Form.Item style={{ textAlign: "right" }} >
        <Button onClick={handleSubmit} type="link">Assign</Button>
      </Form.Item>
    </Form>}

  </div>)
}
