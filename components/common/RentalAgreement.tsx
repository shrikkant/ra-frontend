'use client'

import React, {useEffect} from 'react'
import Loader from '../Loader'
import {FaCheckCircle, FaEye} from 'react-icons/fa'
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

  const handleViewAgreement = () => {
    if (pdfUrl) {
      // If it's a data URL, convert it to a blob URL for better compatibility
      if (pdfUrl.startsWith('data:')) {
        // Convert data URL to blob
        fetch(pdfUrl)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob)
            const newWindow = window.open(blobUrl, '_blank')

            // Clean up the blob URL after a delay
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl)
            }, 1000)

            // If window didn't open, try fallback
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed === 'undefined'
            ) {
              // Create download link as fallback
              const link = document.createElement('a')
              link.href = blobUrl
              link.download = 'rental-agreement.pdf'
              link.click()
            }
          })
          .catch(err => {
            console.error('Failed to open PDF:', err)
            // Fallback: try opening data URL directly
            window.open(pdfUrl, '_blank')
          })
      } else {
        // Regular URL, open directly
        window.open(pdfUrl, '_blank')
      }
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
