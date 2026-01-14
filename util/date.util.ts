import {format, formatDistanceToNow} from 'date-fns'

interface IDateRange {
  startDate: Date
  endDate: Date
}

const rangeDisplay = function (range: IDateRange) {
  const startDate = range.startDate
  const endDate = range.endDate

  const showYear = startDate.getFullYear() !== endDate.getFullYear()
  const showMonth = showYear || startDate.getMonth() < endDate.getMonth()

  const startFormat = 'd ' + (showMonth ? 'MMM ' : '') + (showYear ? 'yy' : '')
  const endFormat = 'd MMM ' + (showYear ? 'yy' : '')
  return (
    format(startDate, startFormat.trim()) +
    ' - ' +
    format(endDate, endFormat.trim())
  )
}

const dateDisplay = function (date: Date | undefined) {
  if (!date) return 'Invalid Date'
  return format(date, 'd MMM')
}

const timeAgo = (timestamp: string | number | Date) => {
  return formatDistanceToNow(new Date(timestamp), {addSuffix: true})
}

export {rangeDisplay, timeAgo, dateDisplay}
