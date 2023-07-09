
import {
	Button,
	Layout,
	Space,
	Tabs,
	Tag,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";
import AppNav from "components/AppNav";
import { AppFooter } from "components/footer";
import AppHeader from "components/header";

import { getOrders, setOrders } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";


import { IOrder } from "app-store/types";
import { OrderItemRow } from "components/OrderItemRow";
import Moment from 'moment';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { AdminOrderItemRow } from "../../../components/admin/AdminOrderItemRow";
import Modal from "antd";
import { resolveOrderStage } from "../../../util/global.util";



export default function Orders() {
	const router = useRouter();
	const orders = useSelector(getOrders);
	const [activeKey, setActiveKey] = useState<number>(1);

	const [stageChangeModal, setStageChangeModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [modalText, setModalText] = useState('Content of the modal');

	const { stage } = router.query;

	const dispatch = useDispatch();
	const df = Moment().format('DD MMM');

	const loadOrders = () => {
		const loadStage = parseInt(String(stage));

		fetchOrders(loadStage).then(data => {
			dispatch(setOrders(data))
		})
	}

	useEffect(() => {
		setActiveKey(parseInt(String(stage)));
		router.isReady && loadOrders();
	}, [activeKey, stage, router.isReady])

	const tabChanged = (key: string) => {
		console.log("Tab Changed", key);
		router.push(`/admin/orders?stage=${key}`);
	}

	const orderDuration = (start: Date, end: Date) => {
		return Moment(start).utcOffset(0).format('DD MMM hh A') + " - " + Moment(end).utcOffset(0).format('DD MMM hh A');
	}

	return (<Content>
		<AppHeader></AppHeader>
		<Content className="main-content">
			<AppNav></AppNav>
			<Content className={styles.content}>

				<MyPageHeader title={"Orders"} subtitle={""}></MyPageHeader>

				<Content style={{ padding: '16px 16px' }}>
					<Tabs
						defaultActiveKey="1"
						activeKey={String(activeKey)}
						type="card"
						size="small"
						onChange={tabChanged}
						items={[0, 1, 3].map((tab, i) => {
							const id = String(i);
							return {
								label: `${resolveOrderStage(tab)}`,
								key: id,
								children:
									<Space size={[10, 20]} direction="vertical">


										{orders && orders.map((order: IOrder) => {
											let items: JSX.Element[] = [];

											items.push(<PageHeader
												className={styles.orderHeader}
												key={order.id}
												ghost={false}
												tags={[<Tag key="1" color="red">{"₹" + order.amount}</Tag>,
												<Tag key="2" color="purple">{order.user.firstname}</Tag>]}
												title={"#" + order.id}
												subTitle={orderDuration(order.start_date, order.end_date)}
												extra={[
													<Button key="1" type="primary" onClick={() => { router.push("/admin/orders/" + order.id) }}>
														Stage
													</Button>,
												]}></PageHeader>);


											order.items && order.items.map((item) => {
												items.push(
													<AdminOrderItemRow key={item.id} orderItem={item} />
												)
											})

											return (<Content className={styles.orderBox} key={order.id}>{items}</Content>)
										})}
									</Space>
								,
							};
						})}
					/>



				</Content>
			</Content>



		</Content>


		<AppFooter></AppFooter>
	</Content>)
}

