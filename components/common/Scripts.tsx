'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getLastLink, setLastLink, } from "../../app-store/session/session.slice";

export default function Scripts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const lastLink = useSelector(getLastLink)

  useEffect(() => {
    const link = lastLink;

    if (link) {
      dispatch(setLastLink(""));
      router.push(link);
      return;
    } else {
      document.body.classList.add('animated-page');
      document.body.classList.add('page-loaded');
    }
  });

  return (<></>)
}
