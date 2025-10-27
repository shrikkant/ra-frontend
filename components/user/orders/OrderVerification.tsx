'use client'

import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import {VERIFICATION_FLAGS, isVerified} from '../../../config/constants'
import DigilockerKYC from '../DigilockerKYC'
import VerifyEmail from '../VerifyEmail'
import DocumentUploadCard from '../../common/DocumentUploadCard'
import RentalAgreement from '../../common/RentalAgreement'
import {IDocument} from '../../../app-store/app-defaults/types'
import {getUserDocuments} from '../../../api/user/documents.api'
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaIdCard,
  FaEnvelope,
  FaFileAlt,
  FaFileContract,
} from 'react-icons/fa'

interface OrderVerificationProps {
  orderId: number
}

interface VerificationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  required: boolean
  completed: boolean
  active: boolean
}

export default function OrderVerification({orderId}: OrderVerificationProps) {
  const loggedUser = useSelector(selectAuthState)
  const [existingDocuments, setExistingDocuments] = useState<
    Record<string, IDocument>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [allVerificationComplete, setAllVerificationComplete] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await getUserDocuments()
        if (documents) {
          const docsMap: Record<string, IDocument> = {}
          documents.forEach((doc: IDocument) => {
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

  const kycVerified = isVerified(
    loggedUser?.verified || 0,
    VERIFICATION_FLAGS.AADHAAR,
  )

  const emailVerified =
    isVerified(loggedUser?.verified || 0, VERIFICATION_FLAGS.EMAIL) ||
    loggedUser?.signin_source === 'G' ||
    loggedUser?.signin_source === 'F'

  const hasUtilityBill = !!existingDocuments['utility_bill']
  const hasIdentityDoc =
    !!existingDocuments['driving_license'] || !!existingDocuments['passport']

  const documentsVerified = hasUtilityBill && hasIdentityDoc

  const steps: VerificationStep[] = [
    {
      id: 'kyc',
      title: 'KYC Verification',
      description: 'Complete your KYC using DigiLocker',
      icon: <FaIdCard className="h-5 w-5" />,
      required: true,
      completed: kycVerified,
      active: !kycVerified,
    },
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your email address',
      icon: <FaEnvelope className="h-5 w-5" />,
      required: true,
      completed: emailVerified,
      active: !emailVerified && kycVerified,
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload required identity and address proof',
      icon: <FaFileAlt className="h-5 w-5" />,
      required: true,
      completed: documentsVerified,
      active: emailVerified && kycVerified && !documentsVerified,
    },
    {
      id: 'agreement',
      title: 'Rental Agreement',
      description: 'Review and sign the rental agreement',
      icon: <FaFileContract className="h-5 w-5" />,
      required: true,
      completed: false,
      active: kycVerified && emailVerified && documentsVerified,
    },
  ]

  useEffect(() => {
    const activeIndex = steps.findIndex(step => step.active)
    if (activeIndex !== -1) {
      setActiveStep(activeIndex)
    } else if (steps.every(step => step.completed)) {
      setAllVerificationComplete(true)
      setActiveStep(steps.length - 1)
    }
  }, [kycVerified, emailVerified, documentsVerified])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">Loading verification status...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Verification Status Alert */}
      {!allVerificationComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">
                Identity & Address Verification Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Complete all verification steps below to avoid order
                cancellation. Your booking will be cancelled and refunded if
                verification is not completed within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Verification Steps</h2>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Indicator */}
                <div
                  className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : step.active
                        ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <FaCheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-14">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    {step.completed && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    )}
                    {step.active && !step.completed && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>

                  {/* Step Component */}
                  {step.active && (
                    <div className="mt-4 pb-6">
                      {step.id === 'kyc' && <DigilockerKYC />}

                      {step.id === 'email' && <VerifyEmail />}

                      {step.id === 'documents' && (
                        <div className="space-y-4">
                          <DocumentUploadCard
                            title="Utility Bill / Rental Agreement"
                            documentType="utility_bill"
                            onUpload={handleDocumentUpload}
                            existingDocument={existingDocuments['utility_bill']}
                          />

                          <div className="border rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Upload ONE of the following identity proofs:
                            </p>

                            <DocumentUploadCard
                              title="Driving License"
                              documentType="driving_license"
                              onUpload={handleDocumentUpload}
                              existingDocument={
                                existingDocuments['driving_license']
                              }
                            />

                            <div className="relative my-4">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                  OR
                                </span>
                              </div>
                            </div>

                            <DocumentUploadCard
                              title="Passport"
                              documentType="passport"
                              onUpload={handleDocumentUpload}
                              existingDocument={existingDocuments['passport']}
                            />
                          </div>
                        </div>
                      )}

                      {step.id === 'agreement' && (
                        <>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-green-800">
                              Great! All verifications completed. Please review
                              and sign the rental agreement below.
                            </p>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                            <p className="text-sm font-semibold text-amber-900">
                              ⚠️ Don't miss these steps:
                            </p>
                            <p className="text-sm text-amber-800 mt-1">
                              • After signing & uploading signature, in
                              agreement preview scroll to bottom and click
                              "Confirm"
                              <br />• After completing the process, click
                              "Complete Process" to finish.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rental Agreement - Only show after all verifications */}
      {kycVerified && emailVerified && documentsVerified && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <RentalAgreement orderId={orderId} />
        </div>
      )}
    </div>
  )
}
