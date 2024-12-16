/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect } from "react";



import BulkUpload from "components/admin/BulkUpload";
import { fetchMasterProducts } from "api/admin/index.api";
import { IProduct } from "app-store/types";
import Loader from "components/Loader";
import COUNTRIES from "config/constants";

export default function Products() {
  const PAGE_SIZE = 50;
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<IProduct[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchMasterProducts(0, PAGE_SIZE).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <MyPageHeader title={"Products"}></MyPageHeader>

      <BulkUpload />

      {loading ?
        <Loader /> :
        <div>
          <div>
            <div>Name</div>

            <div className="flex gap-x-3">
              {COUNTRIES.map((c: any) => {
                return c.locations.map((l, i) => {
                  return (
                    <div key={i}>
                      {l}
                    </div>
                  );
                });
              })}
            </div>
          </div>

          {products.map((p) => {
            return (
              <div key={p.id}>
                {p?.title}
              </div>
            );
          })}
        </div>
      }
    </>
  );
}
