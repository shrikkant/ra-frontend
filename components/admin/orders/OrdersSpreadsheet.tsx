'use client'

import React, {useEffect, useState, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import {IOrder, IUser} from '../../../app-store/types'
import {fetchOrdersWithFilters} from '../../../api/admin/orders.api'
import {fetchRevenueStats} from '../../../api/admin/index.api'
import {RevenueSummary, RevenueStats} from '../ReveneSummary'
import {UserSearchAutocomplete} from './UserSearchAutocomplete'
import {OrdersTable} from './OrdersTable'
import {resolveOrderStage} from '../../../util/global.util'
import MyPageHeader from '../../MyPageHeader'

interface OrdersSpreadsheetProps {
  initialStage: number
}

interface StageTabsProps {
  stages: number[]
  activeStage: number
  onStageChange: (stage: number) => void
}

interface FilterBarProps {
  selectedUser: IUser | null
  onUserSelect: (user: IUser | null) => void
  orderCount: number
}

/**
 * Stage tabs component.
 * Single Responsibility: Handles stage tab rendering and selection.
 */
const StageTabs: React.FC<StageTabsProps> = ({
  stages,
  activeStage,
  onStageChange,
}) => (
  <TabGroup selectedIndex={stages.indexOf(activeStage)}>
    <TabList className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {stages.map(stage => (
        <Tab
          key={stage}
          onClick={() => onStageChange(stage)}
          className={({selected}) =>
            `px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
              selected
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {resolveOrderStage(stage)}
        </Tab>
      ))}
    </TabList>
  </TabGroup>
)

/**
 * Filter bar component with user search.
 * Single Responsibility: Handles filter UI rendering.
 */
const FilterBar: React.FC<FilterBarProps> = ({
  selectedUser,
  onUserSelect,
  orderCount,
}) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <div className="w-72">
      <UserSearchAutocomplete
        selectedUser={selectedUser}
        onUserSelect={onUserSelect}
        placeholder="Filter by customer..."
      />
    </div>
    <div className="text-sm text-gray-500">
      {orderCount} order{orderCount !== 1 ? 's' : ''}
    </div>
  </div>
)

const ORDER_STAGES = [0, 1, 3]

/**
 * Main orders spreadsheet component.
 * Orchestrates the entire orders CRM view.
 *
 * Single Responsibility: Coordinates data fetching and component composition.
 * Dependency Inversion: Depends on abstractions (props/hooks) not concretions.
 */
export const OrdersSpreadsheet: React.FC<OrdersSpreadsheetProps> = ({
  initialStage,
}) => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [activeStage, setActiveStage] = useState(initialStage)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchOrdersWithFilters({
        status: activeStage,
        userId: selectedUser?.id,
      })
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [activeStage, selectedUser?.id])

  const loadRevenueStats = useCallback(async () => {
    try {
      const stats = await fetchRevenueStats()
      setRevenueStats(stats)
    } catch (error) {
      console.error('Failed to load revenue stats:', error)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    loadRevenueStats()
  }, [loadRevenueStats])

  const handleStageChange = (stage: number) => {
    const stageIndex = ORDER_STAGES.indexOf(stage)
    setActiveStage(stage)
    router.push(`/p/admin/orders?stage=${stageIndex}`)
  }

  const handleUserSelect = (user: IUser | null) => {
    setSelectedUser(user)
  }

  const handleOrderUpdate = useCallback(() => {
    loadOrders()
  }, [loadOrders])

  const canDisplayRevenueStats =
    revenueStats && revenueStats.stats?.revenue?.length > 1

  return (
    <div className="space-y-4">
      <MyPageHeader title="Orders CRM">
        <StageTabs
          stages={ORDER_STAGES}
          activeStage={activeStage}
          onStageChange={handleStageChange}
        />
      </MyPageHeader>

      {canDisplayRevenueStats && revenueStats && (
        <RevenueSummary revenueStats={revenueStats} />
      )}

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <FilterBar
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          orderCount={orders.length}
        />

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onOrderUpdate={handleOrderUpdate}
        />
      </div>
    </div>
  )
}
