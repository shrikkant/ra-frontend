import { Menu, Card, Form, Checkbox, Slider } from "antd"
import Meta from "antd/lib/card/Meta"
import { CheckboxValueType } from "antd/lib/checkbox/Group"
import { Content } from "antd/lib/layout/layout"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getRateMarks, getDefaultRateRange, getBrandOptions, getProductFilter } from "../util/search.util"
import { getCategories } from "../app-store/app-defaults/app-defaults.slice"

import style from "../styles/search.module.css";
import React from "react"

const sliderTrack = {
  background: "lightgreen"
};

const handleStyle = {
  height: "14px",
  width: "14px",
  marginTop: "-2px",
}

export default function ProductFilterNav({ searchMeta , onChange}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const categories = useSelector(getCategories);
  const dispatch = useDispatch();

  const { q, rf, br, scid} = router.query

  const brands = getBrandOptions(searchMeta?.brands);
  const items = categories ? categories[0].subCategories?.map((sc) => ({ label: sc.title, key: sc.id })) : [];

  const onCategorySelect = (item) => {
    const query = { ...router.query };
    // on category change - we just delete all other filters.
    delete query.page;
    delete query.br;
    delete query.scid;
    delete query.q;
    delete query.rf;

    query.scid = item.key;
    onChange(query);

  };

  const onBrandsChange = (checkedValues: CheckboxValueType[]) => {
    const query = { ...router.query };
    delete query.br;
    delete query.page;
    if (checkedValues.length > 0) {
      let brQuery = "";
      checkedValues.map((val, index) => {
        brQuery += val + (index < checkedValues.length - 1 ? "," : "")
      });

      query.br = brQuery;
    }
    onChange(query);

  };

  const onPriceChange = (values) => {
    const query = { ...router.query };
    delete query.rf;
    delete query.page;

    let rfQuery = values[0] + "-" + values[1];
    query.rf = rfQuery;

    onChange(query);
  }


  return (<Content className={`r-comp ${style.navContent}`}>
    <Menu style={{width:280}} mode="inline" items={items} onSelect={onCategorySelect} defaultSelectedKeys={[scid]} />

    <Card title="Brands">
      <Form layout={"vertical"}>
        <Checkbox.Group className={"brands"} options={brands} onChange={onBrandsChange} />
      </Form>

    </Card>

    <Card title="Price">
      <div className={style.pitsWrapper}>
        {getPits(searchMeta.rate).map((pit, index) => {
          return (<div key={"p_" + index} className={style.pit} style={{ height: pit + '%' }}></div>)
        })}
      </div>

      <Slider marks={getRateMarks(searchMeta.rate)}
        min={searchMeta.rate.min}
        max={searchMeta.rate.max}
        trackStyle={[sliderTrack]}
        handleStyle={[handleStyle, handleStyle]}
        range
        defaultValue={getDefaultRateRange(searchMeta.rate.min, searchMeta.rate.max, rf)}
        onAfterChange={onPriceChange} />

      <Meta title={searchMeta.total}></Meta>
    </Card>

  </Content>)
}

function getPits(rate) {
  let pits: number[] = [];
  let realValues: number[] = [];

  realValues = rate.bands.map(b => b.count);

  const max = Math.max.apply(Math, realValues);
  const min = Math.min.apply(Math, realValues);

  pits = realValues.map(v => Math.round(((v - min) / (max - min)) * 100));

  return pits;
}
