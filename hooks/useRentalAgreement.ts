import {useState, useCallback, useEffect} from 'react'
import {
  getRentalAgreementPDF,
  initializeRentalAgreementSign,
  verifyDoucmentSignSuccess,
  getSignedRentalAgreement,
} from '../api/user/orders.api'

export type SignatureStatus = 'unsigned' | 'initializing' | 'ready' | 'signed'

interface UseRentalAgreementReturn {
  pdfUrl: string | null
  signatureUrl: string | null
  loading: boolean
  signatureStatus: SignatureStatus
  error: string | null
  loadPDF: () => Promise<void>
  resetError: () => void
  checkSignSuccess: () => Promise<void>
}

export const useRentalAgreement = (
  orderId: number,
): UseRentalAgreementReturn => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [signatureStatus, setSignatureStatus] =
    useState<SignatureStatus>('unsigned')
  const [error, setError] = useState<string | null>(null)

  const loadPDF = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // First check if the document is already signed
      try {
        const signedResponse = await getSignedRentalAgreement(orderId)
        if (signedResponse.success && signedResponse.data) {
          console.log('Document is already signed, using signed data')
          setSignatureStatus('signed')

          // Convert buffer data to blob and then to data URL
          const responseData = signedResponse.data as any
          let bytes: Uint8Array

          // Check if it's a buffer object with data property
          if (
            responseData &&
            typeof responseData === 'object' &&
            'data' in responseData
          ) {
            bytes = new Uint8Array(responseData.data)
          } else if (typeof responseData === 'string') {
            // If it's a hex string, convert it to bytes
            const hexString = responseData
            bytes = new Uint8Array(
              hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [],
            )
          } else {
            // If it's already a Uint8Array or ArrayBuffer
            bytes = new Uint8Array(responseData)
          }

          const blob = new Blob([bytes], {type: 'application/pdf'})

          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            console.log(
              'Created data URL from signed document:',
              dataUrl.substring(0, 100) + '...',
            )
            setPdfUrl(dataUrl)
          }
          reader.onerror = () => {
            console.error('Failed to convert signed blob to data URL')
            setError('Failed to process signed PDF. Please try again.')
          }
          reader.readAsDataURL(blob)
          return
        }
      } catch (err) {
        console.log(
          'Document is not signed or error checking signed status:',
          err,
        )
        // Continue with normal flow if signed check fails
      }

      // If not signed, proceed with normal flow
      checkSignSuccess()

      const pdfBlob = await getRentalAgreementPDF(orderId)

      // Convert blob to data URL instead of blob URL
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        console.log('Created data URL:', dataUrl.substring(0, 100) + '...')
        setPdfUrl(dataUrl)

        // Automatically initialize signature once PDF loads successfully
        initializeSignature()
      }
      reader.onerror = () => {
        console.error('Failed to convert blob to data URL')
        setError('Failed to process PDF. Please try again.')
      }
      reader.readAsDataURL(pdfBlob)
    } catch (err) {
      console.error('Failed to load rental agreement PDF:', err)
      setError('Failed to load rental agreement. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  const checkSignSuccess = useCallback(async () => {
    const response = await verifyDoucmentSignSuccess(orderId)
    if (response.success) {
      setSignatureStatus('signed')
    }
  }, [orderId])

  const initializeSignature = useCallback(async () => {
    try {
      setSignatureStatus('initializing')

      setError(null)
      console.log('Initializing signature for order:', orderId)

      const response = await initializeRentalAgreementSign(orderId)
      console.log('Signature initialization response:', response)

      // Assuming the response contains a URL
      if (response && response.url) {
        setSignatureUrl(response.url)
        setSignatureStatus('ready')
      } else {
        throw new Error('No signature URL received from backend')
      }
    } catch (err) {
      console.error('Failed to initialize signature:', err)
      setSignatureStatus('unsigned')
      setError('Failed to initialize signature. Please try again.')
    }
  }, [orderId])

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    pdfUrl,
    signatureUrl,
    loading,
    signatureStatus,
    error,
    loadPDF,
    resetError,
    checkSignSuccess,
  }
}
