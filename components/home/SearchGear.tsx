'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../common/PageContainer";
import React from "react";
import { IDefaultSearch } from "../../app-store/app-defaults/types";
import { useSelector } from "react-redux";
import { getDefaultSearch } from "../../app-store/session/session.slice";


export default function SearchGear() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const storeSearch: IDefaultSearch = useSelector<IDefaultSearch>(getDefaultSearch) as IDefaultSearch;

  const onSearch = () => {
    const { location } = storeSearch;
    const city = location?.city || "pune";

    return router.push(`/${city}?q=${search}`);
  }

  const onSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const onEnterPress = (e) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }
  return (<section className="s-find-bike">
    <PageContainer>
      <form className="find-bike-form justify-centre" onSubmit={(e) => { e.preventDefault(); }}>

        <div className='flex w-full'>
          <ul className="form-wrap w-full justify-center">
            <li>
              <input name="search" type='text' onKeyUp={onEnterPress} placeholder='Search for gear' onChange={onSearchChange} />
            </li>
            <li>
              <a href="#" onClick={onSearch} className="btn"><span>search</span></a>
            </li>
          </ul>
        </div>

      </form>
    </PageContainer>
  </section>)
}
