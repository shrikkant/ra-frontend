import React from 'react'
import {FaEye, FaTimes, FaCheck} from 'react-icons/fa'
import {IDocument} from '../../app-store/app-defaults/types'

interface DocumentActionButtonsProps {
  document: IDocument
  existingDocument?: IDocument
  isAdmin?: boolean
  onView: () => void
  onVerify: () => void
  onRemove: () => void
}

const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  document,
  existingDocument,
  isAdmin = false,
  onView,
  onVerify,
  onRemove,
}) => {
  if (!document) return null

  return (
    <div className="flex items-center gap-2">
      {existingDocument && (
        <button
          onClick={onView}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-8 h-8 flex items-center justify-center"
        >
          <FaEye className="h-4 w-4" />
        </button>
      )}
      {isAdmin && existingDocument && !existingDocument.verified && (
        <button
          onClick={onVerify}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 w-8 h-8 flex items-center justify-center"
        >
          <FaCheck className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={onRemove}
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 w-8 h-8 flex items-center justify-center"
      >
        <FaTimes className="h-4 w-4" />
      </button>
    </div>
  )
}

export default DocumentActionButtons
