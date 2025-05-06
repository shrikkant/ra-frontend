import React from 'react'
import {IDocument} from '../../app-store/app-defaults/types'

interface AdminDocumentViewerProps {
  document: IDocument
  title: string
}

const AdminDocumentViewer: React.FC<AdminDocumentViewerProps> = ({
  document,
  title,
}) => {
  if (!document) return null

  const isPDF = document.file_type?.startsWith('application/pdf')

  if (isPDF) {
    return (
      <iframe
        src={`/api/admin/users/${document.user_id}/documents/${document.id}/pdf`}
        className="w-full h-full"
        title={`${title} PDF`}
      />
    )
  }

  return (
    <img
      src={`/api/admin/users/${document.user_id}/documents/${document.id}/photo`}
      alt={title}
      className="w-full h-full object-contain"
    />
  )
}

export default AdminDocumentViewer
