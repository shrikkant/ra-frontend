import React from 'react'
import {IDocument} from '../../app-store/app-defaults/types'

interface DocumentViewerProps {
  document: IDocument
  title: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({document, title}) => {
  if (!document) return null

  const isPDF = document.file_type?.startsWith('application/pdf')

  console.log('Dooc ', isPDF, ' : ', document)
  if (isPDF) {
    return (
      <iframe
        src={`/api/user/documents/${document.id}/pdf`}
        className="w-full h-full"
        title={`${title} PDF`}
      />
    )
  }

  return (
    <img
      src={`/api/user/documents/${document.id}/photo`}
      alt={title}
      className="w-full h-full object-contain"
    />
  )
}

export default DocumentViewer
