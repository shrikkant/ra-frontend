import React, {useState, useEffect} from 'react'
import {
  FaRobot,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
} from 'react-icons/fa'
import {getAISyncStatus, syncNextProducts} from 'api/admin/index.api'

const AISyncSection: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<{
    synced: number
    toSync: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [syncStatusType, setSyncStatusType] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const fetchSyncStatus = async () => {
    setIsLoading(true)
    try {
      const status = await getAISyncStatus()
      setSyncStatus(status)
    } catch (error) {
      console.error('Failed to fetch sync status:', error)
      setSyncMessage('Failed to load sync status')
      setSyncStatusType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncNext = async () => {
    setIsSyncing(true)
    setSyncMessage('')
    setSyncStatusType('idle')

    try {
      await syncNextProducts(10)
      setSyncMessage('Successfully synced next 10 products!')
      setSyncStatusType('success')
      // Refresh the status after sync
      await fetchSyncStatus()
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncMessage('Failed to sync products. Please try again.')
      setSyncStatusType('error')
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    fetchSyncStatus()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <FaRobot className="mr-2 text-blue-600" />
          AI Product Sync
        </h3>
        <p className="text-sm text-gray-600">
          Sync product details with AI to enhance descriptions and metadata
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin h-6 w-6 text-blue-600 mr-2" />
          <span className="text-gray-600">Loading sync status...</span>
        </div>
      ) : syncStatus ? (
        <div className="space-y-4">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaCheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-800">
                    {syncStatus.synced}
                  </p>
                  <p className="text-sm text-green-600">Products Synced</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-orange-800">
                    {syncStatus.toSync}
                  </p>
                  <p className="text-sm text-orange-600">Pending Sync</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">
                {syncStatus.toSync > 0
                  ? `Ready to sync next 10 products (${syncStatus.toSync} remaining)`
                  : 'All products are synced!'}
              </p>
            </div>

            <button
              onClick={handleSyncNext}
              disabled={isSyncing || syncStatus.toSync === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isSyncing || syncStatus.toSync === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSyncing ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <FaSync className="h-4 w-4" />
                  <span>Sync Next 10</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaExclamationTriangle className="mx-auto h-8 w-8 mb-2" />
          <p>Unable to load sync status</p>
        </div>
      )}

      {/* Status Message */}
      {syncMessage && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            syncStatusType === 'success'
              ? 'bg-green-100 text-green-800'
              : syncStatusType === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {syncStatusType === 'success' ? (
            <FaCheckCircle className="h-4 w-4" />
          ) : syncStatusType === 'error' ? (
            <FaExclamationTriangle className="h-4 w-4" />
          ) : null}
          <span className="text-sm font-medium">{syncMessage}</span>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={fetchSyncStatus}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          <FaSync
            className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh Status
        </button>
      </div>
    </div>
  )
}

export default AISyncSection
