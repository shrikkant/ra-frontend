'use client'
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getLastLink, setLastLink, } from "../../app-store/session/session.slice";
import { selectAuthState } from "../../app-store/auth/auth.slice";

export default function Scripts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const lastLink = useSelector(getLastLink);
  const loggedUser = useSelector(selectAuthState);
  useEffect(() => {
    const link = lastLink;
    if (loggedUser && loggedUser.verified) {
      if (link === pathname) {
        dispatch(setLastLink(""));
      }
      if (link && link.length > 0) {
        router.push(link);
        return;
      }
    }


    document.body.classList.add('animated-page');
    document.body.classList.add('page-loaded');

  }, [lastLink, loggedUser, pathname]);

  return (<>
  </>)
}
