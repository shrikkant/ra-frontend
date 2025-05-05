import React from 'react'
import DocumentUploadCard from './common/DocumentUploadCard'
import {IUser} from '../app-store/types'
import {IDocument} from '../app-store/app-defaults/types'

const DocumentsCard = ({
  user,
  documents,
  isLoading = false,
  onUpload,
}: {
  user: IUser
  documents: IDocument[]
  isLoading?: boolean
  onUpload?: (newDoc: IDocument) => void
}) => {
  const documentTypes = {
    panCard: {
      label: 'Pan Card',
      type: 'pan_card',
    },
    drivingLicense: {
      label: 'Driving License',
      type: 'driving_license',
    },
    passport: {
      label: 'Passport',
      type: 'passport',
    },
    utilityBill: {
      label: 'Utility Bill',
      type: 'utility_bill',
    },
    bankStatement: {
      label: 'Bank Statement',
      type: 'bank_statement',
    },
    rentAgreement: {
      label: 'Rent Agreement',
      type: 'rent_agreement',
    },
    index2: {
      label: 'Index 2',
      type: 'index2',
    },
  }

  const getExistingDocument = (docType: string) => {
    return documents.find(doc => doc.document_type === docType)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading documents...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(documentTypes).map(([key, doc]) => (
          <DocumentUploadCard
            key={key}
            title={doc.label}
            documentType={doc.type}
            existingDocument={getExistingDocument(doc.type)}
            isAdmin={true}
            userId={user.id}
            onUpload={onUpload}
          />
        ))}
      </div>
    </div>
  )
}

export default DocumentsCard
