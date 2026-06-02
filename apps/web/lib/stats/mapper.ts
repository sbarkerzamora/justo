import { daysBetween, type SettlementInput, type SettlementResult } from "@justo/core"
import type { AnonymousSettlementRecord } from "@/lib/stats/types"
import crypto from "node:crypto"

export function buildAnonymousRecord(
  input: SettlementInput,
  result: SettlementResult
): AnonymousSettlementRecord {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  return {
    id: crypto.randomUUID(),
    countryCode: input.countryCode,
    monthlySalary: input.monthlySalary,
    frequency: input.frequency,
    tenureDays: daysBetween(start, end),
    unusedVacationDays: input.unusedVacationDays,
    terminationType: input.terminationType,
    grossIncome: result.grossIncome,
    totalDeductions: result.totalDeductions,
    netTotal: result.netTotal,
    currency: result.currency,
    legalCorpusVersion: result.legalCorpusVersion,
    timestamp: Date.now(),
  }
}
