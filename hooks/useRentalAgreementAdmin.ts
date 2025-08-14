import {useState, useEffect} from 'react'
import {getSignedRentalAgreementForAdmin} from '../api/admin/orders.api'

interface UseRentalAgreementAdminReturn {
  hasSignedAgreement: boolean
  loading: boolean
  error: string | null
}

export const useRentalAgreementAdmin = (
  userId: number,
  orderId: number,
): UseRentalAgreementAdminReturn => {
  const [hasSignedAgreement, setHasSignedAgreement] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAgreementStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getSignedRentalAgreementForAdmin(userId, orderId)
        setHasSignedAgreement(response.success && !!response.data)
      } catch (err) {
        console.error('Failed to check rental agreement status:', err)
        setError('Failed to check agreement status')
        setHasSignedAgreement(false)
      } finally {
        setLoading(false)
      }
    }

    if (userId && orderId) {
      checkAgreementStatus()
    }
  }, [userId, orderId])

  return {
    hasSignedAgreement,
    loading,
    error,
  }
}