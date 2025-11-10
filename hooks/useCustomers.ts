import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/navigation'

import {getCustomers, setCustomers} from 'app-store/admin/index.slice'
import {fetchCustomers} from 'api/admin/customers.api'
import {getAdminAuthUser} from '../api/auth.api'
import {authUser, logout, setAdminLogin} from '../app-store/auth/auth.slice'
import {fetchSignupStats} from '../api/admin/index.api'

interface Customer {
  id: number
  firstname: string
  lastname: string
  email_address: string
  phone?: string
  city?: string
  profile_pic?: string
  verified?: number
}

export const useCustomers = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const customers = useSelector(getCustomers)

  const [loading, setLoading] = useState(false)
  const [signupStats, setSignupStats] = useState()
  const [error, setError] = useState<string | null>(null)

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCustomers()
      dispatch(setCustomers(data))
    } catch (err) {
      setError('Failed to load customers')
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchCustomersByPhone = async (phone: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCustomers(phone)
      dispatch(setCustomers(data))
    } catch (err) {
      setError('Failed to search customers')
      console.error('Failed to search customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const loginAsCustomer = async (customerId: number) => {
    try {
      dispatch(logout())
      const loggedUser = await getAdminAuthUser(customerId)
      dispatch(authUser(loggedUser))
      dispatch(setAdminLogin(true))
      router.push('/')
    } catch (err) {
      setError('Failed to login as customer')
      console.error('Failed to login as customer:', err)
    }
  }

  const visitCustomerProfile = (customerId: number) => {
    router.push(`/p/admin/customers/${customerId}`)
  }

  const loadSignupStats = async () => {
    try {
      const stats = await fetchSignupStats()
      setSignupStats(stats)
    } catch (err) {
      console.error('Failed to load signup stats:', err)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([loadSignupStats(), loadCustomers()])
    }

    initializeData()
  }, [])

  return {
    customers,
    loading,
    error,
    signupStats,
    searchCustomersByPhone,
    loginAsCustomer,
    visitCustomerProfile,
    loadCustomers,
  }
}
