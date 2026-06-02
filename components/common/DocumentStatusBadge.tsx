import React from 'react'
import {IDocument} from '../../app-store/app-defaults/types'

interface DocumentStatusBadgeProps {
  document?: IDocument | null
}

const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({
  document,
}) => {
  // Review status code: 1 = approved, 2 = rejected, 0/undefined = pending.
  const resolveStatus = (verified?: number) => {
    if (verified === 1)
      return {label: 'Approved', color: 'bg-green-100 text-green-800'}
    if (verified === 2)
      return {label: 'Rejected', color: 'bg-red-100 text-red-800'}
    return {label: 'Pending', color: 'bg-yellow-100 text-yellow-800'}
  }

  if (!document) return null

  const status = resolveStatus(document.verified)

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
    >
      {status.label}
    </span>
  )
}

export default DocumentStatusBadge
