import React from "react";
import { useSelector } from "react-redux";

import { selectAuthState } from "app-store/auth/auth.slice";
import { AppLayout } from "components/AppLayout";
import MyPageHeader from "components/MyPageHeader";
import {
  FaAddressCard,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import { Avatar } from "../../../components/user/Avatar";

export default function MyProfile() {

  const loggedUser = useSelector(selectAuthState);

  return (
    <AppLayout>
      <MyPageHeader title={"My Profile"} subtitle={""}></MyPageHeader>
      {loggedUser && (
        <div className="p-4">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2  sm:p-6 ">
              <div className="items-center xs:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4 xs:gap-x-4 xs:items-start">
                <div>
                  {loggedUser.profile_pic ? <img
                    className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                    src={loggedUser.profile_pic}
                    alt="Jese picture"
                  /> :
                    <Avatar user={loggedUser}></Avatar>
                  }
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                    {loggedUser.firstname + " " + loggedUser.lastname}
                  </h3>
                  {(loggedUser?.verified === 3) ?
                    <div className="flex items-center gap-x-1 pb-2">
                      <FaCheckCircle className="text-green-600" /> Aadhaar Verified
                    </div> :
                    <div>
                      <Link href="/portal/profile/verify" className="flex justify-center items-center gap-x-2 pb-2">
                        <FaAddressCard></FaAddressCard> Complete KYC Verification
                      </Link>
                    </div>}

                  <div className="mb-4 text-sm text-gray-500  flex items-center gap-x-1">

                    <div>
                      {loggedUser.email_address}
                    </div>

                  </div>
                  <div className="mb-4 text-sm text-gray-500  flex items-center gap-x-1">

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
