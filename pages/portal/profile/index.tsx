import React from "react";
import { useSelector } from "react-redux";

import { selectAuthState } from "app-store/auth/auth.slice";
import { AppLayout } from "components/AppLayout";
import MyPageHeader from "components/MyPageHeader";
import { PhoneIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { FaAddressBook, FaPhone } from "react-icons/fa";

export default function MyProfile() {

  const loggedUser = useSelector(selectAuthState);

  return (
    <AppLayout>
      <MyPageHeader title={"User Details"} subtitle={""}></MyPageHeader>
      {loggedUser && (
        <div className="p-8">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <img
                  className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                  src={loggedUser.profile_pic}
                  alt="Jese picture"
                />
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                    {loggedUser.firstname + " " + loggedUser.lastname}
                  </h3>
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-x-1">
                    <div>
                      <FaAddressBook />
                    </div>
                    <div>
                      {loggedUser.email_address}
                    </div>

                  </div>
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-x-1">
                    <div>
                      <FaPhone />
                    </div>
                    <div>
                      {loggedUser.phone}
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
