import {useState} from 'react'
import {uploadUserDocument} from '../api/user/documents.api'
import {uploadDocument} from '../api/admin/customers.api'
import {displayMessage} from '../util/global.util'
import {MESSAGE_TYPES} from '../util/messageTypes'
import {IDocument} from '../app-store/app-defaults/types'

interface UseDocumentUploadProps {
  isAdmin?: boolean
  userId?: number
  documentType: string
  onUpload?: (file: IDocument) => void
}

export const useDocumentUpload = ({
  isAdmin = false,
  userId,
  documentType,
  onUpload,
}: UseDocumentUploadProps) => {
  const [document, setDocument] = useState<IDocument | null>(null)
  const [uploading, setUploading] = useState(false)

  const validateFile = (file: File): boolean => {
    if (
      !file.type.startsWith('image/') &&
      !file.type.startsWith('application/pdf')
    ) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Please upload image or pdf')
      return false
    }

    if (file.size > 20 * 1024 * 1024) {
      displayMessage(MESSAGE_TYPES.ERROR, 'File size should be less than 5MB')
      return false
    }

    return true
  }

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return

    try {
      setDocument({
        file_name: file.name,
        size: file.size,
        file_type: file.type,
        type: 1,
        document_type: documentType,
        side: 'front',
        verified: false,
      })
      setUploading(true)

      if (isAdmin) {
        if (!userId) {
          throw new Error('userId is required for admin document upload')
        }
        await uploadDocument(
          userId,
          file,
          documentType,
          'front',
          progress => {
            console.log('Upload progress:', progress)
          },
          (data: IDocument) => {
            setUploading(false)
            if (onUpload) {
              onUpload(data)
            }
            console.log('Document Uploaded : ', data)
            displayMessage(
              MESSAGE_TYPES.SUCCESS,
              'Document uploaded successfully',
            )
          },
          () => {
            setUploading(false)
            setDocument(null)
            displayMessage(MESSAGE_TYPES.ERROR, 'Failed to upload document')
          },
        )
      } else {
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
            displayMessage(
              MESSAGE_TYPES.SUCCESS,
              'Document uploaded successfully',
            )
          },
          () => {
            setUploading(false)
            setDocument(null)
            displayMessage(MESSAGE_TYPES.ERROR, 'Failed to upload document')
          },
        )
      }
    } catch (error) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Document upload error')
      setUploading(false)
      setDocument(null)
    }
  }

  const removeFile = () => {
    setDocument(null)
  }

  return {
    document,
    uploading,
    handleFileUpload,
    removeFile,
    setDocument,
  }
}
