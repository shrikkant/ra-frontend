import React from 'react'
import {IDocument} from '../../app-store/app-defaults/types'

interface DocumentStatusBadgeProps {
  document?: IDocument | null
}

const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({
  document,
}) => {
  const getStatusColor = (verified?: boolean) => {
    if (verified === undefined) return 'bg-gray-100 text-gray-800'
    return verified
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  if (!document) return null

  const status = document.verified ? 'verified' : 'pending'

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.verified)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default DocumentStatusBadge
