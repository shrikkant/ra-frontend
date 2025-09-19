'use client'

import DocumentsCard from 'components/DocumentsCard'
import MyPageHeader from 'components/MyPageHeader'
import ActivityLogger from 'components/admin/ActivityLogger'

import React, {useEffect, useState} from 'react'

import {
  fetchActiveCustomer,
  getCustomerDocuments,
  checkKYCStatus,
} from 'api/admin/customers.api'

import {IUser} from '../../../app-store/types'
import {IDocument} from '../../../app-store/app-defaults/types'
import CustomerCard from '../../../components/CustomerCard'
import {VERIFICATION_FLAGS, isVerified} from '../../../config/constants'
import {FaCheckCircle, FaIdCard, FaEnvelope, FaFileAlt} from 'react-icons/fa'

interface CustomerDetailsProps {
  id: string
}

interface VerificationItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

export default function CustomerDetails({id}: CustomerDetailsProps) {
  const [activeCustomer, setActiveCustomer] = useState<IUser>()
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [isCheckingKYC, setIsCheckingKYC] = useState(false)

  const loadActiveCustomer = async (customerId: number) => {
    try {
      const customer: IUser = await fetchActiveCustomer(customerId)
      setActiveCustomer(customer)

      // Check KYC status if not already verified
      const kycVerified = isVerified(
        customer?.verified || 0,
        VERIFICATION_FLAGS.AADHAAR,
      )

      if (!kycVerified) {
        setIsCheckingKYC(true)
        try {
          // const updatedUser = await checkKYCStatus(customerId)
          // setActiveCustomer(updatedUser)
        } catch (error) {
          console.error('Failed to check KYC status:', error)
        } finally {
          setIsCheckingKYC(false)
        }
      }
    } catch (error) {
      console.error('Failed to load customer:', error)
    }
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

  const getVerificationStatus = (): VerificationItem[] => {
    if (!activeCustomer) return []

    const kycVerified = isVerified(
      activeCustomer.verified || 0,
      VERIFICATION_FLAGS.AADHAAR,
    )

    const emailVerified =
      isVerified(activeCustomer.verified || 0, VERIFICATION_FLAGS.EMAIL) ||
      activeCustomer.signin_source === 'G' ||
      activeCustomer.signin_source === 'F'

    const hasUtilityBill = documents.some(
      doc => doc.document_type === 'utility_bill',
    )
    const hasIdentityDoc = documents.some(
      doc =>
        doc.document_type === 'driving_license' ||
        doc.document_type === 'passport',
    )
    const documentsVerified = hasUtilityBill && hasIdentityDoc

    return [
      {
        id: 'kyc',
        title: 'KYC Verification',
        description: 'Complete your KYC using DigiLocker',
        icon: <FaIdCard className="h-5 w-5" />,
        completed: kycVerified,
      },
      {
        id: 'email',
        title: 'Email Verification',
        description: 'Verify your email address',
        icon: <FaEnvelope className="h-5 w-5" />,
        completed: emailVerified,
      },
      {
        id: 'documents',
        title: 'Document Upload',
        description: 'Upload required identity and address proof',
        icon: <FaFileAlt className="h-5 w-5" />,
        completed: documentsVerified,
      },
    ]
  }

  return (
    <>
      <MyPageHeader title={'Customers'}></MyPageHeader>

      {activeCustomer?.id && (
        <div className="space-y-6">
          {/* Top Section - Customer Card and Activity Logger side by side */}
          <div className="flex gap-6">
            {/* Left Column - Customer Card (Profile + Update Information) */}
            <div className="flex-1">
              <CustomerCard customer={activeCustomer} />
            </div>

            {/* Right Column - Activity Logger */}
            <div className="w-96">
              <div className="sticky top-4 h-[calc(100vh-8rem)]">
                <ActivityLogger userId={activeCustomer.id} />
              </div>
            </div>
          </div>

          {/* Full Width Sections Below */}
          {/* Verification Status Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Verification Status
            </h2>
            {isCheckingKYC && (
              <p className="text-sm text-gray-600 mb-4">
                Checking KYC status...
              </p>
            )}
            <div className="space-y-3">
              {getVerificationStatus().map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.completed ? (
                        <FaCheckCircle className="h-5 w-5" />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <DocumentsCard
              user={activeCustomer}
              documents={documents}
              isLoading={isLoadingDocuments}
              onUpload={handleDocumentUpload}
            />
          </div>
        </div>
      )}
    </>
  )
}
