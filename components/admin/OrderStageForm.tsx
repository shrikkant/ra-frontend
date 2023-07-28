import { Button, Card, Descriptions, Divider, Form, Input, Select, Tooltip } from "antd"
import { OrderStages, resolveOrderStage } from "../../util/global.util"
import { fetchOrder, updateStage } from "api/admin/orders.api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveOrder } from "app-store/admin/index.slice";
import { UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";

type LayoutType = Parameters<typeof Form>[0]['layout'];

export function OrderStageForm({ order }) {
  const dispatch = useDispatch();
  const [orderChange, setOrderChange] = useState({ serialNoInfo: [], stage: 0, id: 0 });
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');
  const [formReady, setFormReady] = useState(true);

  const [form] = Form.useForm();

  const formItemLayout =
    formLayout === 'horizontal' ? { labelCol: { span: 6 }, wrapperCol: { span: 18 } } : null;


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

  const handleSerialNoInput = async (transactionId, addon, e) => {
    const value = e.target.value;
    const orderUpdate = { ...orderChange };

    const alreadyExists = await orderUpdate.serialNoInfo.find((item) => (item.id == transactionId));

    const transactionInfo = await orderUpdate.serialNoInfo.find((item) => (item.id == transactionId)) || {};

    if (alreadyExists) {
      let serialInfo: any = transactionInfo.serial_no_json.find((item) => (item.id == addon.id));
      if (serialInfo) {
        serialInfo.serial_no = value;
      } else {
        serialInfo = {};

        serialInfo.id = addon.id;
        serialInfo.productId = addon.masterProduct.id;
        serialInfo.name = addon.masterProduct.name;
        serialInfo.serial_no = value;
        transactionInfo.serial_no_json.push(serialInfo);
      }
    } else {

      transactionInfo.id = transactionId;
      transactionInfo.serial_no_json = [];
      const serialInfo: any = {};

      serialInfo.id = addon.id;
      serialInfo.productId = addon.masterProduct.id;
      serialInfo.name = addon.masterProduct.name;
      serialInfo.serial_no = value;
      transactionInfo.serial_no_json.push(serialInfo);
      orderUpdate.serialNoInfo.push(transactionInfo);
    }

    setOrderChange(orderUpdate);
    return;
  }


  return (<Card
    actions={[<div style={{ width: "100%", textAlign: "right" }}>
      <Button style={{ textAlign: "right" }}
        disabled={!formReady} type="primary"
        onClick={() => updateOrderStage(order.id)}
        size="small">
        Update Stage
      </Button>
    </div>]}
    style={{ padding: 16, maxWidth: 520, margin: "auto" }} title={"Update Stage"} bordered={false}>

    <Form
      {...formItemLayout}
      layout={formLayout}
      form={form}
      initialValues={{ layout: formLayout }}
      style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
    >
      <Form.Item label={"Stage"}>
        <Select value={String(orderChange.stage)} onChange={handleStageChange}>
          <Select.Option value={String(0)} >{resolveOrderStage(0)}</Select.Option>
          <Select.Option value={String(1)}>{resolveOrderStage(1)}</Select.Option>
          <Select.Option value={String(2)}>{resolveOrderStage(2)}</Select.Option>
          <Select.Option value={String(3)}>{resolveOrderStage(3)}</Select.Option>
        </Select>
      </Form.Item>

      {(order.stage !== OrderStages.InProgress && orderChange.stage === OrderStages.InProgress) &&

        order.items?.map((transaction) => {
          return transaction.product.masterProductList.length > 0 &&
            <div key={transaction.id}>

              {/* <Descriptions.Item>
                <div>{transaction.product.title}</div>
              </Descriptions.Item> */}
              {transaction.product.masterProductList.map((addon: any) => {
                return addon &&
                  <Form.Item key={addon?.id} label={"Serial #"}>

                    <Input
                      placeholder={addon?.masterProduct?.name}
                      prefix={<UserCircleIcon className="site-form-item-icon" />}
                      onKeyDownCapture={(e) => { handleSerialNoInput(transaction.id, addon, e) }}
                      suffix={
                        <Tooltip title="Serial #">
                          <UserGroupIcon style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                      }
                    />
                    <label style={{ fontSize: 12 }}>{addon?.masterProduct?.name}</label>
                  </Form.Item>
              })}
            </div>
        }
        )}
    </Form>

  </Card>)
}
