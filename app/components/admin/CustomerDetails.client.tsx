'use client'

import DocumentsCard from 'components/DocumentsCard'
import MyPageHeader from 'components/MyPageHeader'

import React, {useEffect, useState} from 'react'

import {
  fetchActiveCustomer,
  getCustomerDocuments,
} from 'api/admin/customers.api'

import {IUser} from '../../../app-store/types'
import {IDocument} from '../../../app-store/app-defaults/types'
import {ProfileCard} from '../user/ProfileCard.client'
import CustomerCard from '../../../components/CustomerCard'

interface CustomerDetailsProps {
  id: string
}

export default function CustomerDetails({id}: CustomerDetailsProps) {
  const [activeCustomer, setActiveCustomer] = useState<IUser>()
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)

  const loadActiveCustomer = (customerId: number) => {
    fetchActiveCustomer(customerId).then((customer: IUser) => {
      setActiveCustomer(customer)
    })
  }

  const loadCustomerDocuments = async (customerId: number) => {
    try {
      const fetchedDocuments = await getCustomerDocuments(customerId)
      setDocuments(fetchedDocuments)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const handleDocumentUpload = (newDoc: IDocument) => {
    setDocuments(prev => {
      const filtered = prev.filter(
        d => d.document_type !== newDoc.document_type,
      )
      return [...filtered, newDoc]
    })
  }

  useEffect(() => {
    if (id) {
      const customerId = parseInt(String(id))
      loadActiveCustomer(customerId)
      loadCustomerDocuments(customerId)
    }
  }, [id])

  return (
    <>
      <MyPageHeader title={'Customers'}></MyPageHeader>

      {activeCustomer?.id && (
        <div>
          <div>
            <div style={{flex: 1}}>
              <ProfileCard user={activeCustomer} />
            </div>
            <div>
              <CustomerCard customer={activeCustomer} />
            </div>
          </div>

          <div>
            <div style={{flex: 1}}>
              <DocumentsCard
                user={activeCustomer}
                documents={documents}
                isLoading={isLoadingDocuments}
                onUpload={handleDocumentUpload}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
