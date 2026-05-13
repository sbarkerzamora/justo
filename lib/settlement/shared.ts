export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const round2 = (value: number) => Math.round(value * 100) / 100

export const daysBetween = (start: Date, end: Date) =>
  Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

export const startOfYear = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), 0, 1))

export const tenureMonths = (totalDays: number) => Math.floor(totalDays / 30)

export const formatTenure = (totalDays: number) => {
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30
  return `${years} anos, ${months} meses, ${days} dias`
}
