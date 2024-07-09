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
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex gap-x-4">
                    <img
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      src={person.profile_pic}
                      alt=""
                    />
                    <div className="min-w-0 flex-auto">
                      <div className="text-sm font-semibold leading-6 text-gray-900">
                        {person.firstname + " " + person.lastname}
                      </div>
                      <div className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {person.email_address}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <div className="text-md leading-6 text-gray-900 flex">
                      <PhoneIcon style={{ width: "1.1rem" }}></PhoneIcon>
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
