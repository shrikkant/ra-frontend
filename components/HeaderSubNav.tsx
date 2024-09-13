import { useRouter } from "next/navigation";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React, { useEffect, useState } from "react";

import { Disclosure } from "@headlessui/react";

import { useCategories } from "../hooks/useCategories";

import { IDefaultSearch } from "../app-store/app-defaults/types";
import { useSelector } from "react-redux";
import { getDefaultSearch } from "../app-store/session/session.slice";
import { IProductSubCategory } from "../app-store/types";

export default function HeaderSubNav() {
  const router = useRouter();
  const storeSearch: any = useSelector<IDefaultSearch>(getDefaultSearch);
  const { categories } = useCategories();

  const [subCategories, setSubCategories] = useState<IProductSubCategory[]>();

  const onCategorySelect = (key, querySlug) => {
    const { location } = storeSearch;
    const city = location?.city || "pune";

    if (!location)
      return;

    router.push("/rent/" + city.toLowerCase() + "/" + querySlug);
  };

  useEffect(() => {
    const hiddenCategories: number[] = [59, 60, 62, 48, 32, 50, 30];

    if (categories) {
      const subCategories: IProductSubCategory[] = categories[0].subCategories ? categories[0]?.subCategories
        ?.filter((sc: IProductSubCategory) => {
          return sc.id && !hiddenCategories.includes(sc.id);
        }) : [];

      setSubCategories(subCategories);
    }
  }, [storeSearch, categories]);

  return (
    <Disclosure as="nav" className="bg-gray-700 ">
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row h-22 items-center justify-around border-gray-400">
          <div className="relative justify-center w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 items-center sm:gap-x-6 flex overscroll-contain w-full overflow-x-auto relative">
              {subCategories &&
                subCategories
                  .map((cat: IProductSubCategory) => {
                    return (
                      <Disclosure.Button
                        key={cat.id}
                        onClick={() => onCategorySelect(cat.id, cat.slug)}
                        className={
                          "whitespace-nowrap text-sm inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none"
                        }
                      >
                        <span className="sr-only">Open Menu</span>
                        {cat.title}
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
