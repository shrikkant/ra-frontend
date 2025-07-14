// components/ExcelUpload.tsx
import React, {useState, useRef} from 'react'
import axios from 'axios'
import {
  FaCloudUploadAlt,
  FaFileExcel,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa'

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadStatus('error')
      setUploadMessage('Please select a valid Excel file (.xlsx or .xls)')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      setUploadStatus('error')
      setUploadMessage('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setUploadStatus('idle')
    setUploadMessage('')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus('idle')
    setUploadMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/admin/products/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus('success')
      setUploadMessage('Products uploaded successfully!')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('error')
      setUploadMessage('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setFile(null)
    setUploadStatus('idle')
    setUploadMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Bulk Product Upload
        </h3>
        <p className="text-sm text-gray-600">
          Upload an Excel file (.xlsx or .xls) to add multiple products at once.
          Maximum file size: 10MB
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div>
            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your Excel file here, or{' '}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Supports .xlsx and .xls files up to 10MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <FaFileExcel className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-700">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove file"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button */}
      {file && (
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isUploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="h-4 w-4" />
                <span>Upload Products</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Status Message */}
      {uploadMessage && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            uploadStatus === 'success'
              ? 'bg-green-100 text-green-800'
              : uploadStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {uploadStatus === 'success' ? (
            <FaCheckCircle className="h-4 w-4" />
          ) : uploadStatus === 'error' ? (
            <FaExclamationTriangle className="h-4 w-4" />
          ) : null}
          <span className="text-sm font-medium">{uploadMessage}</span>
        </div>
      )}

      {/* Template Download */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Need a template?</p>
        <button
          onClick={() => {
            // TODO: Implement template download
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Download Excel Template
        </button>
      </div>
    </div>
  )
}

export default BulkUpload
