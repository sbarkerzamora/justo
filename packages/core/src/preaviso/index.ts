import type { CountryCode } from "../settlement"
import type { PreavisoInput, PreavisoResult } from "./types"
import { calculateArgentinaPreaviso } from "./ar/calculate"
import { calculateChilePreaviso } from "./cl/calculate"
import { calculateColombiaPreaviso } from "./co/calculate"
import { calculateCostaRicaPreaviso } from "./cr/calculate"
import { calculateElSalvadorPreaviso } from "./sv/calculate"
import { calculateGuatemalaPreaviso } from "./gt/calculate"
import { calculateHondurasPreaviso } from "./hn/calculate"
import { calculateMexicoPreaviso } from "./mx/calculate"
import { calculateNicaraguaPreaviso } from "./ni/calculate"
import { calculatePanamaPreaviso } from "./pa/calculate"
import { calculatePeruPreaviso } from "./pe/calculate"

export * from "./schema"
export * from "./types"

type PreavisoCalculator = (input: PreavisoInput) => PreavisoResult

export const preavisoCalculators: Record<CountryCode, PreavisoCalculator> = {
  ar: calculateArgentinaPreaviso,
  cl: calculateChilePreaviso,
  co: calculateColombiaPreaviso,
  cr: calculateCostaRicaPreaviso,
  gt: calculateGuatemalaPreaviso,
  hn: calculateHondurasPreaviso,
  mx: calculateMexicoPreaviso,
  ni: calculateNicaraguaPreaviso,
  pa: calculatePanamaPreaviso,
  pe: calculatePeruPreaviso,
  sv: calculateElSalvadorPreaviso,
}

export {
  calculateArgentinaPreaviso,
  calculateChilePreaviso,
  calculateColombiaPreaviso,
  calculateCostaRicaPreaviso,
  calculateElSalvadorPreaviso,
  calculateGuatemalaPreaviso,
  calculateHondurasPreaviso,
  calculateMexicoPreaviso,
  calculateNicaraguaPreaviso,
  calculatePanamaPreaviso,
  calculatePeruPreaviso,
}
