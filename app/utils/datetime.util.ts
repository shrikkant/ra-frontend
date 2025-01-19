

export const getDiffInDays = (startDate: Date, endDate: Date): number => {
  const START_HOUR = 9;
  const END_HOUR = 19;
  startDate.setHours(START_HOUR, 0, 0, 0);
  endDate.setHours(END_HOUR, 0, 0, 0);

  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.ceil(
    differenceInTime / (1000 * 60 * 60 * 24)
  );
  return differenceInDays;
}
