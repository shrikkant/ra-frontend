'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useLocalStorage } from "../../util/localStore.util";

export default function Scripts() {

  const router = useRouter();
  const [lastLink, setLastLink] = useLocalStorage<string | null>("lastLink");

  useEffect(() => {
    const link = lastLink;

    if (link) {
      setLastLink(null);
      router.push(link);
      return;
    } else {
      document.body.classList.add('animated-page');
      document.body.classList.add('page-loaded');
    }
  });

  return (<></>)
}
