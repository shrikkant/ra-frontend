import {
  AppstoreOutlined,
  BankOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DeliveredProcedureOutlined,
  GlobalOutlined,
  GoogleOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
  SmileOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import { Button, Card, MenuProps, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "../app-store/auth/auth.slice";
import {
  ArrowDownOnSquareIcon,
  ArrowLeftCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import NavMenu from "components/NavMenu";
import { ro } from "date-fns/locale";

let items = [
  { label: "Cart", key: "/my-cart", icon: <ShoppingCartIcon /> },
  { label: "Orders", key: "/orders", icon: <CreditCardOutlined /> },

  { label: "Refer & Earn", key: "/refer-earn", icon: <UsergroupAddOutlined /> },
  {
    label: "Owner",
    key: "/submenu",
    children: [
      {
        label: "Rent Requests",
        key: "/rent-requests",
        icon: <UserSwitchOutlined />,
      },
      {
        label: "My Products",
        key: "/my-products",
        icon: <DeliveredProcedureOutlined />,
      },
      {
        label: "List Gear",
        key: "/list-gear",
        icon: <UnorderedListOutlined />,
      },
      {
        label: "Booking Calendar",
        key: "/booking-calendar",
        icon: <CalendarOutlined />,
      },
    ],
  },
  {
    label: "Profile",
    key: "/profile-menu",
    children: [
      { label: "My Profile", key: "/profile/", icon: <UserOutlined /> },
      {
        label: "Address Book",
        key: "/profile/address-book",
        icon: <GlobalOutlined />,
      },
      {
        label: "Bank Info",
        key: "/profile/bank-details",
        icon: <BankOutlined />,
      },
    ],
  },
];

const adminRoutes = {
  label: "Admin",
  key: "/admin",
  children: [
    { label: "Customers", key: "/admin/customers", icon: <UserOutlined /> },
    {
      label: "Manage Orders",
      key: "/admin/orders?stage=1",
      icon: <GlobalOutlined />,
    },
    { label: "Brands", key: "/admin/brands", icon: <GlobalOutlined /> },
  ],
};



export default function AppNav() {
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

  const onClick: MenuProps["onClick"] = (e) => {
    activateMenu(e);
    router.push(e.key);
  };

  useEffect(() => {
    currentActiveMenu();
  }, [router.isReady])


  return (
    <div className="admin-sidebar">
      <div className="content">
        <div className="brand">
          <img src="/assets/img/logo.png" alt="RentAcross" />
        </div>
        <nav>
          <ul>
            <li>
              <NavMenu onClick={onClick} items={activeItems}></NavMenu>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
