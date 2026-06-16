export function noticeDaysToAmount(dailySalary: number, days: number): number {
  return Math.round(dailySalary * days * 100) / 100
}
