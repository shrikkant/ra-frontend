'use client'

import React from 'react'
import {IOrder} from '../../../app-store/types'
import {OrderTableRow} from './OrderTableRow'
import {FaInbox} from 'react-icons/fa'

interface OrdersTableProps {
  orders: IOrder[]
  isLoading?: boolean
}

interface TableHeaderProps {
  columns: string[]
}

/**
 * Table header component.
 * Single Responsibility: Renders the table header row.
 */
const TableHeader: React.FC<TableHeaderProps> = ({columns}) => (
  <thead className="bg-gray-50 sticky top-0">
    <tr>
      {columns.map((column, index) => (
        <th
          key={column}
          className={`px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
            column === 'Amount' ? 'text-right' : ''
          } ${column === 'Days' ? 'text-center' : ''}`}
        >
          {column}
        </th>
      ))}
    </tr>
  </thead>
)

/**
 * Empty state component.
 * Single Responsibility: Displays message when no orders exist.
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <FaInbox className="h-12 w-12 mb-4 text-gray-300" />
    <p className="text-sm font-medium">No orders found</p>
    <p className="text-xs text-gray-400 mt-1">
      Try adjusting your filters or search criteria
    </p>
  </div>
)

/**
 * Loading skeleton for table rows.
 * Single Responsibility: Displays loading state.
 */
const LoadingSkeleton: React.FC = () => (
  <tbody>
    {[...Array(5)].map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-8 mx-auto" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </td>
      </tr>
    ))}
  </tbody>
)

const TABLE_COLUMNS = [
  'Order',
  'Customer',
  'Products',
  'Start',
  'End',
  'Days',
  'Amount',
  'Stage',
  'Actions',
]

/**
 * Orders table component for spreadsheet view.
 * Renders orders in a clean table format.
 *
 * Single Responsibility: Orchestrates table rendering.
 * Open/Closed: Columns can be extended without modifying this component.
 */
export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading = false,
}) => {
  if (!isLoading && (!orders || orders.length === 0)) {
    return <EmptyState />
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader columns={TABLE_COLUMNS} />
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map(order => (
              <OrderTableRow key={order.id} order={order} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
