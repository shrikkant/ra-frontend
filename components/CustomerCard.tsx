'use client'
import Moment from 'moment'

import React, {useEffect, useState} from 'react'

import {IUser} from '../app-store/types'
import {FaCheckCircle, FaSignInAlt, FaWhatsappSquare} from 'react-icons/fa'
import Link from 'next/link'
import {authUser, logout, setAdminLogin} from '../app-store/auth/auth.slice'
import {getAdminAuthUser} from '../api/auth.api'
import {useRouter} from 'next/navigation'
import {useDispatch} from 'react-redux'
import {
  fetchCustomerAadhaar,
  syncCustomerDocuments,
  updateCustomer,
} from '../api/admin/customers.api'
import {IAadhaar} from '../app-store/auth/types'
import {Section} from '../app/components/common/Section'
import Input from './common/form/Input'
import {Button} from '@headlessui/react'
import {IoMdRefresh} from 'react-icons/io'

export default function CustomerCard({customer}: {customer: IUser}) {
  const router = useRouter()
  const dispatch = useDispatch()

  const [customerAadhaar, setCustomerAadhaar] =
    React.useState<IAadhaar | null>()
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')

  const adminLogin = (customerId: number) => {
    dispatch(logout())
    getAdminAuthUser(customerId).then(loggedUser => {
      dispatch(authUser(loggedUser))
      dispatch(setAdminLogin(true))
      router.push('/')
    })
  }

  const handleEmailChange = (email: string) => {
    setEmail(email)
  }

  const handlePhoneChange = (phone: string) => {
    setPhone(phone)
  }

  const handleCityChange = (city: string) => {
    setCity(city)
  }

  const handleFirstnameChange = (firstname: string) => {
    setFirstname(firstname)
  }

  const handleLastnameChange = (lastname: string) => {
    setLastname(lastname)
  }

  const syncDocuments = () => {
    syncCustomerDocuments(customer.id).then(data => {
      console.log('Syncing Documents', data)
    })
  }

  const handleSubmit = async () => {
    await updateCustomer(customer.id, email, phone, firstname, lastname, city)
    router.refresh()
  }

  useEffect(() => {
    setPhone(customer.phone)
    setCity(customer.city ? customer.city : '')
    setEmail(customer.email_address)
    setFirstname(customer.firstname ? customer.firstname : '')
    setLastname(customer.lastname ? customer.lastname : '')
    if (!customerAadhaar) {
      fetchCustomerAadhaar(customer.id).then((data: IAadhaar) => {
        setCustomerAadhaar(data)
      })
    }
  }, [customerAadhaar, customer])

  return (
    <div>
      <Section title={customer.firstname + ' ' + customer.lastname}>
        <div>
          {customerAadhaar?.profile_image && (
            <div className="   shadow-md w-[320px] rounded-md my-4 border">
              <div className="flex gap-x-2">
                <div className="rounded-tl-md border">
                  <img
                    src={`data:image/png;base64,${customerAadhaar.profile_image}`}
                  ></img>
                </div>
                <div className="flex flex-col gap-y-4 w-96 py-4 ">
                  <div>
                    <p className="font-bold">{customerAadhaar.full_name}</p>
                    <p>{Moment(customerAadhaar.dob).format('D MMM YYYY')}</p>
                    <p>{customer.phone}</p>
                  </div>
                </div>
              </div>
              <div>{Object.values(customerAadhaar.address).join(', ')}</div>
            </div>
          )}

          <div>
            {customer.address &&
              customer.address.map(addr => (
                <div key={addr.id}>{Object.values(addr).join(', ')}</div>
              ))}
          </div>

          <form className="flex flex-col gap-y-4 w-96  border border-gray-400 p-4 rounded-md m-auto">
            <div className="flex gap-x-4">
              <div>
                <Input
                  placeholder="First Name"
                  value={firstname}
                  onChange={handleFirstnameChange}
                />
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={lastname}
                  onChange={handleLastnameChange}
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <Input
                placeholder="Phone"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div>
              <Input label="City" value={city} onChange={handleCityChange} />
            </div>
            <div className="text-right">
              <Button
                onClick={handleSubmit}
                className={'border hover:border-[#E5C71F] border-[#FFDC2DAD]'}
                type="button"
              >
                Save
              </Button>
            </div>
          </form>

          <div className=" flex justify-end items-center gap-x-2">
            {customer?.verified === 3 && (
              <div>
                <FaCheckCircle className="text-green-600" size={'28'} />
              </div>
            )}

            {customer?.phone && (
              <Link
                target="_blank"
                href={`https://wa.me/91${customer.phone}?text=Hi ${customer.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}
              >
                <FaWhatsappSquare size={'28'} />
              </Link>
            )}

            <button onClick={() => syncDocuments()} className="p-2">
              <IoMdRefresh></IoMdRefresh>
            </button>
            <button onClick={() => adminLogin(customer.id)} className="p-2">
              <FaSignInAlt size={'28'} />
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}
