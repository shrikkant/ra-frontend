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
import AddressDisplay from './AddressDisplay'
import IDCard from './IDCard'

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
    <div className=" mx-auto  py-6">
      <Section title={customer.firstname + ' ' + customer.lastname}>
        <div className="space-y-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - ID Card */}
            <div>
              {customerAadhaar?.profile_image && (
                <IDCard aadhaar={customerAadhaar} phone={customer.phone} />
              )}
            </div>

            {/* Right Column - Update Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Update Information
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Input
                    label="City"
                    value={city}
                    onChange={handleCityChange}
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Full Width Addresses Section */}
          {customer.address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Addresses
              </h3>
              <AddressDisplay addresses={customer.address} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-x-4 mt-6">
            {customer?.verified === 3 && (
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" size={'24'} />
                <span className="text-sm text-green-600">Verified</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {customer?.phone && (
                <Link
                  target="_blank"
                  href={`https://wa.me/91${customer.phone}?text=Hi ${customer.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}
                  className="text-green-600 hover:text-green-700"
                >
                  <FaWhatsappSquare size={'24'} />
                </Link>
              )}

              <button
                onClick={() => syncDocuments()}
                className="p-2 text-gray-600 hover:text-gray-800"
                title="Sync Documents"
              >
                <IoMdRefresh size={'24'} />
              </button>

              <button
                onClick={() => adminLogin(customer.id)}
                className="p-2 text-gray-600 hover:text-gray-800"
                title="Login as User"
              >
                <FaSignInAlt size={'24'} />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
