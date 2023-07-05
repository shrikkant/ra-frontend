import { AppstoreOutlined, BankOutlined, CalendarOutlined, CreditCardOutlined, DeliveredProcedureOutlined, GlobalOutlined, GoogleOutlined, LinkOutlined, MailOutlined, SettingOutlined, ShoppingCartOutlined, SmileOutlined, UnorderedListOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Button, Card, Menu, MenuProps, Space } from "antd";
import { useRouter } from 'next/router'
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "../app-store/auth/auth.slice";



let items = [
  { label: 'Cart', key: 'my-cart', icon: <ShoppingCartOutlined /> },
  { label: 'Orders', key: 'orders', icon: <CreditCardOutlined /> },

  { label: 'Refer & Earn', key: 'refer-earn', icon: <UsergroupAddOutlined /> },
  {
    label: 'Owner',
    key: 'submenu',
    children: [
      { label: 'Rent Requests', key: 'rent-requests', icon: <UserSwitchOutlined /> },
      { label: 'My Products', key: 'my-products', icon: <DeliveredProcedureOutlined /> },
      { label: 'List Gear', key: 'list-gear', icon: <UnorderedListOutlined /> },
      { label: 'Booking Calendar', key: 'booking-calendar', icon: <CalendarOutlined /> },
    ],
  },
  {
    label: 'Profile',
    key: 'profile-menu',
    children: [
      { label: 'My Profile', key: 'profile/', icon: <UserOutlined /> },
      { label: 'Address Book', key: 'profile/address-book', icon: <GlobalOutlined /> },
      { label: 'Bank Info', key: 'profile/bank-details', icon: <BankOutlined /> },
    ]
  }
];

const adminRoutes = {
  label: 'Admin',
  key: 'admin',
  children: [
    { label: 'Customers', key: 'admin/customers', icon: <UserOutlined /> },
    { label: 'Manage Orders', key: 'admin/orders', icon: <GlobalOutlined /> },
  ]
};

export default function AppNav() {
  const loggedUser = useSelector(selectAuthState);
  let activeItems = [...items];

  if (loggedUser?.role === "A") {
    activeItems.push(adminRoutes);
  }

  const router = useRouter()
  const onClick: MenuProps['onClick'] = e => {
    router.push('/' + e.key);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256, paddingTop: 100 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={activeItems}
    />
  );
}

