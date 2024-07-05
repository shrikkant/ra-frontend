'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../common/PageContainer";
import React from "react";
import { IDefaultSearch } from "../../app-store/app-defaults/types";
import { useLocalStorage } from "../../util/localStore.util";

export default function SearchGear() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [storeSearch] = useLocalStorage<IDefaultSearch>("defaultSearch");
  const onSearch = () => {
    const city = storeSearch?.location?.city || "pune";
    router.push(`/${city}?q=${search}`);
  }

  const onSearchChange = (e: any) => {
    setSearch(e.target.value)
  }

  const onEnterPress = (e: any) => {

    e.preventDefault();
    if (e.key === 'Enter') {
      onSearch();
    }
  }
  return (<section className="s-find-bike">
    <PageContainer>
      <form className="find-bike-form justify-centre" onSubmit={() => onSearch()}>

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
