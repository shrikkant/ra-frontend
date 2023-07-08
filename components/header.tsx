import { Header } from 'antd/lib/layout/layout'
import {
  Menu,
  MenuProps,
  Input,
} from 'antd'

import { useRouter } from "next/router";

import { selectAuthState, authUser } from "../app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import { getAuthUser } from '../api/auth.api';
import { fetchProductCategories, fetchProducts } from '../api/products.api';
import { getCategories, setCategories } from '../app-store/app-defaults/app-defaults.slice';
import { useEffect, useState } from 'react';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from "styles/header.module.css";
import React from 'react';

import SearchBar from './SearchBar';

export default function AppHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const onClick: MenuProps['onClick'] = e => {
    router.push('/' + e.key);
  };

  const loggedUser = useSelector(selectAuthState);
  const categories = useSelector(getCategories);

  const dispatch = useDispatch();


  const items = [
    // remember to pass the key prop
    { label: 'My Cart', key: 'my-products' },
    { label: 'List for Rent', key: 'list-gear' },
    { label: loggedUser ? loggedUser.email_address : 'Login', key: 'signin' },
  ];

  const locations : MenuProps['items']  = [
    {
      key: "pune",
      label: "Pune",
    },
    {
      key: "mumbai",
      label: "Mumbai",
    },
  ]

  useEffect(() => {
    if (!categories || categories.length <= 0) {
      fetchProductCategories().then(data => dispatch(setCategories(data)));
    }

    if (!loggedUser) {
      getAuthUser().then(user => dispatch(authUser(user)));
    }

  }, [loggedUser, categories, dispatch]);



  return (

  <Header className={styles.header}>
    <div className={styles.headerInner}>
      <div style={{ flex: 1 }}>
        <a href="/">
          <img src="https://www.rentacross.com/assets/img/logo.png?version=12" style={{ maxHeight: '32px' }}></img>
        </a>
      </div>

      <div style={{alignItems: "center", display: "flex"}}>
        <SearchBar></SearchBar>
      </div>

      <div style={{ flex: 1 }}>
        <Menu
          style={{ display: 'flex', justifyContent: 'right' }}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['item-1']}
          items={items}
          onClick={onClick}>
        </Menu>
      </div>

    </div>
  </Header>

  )
}
