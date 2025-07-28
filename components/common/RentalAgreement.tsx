'use client'

import React, {useEffect} from 'react'
import Loader from '../Loader'
import {
  FaFilePdf,
  FaCheckCircle,
  FaPen,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import PDFViewer from './PDFViewer'
import {useRentalAgreement} from '../../hooks/useRentalAgreement'

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

  const renderSignatureButton = () => {
    switch (signatureStatus) {
      case 'unsigned':
        return (
          <div className="w-full bg-gray-100 border border-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <FaPen className="h-4 w-4" />
            <span>Initializing signature...</span>
          </div>
        )
      case 'initializing':
        return (
          <div className="w-full bg-gray-100 border border-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <Loader />
            <span>Initializing signature...</span>
          </div>
        )
      case 'ready':
        return (
          <button
            onClick={handleOpenSignature}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <FaExternalLinkAlt className="h-4 w-4" />
            <span>Sign Rental Agreement</span>
          </button>
        )
      case 'signed':
        return (
          <div className="w-full bg-green-100 border border-green-300 text-green-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <FaCheckCircle className="h-4 w-4" />
            <span>Document Signed</span>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="border rounded-md border-gray-400 p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader />
          <span>Loading rental agreement...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-md border-gray-400 p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-md border-gray-400">
      {/* Header */}
      <div className="border-b border-gray-400 p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FaFilePdf className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Rental Agreement
          </h3>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="p-4">
        {pdfUrl && (
          <PDFViewer
            pdfUrl={pdfUrl}
            title="Rental Agreement"
            className="w-full"
          />
        )}
      </div>

      {/* Footer with Signature Button */}
      <div className="border-t border-gray-400 p-4 bg-gray-50">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Please review the rental agreement above and click the button below
            to sign it.
          </p>
          {renderSignatureButton()}
        </div>
      </div>
    </div>
  )
}
