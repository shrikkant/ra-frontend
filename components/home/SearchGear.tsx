'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "../common/PageContainer";
import React from "react";

export default function SearchGear() {
  const router = useRouter();

  const [search, setSearch] = useState('');

  const onSearch = () => {
    router.push('/pune?q=' + search);
  }

  const onSearchChange = (e: any) => {
    setSearch(e.target.value)
  }

  const onEnterPress = (e: any) => {
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
            <li><a href="#" onClick={onSearch} className="btn"><span>search</span></a></li>
          </ul>
        </div>

      </form>
    </PageContainer>
  </section>)
}
