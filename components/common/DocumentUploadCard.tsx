'use client'

import React, {useEffect} from 'react'
import {FaPlus} from 'react-icons/fa'
import Loader from '../Loader'
import {verifyDocument} from '../../api/admin/documents.api'
import {displayMessage} from '../../util/global.util'
import {IDocument} from '../../app-store/app-defaults/types'
import DocumentModal from './DocumentModal'
import DocumentVerificationModal from './DocumentVerificationModal'
import {MESSAGE_TYPES} from '../../util/messageTypes'
import {useDocumentUpload} from '../../hooks/useDocumentUpload'
import DocumentViewer from './DocumentViewer'
import AdminDocumentViewer from './AdminDocumentViewer'
import DocumentStatusBadge from './DocumentStatusBadge'
import DocumentActionButtons from './DocumentActionButtons'

interface DocumentUploadCardProps {
  title: string
  documentType: string
  onUpload?: (file: IDocument) => void
  existingDocument?: IDocument
  isAdmin?: boolean
  userId?: number
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  documentType,
  onUpload,
  existingDocument,
  isAdmin = false,
  userId,
}) => {
  const [showModal, setShowModal] = React.useState(false)
  const [showVerificationModal, setShowVerificationModal] =
    React.useState(false)

  const {document, uploading, handleFileUpload, removeFile, setDocument} =
    useDocumentUpload({
      isAdmin,
      userId,
      documentType,
      onUpload,
    })

  useEffect(() => {
    if (existingDocument) {
      setDocument(existingDocument)
    }
  }, [existingDocument, setDocument])

  const handleVerify = async (documentId: string) => {
    if (!existingDocument?.id) return

    try {
      const updatedDoc = await verifyDocument(
        existingDocument.user_id!,
        existingDocument.id,
      )
      return
    } catch (error) {
      console.log('Error : ', error)
      //throw error
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          <DocumentStatusBadge document={document} />
          {document && !uploading && (
            <DocumentActionButtons
              document={document}
              existingDocument={existingDocument}
              isAdmin={isAdmin}
              onView={() => setShowModal(true)}
              onVerify={() => setShowVerificationModal(true)}
              onRemove={removeFile}
            />
          )}
        </div>
      </div>
      {!document && (
        <div className="relative">
          <label className="flex flex-col items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*, application/pdf"
              onChange={e =>
                e.target.files?.[0] && handleFileUpload(e.target.files[0])
              }
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
        {existingDocument &&
          (isAdmin ? (
            <AdminDocumentViewer document={existingDocument} title={title} />
          ) : (
            <DocumentViewer document={existingDocument} title={title} />
          ))}
      </DocumentModal>

      {existingDocument && (
        <DocumentVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          document={existingDocument}
          onVerify={handleVerify}
        />
      )}
    </div>
  )
}

export default DocumentUploadCard
