import {
  getCustomers,
  setCustomers,
} from "app-store/admin/index.slice";

import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "api/admin/customers.api";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "components/Loader";
import { Time } from "components/Time";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { AppLayout } from "components/AppLayout";
import { FaWhatsappSquare } from "react-icons/fa";
import Link from "next/link";

export default function Customers() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const customers = useSelector(getCustomers);
  const dispatch = useDispatch();

  const loadCustomers = () => {
    setLoading(true);
    fetchCustomers().then((data) => {
      dispatch(setCustomers(data));
      setLoading(false);
    });
  };

  const visitProfile = (id) => {
    router.push("/portal/admin/customers/" + id);
  }

  useEffect(() => {
    router.isReady && loadCustomers();
  }, [router.isReady]);

  return (
    <AppLayout>
      <MyPageHeader title={"Customers"} subtitle={""}></MyPageHeader>

      <div style={{ padding: "16px 16px" }}>
        {loading ? (
          <Loader />
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {customers &&
              customers.map((person) => (
                <li
                  key={person.email_address}
                  className="flex justify-between gap-x-6 py-5 items-center"
                >
                  <div className="flex gap-x-4 xs:w-full sm:w-72">
                    <div className="min-w-0 flex-auto xs:w-full">

                      <div className="flex items-center w-full justify-between">
                        <div onClick={() => visitProfile(person.id)} className="cursor-pointer flex gap-x-2">
                          <img
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={person.profile_pic}
                            alt=""
                          />
                          <div className="w-56">
                            <div className="text-sm font-semibold leading-6 text-gray-900">
                              {person.firstname + " " + person.lastname}
                            </div>
                            <div className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {person.email_address}
                            </div>
                          </div>
                        </div>


                        <div className="align-center">
                          <Link target="_blank" href={`https://wa.me/91${person.phone}?text=Hi ${person.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}>
                            <FaWhatsappSquare size={"36"} />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <div className="text-md leading-6 text-gray-900 flex gap-x-1">
                      <PhoneIcon style={{ width: "1.1rem" }} />
                      <div>{person.phone}</div>
                    </div>

                    <div className="mt-1 text-xs leading-5 text-gray-500">
                      <Time time={person.created_ts} />
                    </div>
                  </div>

                </li>
              ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
