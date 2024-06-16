'use client'
import { useEffect } from "react"

export default function Scripts() {
  useEffect(() => {
    document.body.classList.add('animated-page');
    document.body.classList.add('page-loaded');
  });

  return(<></>)
}
