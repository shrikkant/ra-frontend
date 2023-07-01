import * as moment from 'moment'
interface IDateRange {
  startDate: Date,
  endDate: Date,
}


const rangeDisplay = function(range: IDateRange) {
  const startDate = range.startDate;
  const endDate = range.endDate;

  const showYear = startDate.getFullYear() < endDate.getFullYear();
  const showMonth = showYear || startDate.getMonth() < endDate.getMonth();

  const startFormat = "D " + (showMonth ? "MMM " : "") + (showYear ? "YYYY" : "");
  const endFormat = "D MMM " + (showYear ? "YYYY" : "");
  return moment(startDate).format(startFormat) +
      " - " +
      moment(endDate).format(endFormat);
}

export {
  rangeDisplay
}
