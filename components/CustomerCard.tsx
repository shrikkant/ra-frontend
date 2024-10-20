"use client"
import {
  Input,
  Tag,
  Form
} from "antd";
import Moment from "moment";
import { PageHeader } from "@ant-design/pro-layout";
import styles from "styles/orders.module.css";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";

import { IUser } from "../app-store/types";
import { FaCheckCircle, FaSignInAlt, FaWhatsappSquare } from "react-icons/fa";
import Link from "next/link";
import { authUser, logout, setAdminLogin } from "../app-store/auth/auth.slice";
import { getAdminAuthUser } from "../api/auth.api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchCustomerAadhaar } from "../api/admin/customers.api";
import { IAadhaar } from "../app-store/auth/types";


export default function CustomerCard({ customer }: { customer: IUser }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [customerAadhaar, setCustomerAadhaar] = React.useState<IAadhaar>();

  const adminLogin = (customerId: number) => {
    dispatch(logout());
    getAdminAuthUser(customerId).then((loggedUser) => {
      dispatch(authUser(loggedUser));
      dispatch(setAdminLogin(true));
      router.push("/");
    });
  }


  useEffect(() => {
    !customerAadhaar && fetchCustomerAadhaar(customer.id).then((data: IAadhaar) => {
      data.aadhaar_number && setCustomerAadhaar(data);
    });
  }, [customerAadhaar]);

  return (<Content className={styles.orderBox} key={customer.id}>

    <PageHeader
      className="border-b border-gray-200 bg-gray-100"
      key={customer.id}
      ghost={false}
      tags={[<Tag key="1" className="bg-transparent border-none flex justify-center"><FaCheckCircle className="text-green-600 bg-none" size={"20"} /></Tag>]}
      title={customer.firstname + " " + customer?.lastname}>

    </PageHeader>


    <div className="px-4">
      {customerAadhaar && <div className="   shadow-md w-[320px] rounded-md my-4 border">
        <div className="flex gap-x-2">
          <div className="rounded-tl-md border">
            <img src={`data:image/png;base64,${customerAadhaar.profile_image}`}></img>
          </div>
          <div className="flex flex-col gap-y-4 w-96 py-4 " >
            <div>
              <p className="font-bold">{customerAadhaar.full_name}</p>
              <p>{Moment(customerAadhaar.dob).format("D MMM YYYY")}</p>
              <p>{customer.phone}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          {Object.values(customerAadhaar.address).join(", ")}
        </div>
      </div>}

      <Form layout="vertical" className="my-4">
        <Form.Item>
          <Input placeholder="Email" value={customer.email_address} />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Phone" value={customer.phone} />
        </Form.Item>
      </Form>
      <div className=" flex justify-end items-center gap-x-2">
        {customer?.verified === 3 &&
          <div>
            <FaCheckCircle className="text-green-600" size={"28"} />
          </div>}

        {customer?.phone &&
          <Link
            target="_blank"
            href={`https://wa.me/91${customer.phone}?text=Hi ${customer.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}>
            <FaWhatsappSquare size={"28"} />
          </Link>}

        <button onClick={() => adminLogin(customer.id)} className="p-2">
          <FaSignInAlt size={"28"} />
        </button>
      </div>
    </div>
  </Content >);
}


