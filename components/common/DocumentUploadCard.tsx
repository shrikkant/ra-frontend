'use client'

import React, {useState, useEffect} from 'react'
import {FaPlus, FaEye, FaTimes} from 'react-icons/fa'
import Loader from '../Loader'
import {uploadUserDocument} from '../../api/user/documents.api'
import {displayMessage} from '../../util/global.util'
import {IDocument} from '../../app-store/app-defaults/types'
import DocumentModal from './DocumentModal'

interface DocumentUploadCardProps {
  title: string
  documentType: string
  onUpload?: (file: IDocument) => void
  existingDocument?: IDocument
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  documentType,
  onUpload,
  existingDocument,
}) => {
  const [document, setDocument] = useState<{
    file: File | null
    status?: 'pending' | 'verified' | 'rejected'
  } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (existingDocument) {
      setDocument({
        file: null,
        status: existingDocument.verified ? 'verified' : 'pending',
      })
    }
  }, [existingDocument])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File validation
    if (
      !file.type.startsWith('image/') &&
      !file.type.startsWith('application/pdf')
    ) {
      displayMessage('error', 'Please upload image or pdf')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      displayMessage('error', 'File size should be less than 5MB')
      return
    }

    try {
      setDocument({file, status: 'pending'})
      setUploading(true)

      await uploadUserDocument(
        file,
        documentType,
        progress => {
          console.log('Upload progress:', progress)
        },
        (data: IDocument) => {
          setUploading(false)
          if (onUpload) {
            onUpload(data)
          }
          console.log('Document Uploaded : ', data)
          displayMessage('success', 'Document uploaded successfully')
        },
        () => {
          setUploading(false)
          setDocument(null)
          displayMessage('error', 'Failed to upload document')
        },
      )
    } catch {
      displayMessage('error', 'Document upload error')
      setUploading(false)
      setDocument(null)
    }
  }

  const removeFile = () => {
    setDocument(null)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderDocumentView = () => {
    if (!existingDocument || !existingDocument.front) return null

    const isPDF = existingDocument.file_type?.startsWith('application/pdf')
    const documentData = Buffer.from(existingDocument.front).toString('base64')

    if (!documentData) return null

    if (isPDF) {
      return (
        <iframe
          src={`data:application/pdf;base64,${documentData}`}
          className="w-full h-full"
          title={`${title} PDF`}
        />
      )
    }

    return (
      <img
        src={`data:image/png;base64,${documentData}`}
        alt={title}
        className="w-full h-full object-contain"
      />
    )
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {document?.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}
            >
              {document.status.charAt(0).toUpperCase() +
                document.status.slice(1)}
            </span>
          )}
          {document && !uploading && (
            <>
              {existingDocument && (
                <button
                  onClick={() => setShowModal(true)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-8 h-8 flex items-center justify-center"
                >
                  <FaEye className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={removeFile}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 w-8 h-8 flex items-center justify-center"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {!document && (
        <div className="relative">
          <label className="flex flex-col items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*, application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <FaPlus className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-500">Upload</span>
          </label>
        </div>
      )}
      {uploading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}

      <DocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
      >
        {renderDocumentView()}
      </DocumentModal>
    </div>
  )
}

export default DocumentUploadCard
