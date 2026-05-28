'use client'

import React, {useEffect} from 'react'
import Loader from '../Loader'
import {FaCheckCircle, FaEye} from 'react-icons/fa'
import {useRentalAgreement} from '../../hooks/useRentalAgreement'
import {openPdfInNewWindow} from '../../util/pdf.util'

interface RentalAgreementProps {
  orderId: number
}

export default function RentalAgreement({orderId}: RentalAgreementProps) {
  const {
    pdfUrl,
    signatureUrl,
    loading,
    signatureStatus,
    error,
    loadPDF,
    resetError,
  } = useRentalAgreement(orderId)

  useEffect(() => {
    loadPDF()
  }, [loadPDF])

  const handleRetry = () => {
    resetError()
    loadPDF()
  }

  const handleOpenSignature = () => {
    if (signatureUrl) {
      window.open(signatureUrl, '_blank')
    }
  }

  const handleViewAgreement = () => {
    if (pdfUrl) {
      openPdfInNewWindow(pdfUrl, orderId + '-rental-agreement.pdf')
    }
  }

  const renderSignatureButton = () => {
    switch (signatureStatus) {
      case 'unsigned':
      case 'initializing':
        return (
          <div className="w-full bg-gray-50 text-gray-500 py-3 px-4 rounded-lg flex items-center justify-center">
            <Loader />
            <span className="ml-2">Preparing...</span>
          </div>
        )
      case 'ready':
        return (
          <button
            onClick={handleOpenSignature}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sign Agreement
          </button>
        )
      case 'signed':
        return (
          <div className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-lg flex items-center justify-center">
            <FaCheckCircle className="h-4 w-4 mr-2" />
            <span>Signed</span>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center py-4">
          <Loader />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-center py-4">
          <div className="text-red-600 mb-3">{error}</div>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Content */}
      <div className="py-4 space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
        {/* View Button */}
        <button
          onClick={handleViewAgreement}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg border border-gray-200 transition-colors flex items-center justify-center"
        >
          <FaEye className="h-4 w-4 mr-2" />
          <span>View Agreement</span>
        </button>

        {/* Sign Button */}
        {renderSignatureButton()}
      </div>
    </>
  )
}
