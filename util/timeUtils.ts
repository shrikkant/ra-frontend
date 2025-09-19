import {formatDistanceToNow} from 'date-fns'

export function getRelativeTime(date: string | Date): string {
  try {
    return formatDistanceToNow(new Date(date), {addSuffix: true})
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'unknown time'
  }
}