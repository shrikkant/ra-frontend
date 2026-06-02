'use client'

import React, {useEffect, useState, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import {Tab, TabGroup, TabList} from '@headlessui/react'
import {IOrder, IUser} from '../../../app-store/types'
import {fetchOrdersPaginated} from '../../../api/admin/orders.api'
import {fetchRevenueStats} from '../../../api/admin/index.api'
import {RevenueSummary, RevenueStats} from '../ReveneSummary'
import {UserSearchAutocomplete} from './UserSearchAutocomplete'
import {OrdersTable} from './OrdersTable'
import {OrdersPager} from './OrdersPager'
import {ORDER_TABS, ORDERS_PAGE_SIZE} from './orderTabs'
import {resolveOrderStage} from '../../../util/global.util'
import MyPageHeader from '../../MyPageHeader'
import {pillTabClassName, pillTabListClassName} from '../../common/PillTabs'

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
    <TabList className={pillTabListClassName}>
      {stages.map(stage => (
        <Tab
          key={stage}
          onClick={() => onStageChange(stage)}
          className={pillTabClassName}
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

const ORDER_STAGES = ORDER_TABS.map(tab => tab.stage)

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
  const [page, setPage] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      // Map the active frontend stage to the backend `status` query code.
      const tab = ORDER_TABS.find(t => t.stage === activeStage) ?? ORDER_TABS[0]
      const {orders: data, total} = await fetchOrdersPaginated({
        status: tab.status,
        userId: selectedUser?.id,
        offset: page * ORDERS_PAGE_SIZE,
        limit: ORDERS_PAGE_SIZE,
      })
      setOrders(data)
      setTotalOrders(total)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
      setTotalOrders(0)
    } finally {
      setIsLoading(false)
    }
  }, [activeStage, selectedUser?.id, page])

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
    setPage(0)
    router.push(`/p/admin/orders?stage=${stageIndex}`)
  }

  const handleUserSelect = (user: IUser | null) => {
    setSelectedUser(user)
    setPage(0)
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
          orderCount={totalOrders}
        />

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onOrderUpdate={handleOrderUpdate}
        />

        {!isLoading && (
          <div className="mt-4">
            <OrdersPager
              currentPage={page}
              totalItems={totalOrders}
              pageSize={ORDERS_PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
