/**
 * Admin Orders CRM tab configuration.
 *
 * `stage` is the frontend order-stage value (used for the tab identity and its
 * label via `resolveOrderStage`). `status` is the backend `status` query code
 * the list endpoint expects (see toffee `models/orderStage` CONSTANTS):
 *   0 = In Cart (Leads), 1 = Upcoming (Paid), 2 = In Progress, 4 = Completed.
 */
export interface OrderTab {
  stage: number
  status: number
}

export const ORDER_TABS: OrderTab[] = [
  {stage: 0, status: 0}, // Leads
  {stage: 1, status: 1}, // Paid
  {stage: 3, status: 2}, // In Progress
  {stage: 4, status: 4}, // Completed
]

/** Orders shown per page in the admin spreadsheet. */
export const ORDERS_PAGE_SIZE = 20
