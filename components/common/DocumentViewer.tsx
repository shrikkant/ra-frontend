import React from 'react'
import {IDocument} from '../../app-store/app-defaults/types'

interface DocumentViewerProps {
  document: IDocument
  title: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({document, title}) => {
  if (!document || !document.front) return null

  const isPDF = document.file_type?.startsWith('application/pdf')
  const documentData = Buffer.from(document.front).toString('base64')

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

export default DocumentViewer
