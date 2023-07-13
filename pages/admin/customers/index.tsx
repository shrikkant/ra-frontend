
import {
	Button,
	Layout,
	Space,
	Tag,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";
import AppNav from "components/AppNav";
import { AppFooter } from "components/footer";
import AppHeader from "../../../components/header";

import { getCustomers, setCustomers } from "../../../app-store/admin/index.slice";

import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../../api/admin/customers.api";
import MyPageHeader from "../../../components/MyPageHeader";


import { IOrder, IUser } from "../../../app-store/types";
import { OrderItemRow } from "../../../components/OrderItemRow";
import Moment from 'moment';
import React, { useEffect } from "react";
import Table from "antd/lib/table/Table";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Loader from "../../../components/Loader";

const columns = [
	{
		title: 'Status',
		dataIndex: 'verified',
		key: 'verified',
		render: (val) => (val ? <CheckOutlined /> : "")
	},
	{
		title: 'Name',
		dataIndex: 'firstname',
		key: 'firstname',
		render: (text, record) => <a href={"/admin/customers/" + record.id} >
			{record.firstname + " " + record.lastname}
		</a>,
	},
	{
		title: 'Email',
		dataIndex: 'email_address',
		key: 'email_address',
	},
	{
		title: 'Phone',
		dataIndex: 'phone',
		key: 'phone',
	},
]

export default function Customers() {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const customers = useSelector(getCustomers);
	const dispatch = useDispatch();
	const df = Moment().format('DD MMM');

	const loadCustomers = () => {
		setLoading(true);
		fetchCustomers().then(data => {
			dispatch(setCustomers(data))
			setLoading(false);
		});
	}

	useEffect(() => {
		router.isReady && loadCustomers();

	}, [router.isReady])

	return (<>
		<AppHeader></AppHeader>
		<Content className="main-content">
			<AppNav></AppNav>

			<Content className={styles.content}>
				<MyPageHeader title={"Customers"} subtitle={""}></MyPageHeader>

				<Content style={{ padding: '16px 16px' }}>

					{loading ? <Loader /> : <Table columns={columns} dataSource={customers} rowKey={"id"} />}
				</Content>
			</Content>
		</Content>
		<AppFooter></AppFooter>
	</>)
}

