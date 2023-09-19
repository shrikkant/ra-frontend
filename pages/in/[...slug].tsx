import {

  Layout,
  Menu,
  Space,
} from 'antd'
import type { DatePickerProps } from 'antd'

import { Content } from 'antd/lib/layout/layout'
import AppHeader from '../../components/header'
import ProductGrid from '../../components/ProductGrid'
import { AppFooter } from '../../components/footer'
import React, { useEffect, useState } from 'react'

import styles from "../styles/Home.module.css";
import { AppLayout } from '../../components/AppLayout'
import { useRouter } from 'next/router'
import { useLocalStorage } from '../../util/localStore.util'

export default function Location() {
  const router = useRouter();
  const [search, setSearch] = useState(null);

  const [defaultSearch, setDefaultSearch] = useLocalStorage(
    "defaultSearch",
    search
  );
  const { slug } = router.query;

  useEffect(() => {
    const defaults: any = localStorage.getItem("defaultSearch");
    setSearch(defaults);

  }, []);

  return (
    <AppLayout sidebar={false}>
      <Content>
        Wow  Changed {search}
      </Content>
    </AppLayout>
  )
}
