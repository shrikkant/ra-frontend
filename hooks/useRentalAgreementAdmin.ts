import {useState, useEffect, useCallback} from 'react'
import {getSignedRentalAgreementForAdmin} from '../api/admin/orders.api'

interface UseRentalAgreementAdminReturn {
  pdfUrl: string | null
  hasSignedAgreement: boolean
  loading: boolean
  error: string | null
  fetchAgreement: () => Promise<string | null>
}

export const useRentalAgreementAdmin = (
  userId: number,
  orderId: number,
  options?: {lazy?: boolean},
): UseRentalAgreementAdminReturn => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [hasSignedAgreement, setHasSignedAgreement] = useState(false)
  const [loading, setLoading] = useState(!options?.lazy)
  const [error, setError] = useState<string | null>(null)

  const fetchAgreement = useCallback(async (): Promise<string | null> => {
    if (!userId || !orderId) return null
    try {
      setLoading(true)
      setError(null)

      const response = await getSignedRentalAgreementForAdmin(userId, orderId)
      if (response.success && response.data) {
        setHasSignedAgreement(true)

        // Convert buffer data to blob and then to data URL, same as user hook
        const responseData = response.data as any
        let bytes: Uint8Array

        // Handle case where data is an object with numeric keys (like {0: 37, 1: 80, 2: 68, 3: 70, ...})
        const keys = Object.keys(responseData)
          .map(Number)
          .sort((a, b) => a - b)
        bytes = new Uint8Array(keys.map(key => responseData[key]))

        const blob = new Blob([bytes as BlobPart], {type: 'application/pdf'})

        return new Promise<string | null>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            setPdfUrl(dataUrl)
            resolve(dataUrl)
          }
          reader.onerror = () => {
            setError('Failed to process signed PDF. Please try again.')
            resolve(null)
          }
          reader.readAsDataURL(blob)
        })
      } else {
        setHasSignedAgreement(false)
        return null
      }
    } catch (err) {
      console.error('Failed to check rental agreement status:', err)
      setError('Failed to check agreement status')
      setHasSignedAgreement(false)
      return null
    } finally {
      setLoading(false)
    }
  }, [userId, orderId])

  useEffect(() => {
    if (!options?.lazy && userId && orderId) {
      fetchAgreement()
    }
  }, [options?.lazy, userId, orderId, fetchAgreement])

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  return {
    pdfUrl,
    hasSignedAgreement,
    loading,
    error,
    fetchAgreement,
  }
}