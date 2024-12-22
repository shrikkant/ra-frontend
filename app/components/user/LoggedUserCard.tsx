"use client"
import React, { useEffect } from "react";

import { FaAddressCard, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../app-store/auth/auth.slice";
import { Avatar } from "../../../components/user/Avatar";
import Loader from "../../../components/Loader";


export const LoggedUserCard = () => {
  const loggedUser = useSelector(selectAuthState);
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true)
  }, [])


  return (<>
    {isClient && (!loggedUser ?
      <Loader /> :
      <div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2  sm:p-6 ">
            <div className="items-center xs:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4 xs:gap-x-4 xs:items-start">
              <div>
                {loggedUser.profile_pic ? <img
                  className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                  src={loggedUser.profile_pic}
                  alt="Jese picture"
                /> :
                  <Avatar user={loggedUser} size="12"></Avatar>
                }
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                  {loggedUser.firstname + " " + loggedUser.lastname}
                </h3>
                {(loggedUser?.verified === 3) ?
                  <div className="flex items-center gap-x-1 pb-2">
                    <FaCheckCircle className="text-green-600" /> KYC Verified
                  </div> :
                  <div>
                    <Link href="/p/profile/verify" className="flex justify-center items-center gap-x-2 pb-2">
                      <FaAddressCard></FaAddressCard> Complete KYC Verification
                    </Link>
                  </div>}

                <div className="text-sm">
                  Profile ID : {loggedUser.id}
                </div>
                <div className="text-sm">
                  {loggedUser.email_address}
                </div>
                <div className="text-sm">
                  {loggedUser.phone}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>)
    }
  </>)

}
