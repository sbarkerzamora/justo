import { round2 } from "../settlement"

export interface EmployerCostLine {
  label: string
  amount: number
  rate: string
  legalReference: string
}

export interface EmployerCostResult {
  monthlySalary: number
  employerTotal: number
  grandTotal: number
  lines: EmployerCostLine[]
}

interface EmployerSsRate {
  label: string
  rate: number
  legalReference: string
}

const employerRates: Record<string, EmployerSsRate[]> = {
  pe: [
    { label: "EsSalud", rate: 0.09, legalReference: "Ley 26790 (9% empleador)" },
  ],
  mx: [
    { label: "INFONAVIT", rate: 0.05, legalReference: "LFT Art. 136 (5% empleador)" },
  ],
  cl: [
    { label: "AFC empleador", rate: 0.024, legalReference: "Ley 19.728 (2.4% empleador)" },
  ],
  co: [],
  ar: [],
  ni: [],
  sv: [],
  gt: [],
  hn: [],
  cr: [],
  pa: [],
}

export const calculateEmployerCost = (
  countryCode: string,
  monthlySalary: number,
): EmployerCostResult => {
  const rates = employerRates[countryCode] ?? []
  const lines: EmployerCostLine[] = []

  for (const r of rates) {
    const amount = round2(monthlySalary * r.rate)
    lines.push({
      label: r.label,
      amount,
      rate: `${(r.rate * 100).toFixed(1)}%`,
      legalReference: r.legalReference,
    })
  }

  const employerTotal = round2(lines.reduce((s, l) => s + l.amount, 0))
  const grandTotal = round2(monthlySalary + employerTotal)

  return {
    monthlySalary,
    employerTotal,
    grandTotal,
    lines,
  }
}
