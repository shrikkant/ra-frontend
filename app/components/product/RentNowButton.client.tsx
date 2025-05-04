'use client'

import React from 'react'
// import { getDefaultSearch, setLastLink } from "../../../app-store/session/session.slice";
// import { useDispatch } from "react-redux";
// import { selectAuthState } from "../../../app-store/auth/auth.slice";
import {useRouter} from 'next/navigation'
import SignIn from '../../../components/user/SignIn'
// import { setCart } from "../../../app-store/user/orders/orders.slice";
// import { addToCart, fetchCart } from "../../../api/user/orders.api";

export default function RentNowButton({pathname}: {pathname: string}) {
  // const dispatch = useDispatch();
  const router = useRouter()

  // const loggedUser = useSelector(selectAuthState);
  const [showSignIn, setShowSignIn] = React.useState(false)
  // const storeSearch = useSelector(getDefaultSearch);

  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  const onBookNow = async () => {
    router.push(pathname)
    return
    /* Later
    if (!loggedUser && (pathname && pathname?.length > 0)) {
      dispatch(setLastLink(pathname))
      setShowSignIn(true);
    } else {
      if (!storeSearch?.dates)
        return;

      await addToCart(productId, storeSearch?.dates);
      const cart = await fetchCart();
      dispatch(setCart(cart));
      router.push("/p/mycart");

    }
    */
  }

  return (
    <>
      <button
        onClick={onBookNow}
        className="bg-[#ffd814] w-36 rounded-full text-[#0f1111] hover:bg-[#f7ca00] h-10"
      >
        Rent Now
      </button>
      {showSignIn && <SignIn onClose={closeSignInModal}></SignIn>}
    </>
  )
}
