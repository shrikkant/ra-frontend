"use client"
// import {
//   Input,
//   Form
// } from "antd";
import Moment from "moment";

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
import { Section } from "../app/components/common/Section";
import Input from "./common/form/Input";



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
    fetchCustomerAadhaar(customer.id).then((data: IAadhaar) => {
      setCustomerAadhaar(data);
    });
  }, [customerAadhaar]);

  return (<div>


    <Section title={customer.firstname + " " + customer.lastname}>
      <div className="px-4">
        {customerAadhaar?.profile_image &&
          <div className="   shadow-md w-[320px] rounded-md my-4 border">
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
          </div>
        }

        <form className="py-4 flex flex-col gap-y-4">
          <div>
            <Input placeholder="Email" value={customer.email_address} onChange={() => { }} />
          </div>
          <div>
            <Input placeholder="Phone" value={customer.phone} onChange={() => { }} />
          </div>
        </form>
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
    </Section>
  </div>
  );
}


