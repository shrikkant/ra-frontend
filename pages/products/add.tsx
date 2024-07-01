
import { Content } from "antd/lib/layout/layout";

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

import SelectField from "../../components/common/form/SelectField";
import { getCategories } from "../../app-store/app-defaults/app-defaults.slice";
import KitAddOns from "../../components/product/KitAddOns";
import ProductRates from "../../components/product/ProductRates";

interface IChoice {
  value: string,
  label: string
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

          <ProductRates />

        </Form>
      </Content>
    </AppLayout>
  );
}
