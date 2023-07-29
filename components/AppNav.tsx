import { Button, Card, MenuProps, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "../app-store/auth/auth.slice";
import {
  BuildingLibraryIcon,
  CameraIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NavMenu from "components/NavMenu";
import { ro } from "date-fns/locale";

let items = [
  { label: "Cart", key: "/my-cart", icon: <ShoppingCartIcon className="h-6 w-6"/> },
  { label: "Orders", key: "/orders", icon: <ShoppingBagIcon className="h-6 w-6" /> },

  // { label: "Refer & Earn", key: "/refer-earn", icon: <ArrowsRightLeftIcon className="h-6 w-6" /> },
  {
    label: "Owner",
    key: "/submenu",
    children: [
      // {
      //   label: "Rent Requests",
      //   key: "/rent-requests",
      //   icon: <NewspaperIcon className="h-6 w-6" />,
      // },
      {
        label: "My Products",
        key: "/my-products",
        icon: <CameraIcon className="h-6 w-6" />,
      },
      // {
      //   label: "List Gear",
      //   key: "/list-gear",
      //   icon: <QueueListIcon className="h-6 w-6" />,
      // },
      // {
      //   label: "Booking Calendar",
      //   key: "/booking-calendar",
      //   icon: <CalendarDaysIcon className="h-6 w-6" />,
      // },
    ],
  },
  {
    label: "Profile",
    key: "/profile-menu",
    children: [
      { label: "My Profile", key: "/profile/", icon: <UserIcon className="h-6 w-6" /> },
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
    { label: "Customers", key: "/admin/customers", icon: <UsersIcon className="h-6 w-6" /> },
    {
      label: "Manage Orders",
      key: "/admin/orders?stage=1",
      icon: <ShoppingBagIcon className="h-6 w-6" />,
    },
    { label: "Brands", key: "/admin/brands", icon: <TagIcon className="h-6 w-6"/> },
  ],
};



export default function AppNav({navState, toggleNavState}) {
  const router = useRouter();
  const loggedUser = useSelector(selectAuthState);
  let activeItems = [...items];
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
  }

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
  }

  const onClick: MenuProps["onClick"] = (e) => {
    activateMenu(e);
    router.push(e.key);
  };

  useEffect(() => {
    currentActiveMenu();
  }, [router.isReady])


  return (
    <aside id="default-sidebar" className={"flex h-screen fixed sm:relative z-40 transition-transform sm:translate-x-0 " + (navState ? "translate-x-0" : "hidden -translate-x-full")} aria-label="Sidebar">
      <div className="px-5 bg-gray-900">
        <div className="my-3 hidden sm:block">
          <img src="/assets/img/logo.png" alt="RentAcross" />
        </div>
        <div className="sm:hidden flex justify-end py-5  text-gray-400 border-b-gray-400 border-b">
            <XMarkIcon className="h-6 w-6" onClick={toggleNavState}/>
        </div>
        <nav className="my-5">
          <ul>
            <li>
              <NavMenu onClick={onClick} items={activeItems}></NavMenu>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
