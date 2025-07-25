'use client'

import React, {useState, useEffect} from 'react'
import DigilockerKYC from '../../../../components/user/DigilockerKYC'
import VerifyEmail from '../../../../components/user/VerifyEmail'
import DocumentUploadCard from '../../../../components/common/DocumentUploadCard'
import {IDocument} from '../../../../app-store/app-defaults/types'
import {getUserDocuments} from '../../../../api/user/documents.api'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'

export default function Page() {
  const loggedUser = useSelector(selectAuthState)
  const [existingDocuments, setExistingDocuments] = useState<
    Record<string, IDocument>
  >({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await getUserDocuments()
        if (documents) {
          const docsMap: Record<string, IDocument> = {}
          documents.forEach(doc => {
            docsMap[doc.document_type] = doc
          })
          setExistingDocuments(docsMap)
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const handleDocumentUpload = (newDoc: IDocument) => {
    setExistingDocuments(prev => ({
      ...prev,
      [newDoc.document_type]: newDoc,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading documents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Verification Section */}

          <div className="space-y-8">
            {/* DigiLocker KYC Verification */}
            <div className="space-y-4">
              <DigilockerKYC />
            </div>

            {/* Email Verification */}
            <div className="space-y-4">
              <VerifyEmail />
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <div className="space-y-6">
                {/* Utility Bill (Required) */}
                <DocumentUploadCard
                  title="Utility Bill / Rental Agreement"
                  documentType="utility_bill"
                  onUpload={handleDocumentUpload}
                  existingDocument={existingDocuments['utility_bill']}
                />

                {/* Driving License */}
                <DocumentUploadCard
                  title="Driving License"
                  documentType="driving_license"
                  onUpload={handleDocumentUpload}
                  existingDocument={existingDocuments['driving_license']}
                />

                {/* OR Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Passport */}
                <DocumentUploadCard
                  title="Passport"
                  documentType="passport"
                  onUpload={handleDocumentUpload}
                  existingDocument={existingDocuments['passport']}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
