

export const getDiffInDays = (startDate: Date, endDate: Date): number => {
  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.ceil(
    differenceInTime / (1000 * 60 * 60 * 24)
  );
  return differenceInDays > 0 ? differenceInDays : 1;
}
