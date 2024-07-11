"use client"
import React, { Fragment } from "react";
import { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../app-store/auth/auth.slice";
import {
  BuildingLibraryIcon,
  CameraIcon,
  MapPinIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NavMenu from "components/NavMenu";
import { Transition } from "@headlessui/react";
import clsx from 'clsx'

const items = [
  {
    label: "Orders",
    key: "/orders",
    icon: <ShoppingBagIcon className="h-6 w-6" />,
  },
  {
    label: "Owner",
    key: "/submenu",
    children: [
      {
        label: "My Products",
        key: "/my-products",
        icon: <CameraIcon className="h-6 w-6" />,
      },
    ],
  },
  {
    label: "Profile",
    key: "/profile-menu",
    children: [
      {
        label: "My Profile",
        key: "/profile/",
        icon: <UserIcon className="h-6 w-6" />,
      },
      {
        label: "Address Book",
        key: "/profile/address-book",
        icon: <MapPinIcon className="h-6 w-6" />,
      },
      {
        label: "Bank Info",
        key: "/profile/bank-details",
        icon: <BuildingLibraryIcon className="h-6 w-6" />,
      },
    ],
  },
];

const adminRoutes = {
  label: "Admin",
  key: "/admin",
  children: [
    {
      label: "Customers",
      key: "/admin/customers",
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      label: "Manage Orders",
      key: "/admin/orders?stage=1",
      icon: <ShoppingBagIcon className="h-6 w-6" />,
    },
    {
      label: "Brands",
      key: "/admin/brands",
      icon: <TagIcon className="h-6 w-6" />,
    },
  ],
};

export default function AppNav({ navState, toggleNavState }) {
  const router = useRouter();
  const loggedUser = useSelector(selectAuthState);
  const activeItems = [...items];
  if (loggedUser?.role === "A") {
    activeItems.push(adminRoutes);
  }

  const activateMenu = (i) => {
    activeItems.forEach((item: any) => {
      item?.children?.forEach((child: any) => {
        if (child.key === i.key) {
          child.active = true;
          console.log(" Active Child : ", child);
        } else {
          child.active = false;
        }
      });

      if (item.key === i.key) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  };

  const currentActiveMenu = () => {
    if (router.pathname !== "/") {
      activeItems.forEach((item: any) => {
        item?.children?.forEach((child: any) => {
          if (child.key.startsWith(router.pathname)) {
            child.active = true;
            console.log(" Active Child : ", child);
          } else {
            child.active = false;
          }
        });

        if (item.key.startsWith(router.pathname)) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    activateMenu(e);
    router.push(e.key);
  };

  useEffect(() => {
    currentActiveMenu();
  }, [router.isReady]);

  return (
    <Transition
      as={Fragment}
      show={navState}
    >

      <aside
        id="default-sidebar"
        className={clsx([
          // Base styles
          'absolute border transition ease-in-out w-full z-[211] flex h-full',
          // Shared closed styles
          'data-[closed]:opacity-0',
          // Entering styles
          'data-[enter]:duration-1000 data-[enter]:data-[closed]:-translate-x-full',
          // Leaving styles
          'data-[leave]:duration-1000 data-[leave]:data-[closed]:translate-x-full',
        ])}
        aria-label="Sidebar"
      >
        <div className="px-5 bg-gray-900 w-3/4 sm:w-72">
          <div className="my-3 hidden sm:block">
            <img src="/assets/v2/img/logo.png" alt="RentAcross" />
          </div>

          <nav className="my-5">
            <ul>
              <li>
                <NavMenu onClick={onClick} items={activeItems}></NavMenu>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <div
            className={
              (navState ? " flex " : "sm:hidden ") +
              " cursor-pointer flex justify-end py-5 sm:bg-gray-900  sm:bg-opacity-90  text-white border-b-gray-400 p-4"
            }
          >
            <XMarkIcon
              className="h-6 w-6 sm:w-8 sm:h-8"
              onClick={toggleNavState}
            />
          </div>
        </div>
      </aside>

    </Transition>
  );
}
