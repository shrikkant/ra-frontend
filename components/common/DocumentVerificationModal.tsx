import React, {useState} from 'react'
import {FaTimes} from 'react-icons/fa'
import Loader from '../Loader'
import {displayMessage} from '../../util/global.util'
import {MESSAGE_TYPES} from '../../util/messageTypes'
import {IDocument} from '../../app-store/app-defaults/types'
import {fetchDocumentDetails} from '../../api/admin/documents.api'

interface DocumentVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  document: IDocument
  onVerify: (documentId: string) => Promise<void>
}

interface VerificationData {
  name?: string
  details?: object
}

const DocumentVerificationModal: React.FC<DocumentVerificationModalProps> = ({
  isOpen,
  onClose,
  document,
  onVerify,
}) => {
  const [documentId, setDocumentId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null)

  const handleFetchDetails = async () => {
    if (!documentId) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Please enter document ID')
      return
    }
    if (!dateOfBirth) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Please enter date of birth')
      return
    }

    setIsLoading(true)
    try {
      const data: any = await fetchDocumentDetails(
        document.user_id!,
        document.id!,
        +documentId,
        dateOfBirth,
      )

      console.log('Verification Data : ', data)
      setVerificationData(data)
    } catch (error) {
      console.log('Error ??? ', error)
      displayMessage(MESSAGE_TYPES.ERROR, 'Failed to fetch document details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    debugger
    e.preventDefault()

    if (!documentId) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Please enter document ID')
      return
    }
    if (!dateOfBirth) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Please enter date of birth')
      return
    }

    setIsLoading(true)
    try {
      await onVerify(documentId)
      displayMessage(MESSAGE_TYPES.SUCCESS, 'Document verified successfully')
    } catch (error) {
      displayMessage(MESSAGE_TYPES.ERROR, 'Failed to verify document')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Verify Document</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document ID
            </label>
            <input
              type="text"
              value={documentId}
              onChange={e => setDocumentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {verificationData && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Document Details</h4>
              <p className="text-sm text-gray-600">
                Name: {verificationData.name}
              </p>
              <div className="mt-2">
                <h5 className="font-medium mb-1">Details:</h5>
                <table className="w-full text-sm">
                  <tbody>
                    {verificationData &&
                      Object.entries(verificationData).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-1 pr-2 font-medium">{key}:</td>
                          <td className="py-1">{String(value)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleFetchDetails}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? <Loader /> : 'Fetch Details'}
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || !verificationData}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? <Loader /> : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentVerificationModal
