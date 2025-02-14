"use client"
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../app-store/auth/auth.slice";
import Loader from "../../../components/Loader";
import { ProfileCard } from "./ProfileCard.client";
import AddressListCard from "./AddressListCard";
import { IUser } from "../../../app-store/types";


export const LoggedUserCard = () => {
  const loggedUser = useSelector(selectAuthState);
  const [isClient, setIsClient] = React.useState(false);
  const isAdmin = (user: IUser) => {
    return user?.role === 'A';
  }

  useEffect(() => {
    setIsClient(true)
  }, [])


  return (<>
    {isClient && (!loggedUser ?
      <Loader /> :
      <div>
        <ProfileCard user={loggedUser} />

        {isAdmin(loggedUser) && <AddressListCard></AddressListCard>}
      </div>)
    }
  </>)

}
