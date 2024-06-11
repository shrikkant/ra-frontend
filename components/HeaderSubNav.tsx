import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React, { useEffect, useState } from "react";

import { Disclosure } from "@headlessui/react";

import { useCategories } from "../hooks/useCategories";
import { getDefaultSearch } from "../app-store/session/session.slice";
import { useLocalStorage } from "../util/localStore.util";

export default function HeaderSubNav() {
  const router = useRouter();
  const storeSearch = useSelector(getDefaultSearch);

  const [location, setLocation] = useState(null);


  const [q, setQuery] = useState(router.query?.q);
  const { categories } = useCategories();

  const [subCategories, setSubCategories] = useState([]);

  const onCategorySelect = (key, querySlug) => {
    const { slug } = router.query;
    const query: any = {};
    router.push({
      pathname: "/" + location.city.toLowerCase() + "/" + querySlug,
      query,
    });
  };

  useEffect(() => {
    if (categories) {
      const subCategories = categories[0]?.subCategories?.map((sc) => ({
        label: sc.title,
        key: sc.id,
        slug: sc.slug,
      }));
      setSubCategories(subCategories);
    }
  }, [storeSearch, categories]);

  return (
    <Disclosure as="nav" className="bg-gray-700 ">
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row h-22 items-center justify-around border-gray-400">
          <div className="relative justify-center w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 items-center gap-x-6 flex overscroll-contain w-full overflow-x-auto relative">
              {subCategories &&
                subCategories.map((cat) => {
                  return (
                    <Disclosure.Button
                      key={cat.key}
                      onClick={() => onCategorySelect(cat.key, cat.slug)}
                      className={
                        "whitespace-nowrap text-sm inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none"
                      }
                    >
                      <span className="sr-only">Open Menu</span>
                      {cat.label}
                    </Disclosure.Button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
