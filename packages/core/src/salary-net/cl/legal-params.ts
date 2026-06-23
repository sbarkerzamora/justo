import { round2 } from "../../settlement"

const UF_VALUE = 37000 // 1 UF ≈ $37,000 CLP (2025, actualizar anualmente)
const TOPE_AFP_SALUD = round2(80.2 * UF_VALUE) // 80.2 UF ≈ $2,967,400 CLP/mes (D.L. 3.500, Ley 18.933)

export const getChileSalaryNetLegalRates = () => {
  return {
    afpRate: 0.115,
    saludRate: 0.07,
    afcRate: 0.006,
    afpSaludMaxBase: TOPE_AFP_SALUD,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 10800000, rate: 0.04 },
      { from: 24000000, rate: 0.08 },
      { from: 40000000, rate: 0.135 },
      { from: 56000000, rate: 0.23 },
      { from: 72000000, rate: 0.304 },
      { from: 96000000, rate: 0.355 },
    ],
  }
}
