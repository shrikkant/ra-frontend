import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React, { useEffect, useState } from "react";

import { Disclosure } from "@headlessui/react";

import { fetchProductCategories } from "../api/products.api";
import {
  getCategories,
  setCategories,
} from "../app-store/app-defaults/app-defaults.slice";

export default function HeaderSubNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [q, setQuery] = useState(router.query?.q);
  const categories = useSelector(getCategories);

  const subCategories = categories
    ? categories[0].subCategories?.map((sc) => ({
        label: sc.title,
        key: sc.id,
      }))
    : [];

  const onCategorySelect = (key) => {
    const query: any = {};
    query.scid = key;
    router.push({
      pathname: "/rent",
      query,
    });
  };

  const searchProducts = () => {
    router.push("/rent?q=" + q);
  };
  const onSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    if (!categories || categories.length <= 0) {
      fetchProductCategories().then((data) => dispatch(setCategories(data)));
    }
  }, [router.isReady]);

  return (
    <Disclosure as="nav" className="bg-gray-700">
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row h-22 sm:h-22 items-center justify-around border-gray-400">
          <div className="justify-center w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 flex items-center gap-x-6 ">
              {subCategories &&
                subCategories.map((cat) => {
                  return (
                    <Disclosure.Button
                      key={cat.key}
                      onClick={() => onCategorySelect(cat.key)}
                      className={
                        "inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none"
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
