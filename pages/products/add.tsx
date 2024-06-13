import { Layout, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import AppNav from "components/AppNav";
import { AppFooter } from "components/footer";
import AppHeader from "components/header";

import {
  getMyProducts,
  setProducts,
} from "app-store/user/products/products.slice";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "api/user/products.api";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";
import { AppLayout } from "components/AppLayout";
import Form from "../../components/common/form/Form";
import Input from "../../components/common/form/Input";
import { IProduct } from "../../app-store/types";
import { title } from "process";
import SelectField from "../../components/common/form/SelectField";
import { getCategories } from "../../app-store/app-defaults/app-defaults.slice";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import KitAddOns from "../../components/product/KitAddOns";
import ProductRates from "../../components/product/ProductRates";

interface IChoice {
  value: string,
  label: string
}

const sample = {
  "rates":
    [{
      "index": 0,
      "options":
        [
          { "code": "D", "title": " 1-6 days" },
          { "code": "W", "title": "7-13 days" },
          { "code": "M", "title": "14+ days" }],
      "duration": "D", "rate": 1234
    }], "qty": 1, "includes": ["123123", "123123"],
  "category_id": 26,
  "sub_category_id": 30,
  "title": "adfa asdfadf asdf",
  "address_id": "1745",
  "deposit": 1000
}
export default function MyProducts() {
  const products = useSelector(getMyProducts);
  const categories: any = useSelector(getCategories);

  const [product, setProduct] = useState<IProduct>();
  const dispatch = useDispatch();

  const [choices, setChoices] = useState<IChoice[]>();



  useEffect(() => {
    //
    const choices: IChoice[] = categories ? categories[0].subCategories.map((category): IChoice => {
      return {
        value: category.id + "",
        label: category.title
      }
    }) : [];

    console.log("Use Effect Called! ", choices);
    setChoices(choices);

  }, [categories])
  if (!products) {
    getProducts().then((data) => {
      dispatch(setProducts(data));
    });
  }

  const onTitle = (e) => {
    console.log("Title : ", e.target.value);
    const prod: any = { ...product };
    prod.title = e.target.value
    setProduct(prod);
  }

  const listProduct = () => {
    console.log("Hit Add Product");
  }

  return (
    <AppLayout>
      <MyPageHeader
        title="My Products"
        subtitle="Your gear listing"
        addAction={listProduct}
      ></MyPageHeader>

      <Content style={{ padding: "16px 24px" }} >
        <Form>
          <Input label={"Title"} name={"title"} onChange={onTitle}></Input>

          <SelectField label={"What is it?"} choices={choices}></SelectField>

          <KitAddOns />

          <ProductRates/>

        </Form>
      </Content>
    </AppLayout>
  );
}
