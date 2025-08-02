'use client'

import React, {useState, useEffect} from 'react'
import {FaDownload, FaExpand, FaCompress} from 'react-icons/fa'

interface PDFViewerProps {
  pdfUrl: string
  title?: string
  className?: string
}

export default function PDFViewer({
  pdfUrl,
  title = 'PDF Document',
  className = '',
}: PDFViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)

  // console.log('PDFViewer received URL:', pdfUrl)

  // Add timeout for iframe loading
  useEffect(() => {
    if (pdfUrl && isLoading) {
      const timeout = setTimeout(() => {
        console.log('PDF loading timeout - showing error')
        setIsLoading(false)
        setIframeError(true)
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeout)
    }
  }, [pdfUrl, isLoading])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title.replace(/\s+/g, '_').toLowerCase() + '.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleLoad = () => {
    console.log('PDF iframe loaded successfully')
    setIsLoading(false)
  }

  const handleError = () => {
    console.error('Failed to load PDF in iframe')
    setIsLoading(false)
    setIframeError(true)
  }

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* PDF Viewer Header */}
      <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Download PDF"
          >
            <FaDownload className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <FaCompress className="h-4 w-4" />
            ) : (
              <FaExpand className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
      >
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={toggleFullscreen}
              className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title="Exit fullscreen"
            >
              <FaCompress className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className={`${isFullscreen ? 'h-full' : 'h-96'}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Unable to display PDF in browser. Please download to view.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={title}
              onLoad={handleLoad}
              onError={handleError}
              style={{display: isLoading ? 'none' : 'block'}}
            />
          )}
        </div>
      </div>
    </div>
  )
}
