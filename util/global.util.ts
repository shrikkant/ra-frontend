import {toast} from 'react-toastify'

export const resolveOrderStage = (status: number) => {
  switch (status) {
    case 0:
      return 'Leads'
    case 1:
      return 'Paid'
    case 2:
      return 'Approved'
    case 3:
      return 'In Progress'
    case 4:
      return 'Completed'
    case 97:
      return 'Owner Cancelled'
    case 98:
      return 'Renter Cancelled'
  }
}

export const enum OrderStages {
  Leads = 0,
  Paid = 1,
  Approved = 2,
  InProgress = 3,
  Completed = 4,
  OwnerCancelled = 97,
  RenterCancelled = 98,
}

export const capitalize = str => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
export const displayMessage = (type: string, text: string) => {
  switch (type) {
    case 'success':
      toast.success(text)
      break
    case 'error':
      toast.error(text)
      break
    case 'warning':
      toast.warning(text)
      break
    case 'info':
      toast.info(text)
      break
  }
  return
}
