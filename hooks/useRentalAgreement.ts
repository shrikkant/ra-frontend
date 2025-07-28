import {useState, useCallback, useEffect} from 'react'
import {
  getRentalAgreementPDF,
  initializeRentalAgreementSign,
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
      console.log('Loading PDF for order:', orderId)
      const pdfBlob = await getRentalAgreementPDF(orderId)
      console.log('PDF blob received in hook:', {
        size: pdfBlob.size,
        type: pdfBlob.type,
      })

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
  }
}
