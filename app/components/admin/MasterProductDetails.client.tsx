'use client'

import MyPageHeader from 'components/MyPageHeader'

import React, {useEffect, useState} from 'react'

import {ILocation, IMasterProduct} from '../../../app-store/types'
import {fetchMasterProduct} from '../../../api/admin/index.api'
import {Section} from '../common/Section'
import Input from '../../../components/common/form/Input'
import {Button} from '@headlessui/react'
import SelectField from '../../../components/common/form/SelectField'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import {listNewProduct} from '../../../api/user/index.api'

interface CustomerDetailsProps {
  id: string
}

interface IAddressChoice {
  label: string
  value: string
}

export default function MasterProductDetails({id}: CustomerDetailsProps) {
  const loggedUser = useSelector(selectAuthState)

  const [masterProduct, setMasterProduct] = useState<IMasterProduct>()
  const [perDayRate, setPerDayRate] = useState<number>(0)
  const [addressId, setAddressId] = useState<number>(0)
  const [addressList, setAddressList] = useState<IAddressChoice[]>([])

  useEffect(() => {
    console.log('MasterProductDetails : ', id)
    if (id && !masterProduct) {
      const productId = parseInt(String(id))
      fetchMasterProduct(productId).then((product: IMasterProduct) => {
        setMasterProduct(product)
      })
    }

    if (loggedUser && loggedUser?.address) {
      const list = loggedUser.address.map((a: ILocation) => {
        return {label: a.address_line_1 + ': ' + a.id, value: String(a.id)}
      })

      list.unshift({label: 'Select Address', value: '0'})
      setAddressList(list)
    }
  }, [id, loggedUser])

  const handlePerDayRateChange = (value: string) => {
    const rate = parseInt(value)
    setPerDayRate(rate)
  }

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setAddressId(parseInt(value))
    console.log('Address change : ', value)
  }

  const addNewListing = () => {
    if (masterProduct) {
      listNewProduct(masterProduct, perDayRate, addressId).then(data => {
        console.log('New listing added : ', data)
      })
    }
  }

  return (
    <>
      <MyPageHeader title={'Products'}></MyPageHeader>

      {masterProduct?.id && (
        <Section title={masterProduct.name}>
          <div className="w-96 flex flex-col gap-y-4 m-auto">
            <div>
              <Input label="Per day rent" onChange={handlePerDayRateChange} />
            </div>
            <div>
              <SelectField
                choices={addressList}
                onChange={handleAddressChange}
                label="Select Address"
              ></SelectField>
            </div>
            <div className="flex justify-end">
              <Button onClick={addNewListing} type="button">
                Add Product
              </Button>
            </div>
          </div>
        </Section>
      )}
    </>
  )
}
