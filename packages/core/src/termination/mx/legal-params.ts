import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import { getMinimumWageForCalculation } from "../../shared"
import type { TerminationInput } from "../types"

const cappedDailySalary = (dailySalary: number, minWageDaily: number): number => {
  return Math.min(dailySalary, minWageDaily * 2)
}

export const getMexicoTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)
  const { wage: mxMinWage, warnings } = getMinimumWageForCalculation(
    "mx",
    input.endDate,
  )
  if (!mxMinWage) throw new Error("No hay salario mínimo MX para la fecha indicada")

  return {
    currency: "MXN",
    corpusVersion: "mx-v0.3.0",
    warnings,
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: (ctx) => {
          if (ctx.fullYears < 15) return []
          const primaDays = ctx.fullYears * 12
          return [
            makeIndemnityLine(
              "Prima de antigüedad Art. 162 (12 días por año, solo si ≥15 años)",
              cappedDailySalary(ctx.dailySalary, mxMinWage.daily),
              primaDays,
              `LFT Art. 162 (tope 2x SM CONASAMI ${mxMinWage.year})`
            ),
          ]
        },
        note: specialClosure
          ? closureNote
          : "Prima de antigüedad solo aplica si renuncia con ≥15 años de servicio.",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización si el patrón comprueba la causa de rescisión (Arts. 48 y 50 LFT).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const indConst = 90
          const indAnual = ctx.fullYears * 12
          const prima = ctx.fullYears * 12
          const cappedSalary = cappedDailySalary(
            ctx.dailySalary,
            mxMinWage.daily,
          )

          return [
            makeIndemnityLine(
              "Indemnización constitucional Art. 48 (3 meses)",
              ctx.dailySalary,
              indConst,
              "LFT Art. 48"
            ),
            {
              label: "Indemnización anual Art. 50 (12 días por año)",
              amount: ctx.dailySalary * indAnual,
              formula: `${ctx.dailySalary} x ${ctx.fullYears} x 12 días`,
              legalReference: "LFT Art. 50",
            },
            {
              label: "Prima de antigüedad Art. 162 (12 días por año)",
              amount: cappedSalary * prima,
              formula: `${cappedSalary} x ${ctx.fullYears} x 12 días (tope 2x SM)`,
              legalReference: `LFT Art. 162 (tope 2x SM CONASAMI ${mxMinWage.year})`,
            },
          ]
        },
      },
      {
        type: "mutuo_acuerdo",
        applicable: !specialClosure,
        buildLines: (ctx) => {
          if (ctx.fullYears < 15) return []
          const primaDays = ctx.fullYears * 12
          return [
            makeIndemnityLine(
              "Prima de antigüedad Art. 162 (12 días por año, solo si ≥15 años)",
              cappedDailySalary(ctx.dailySalary, mxMinWage.daily),
              primaDays,
              `LFT Art. 162 (tope 2x SM CONASAMI ${mxMinWage.year})`
            ),
          ]
        },
        note: specialClosure
          ? closureNote
          : "Prima de antigüedad solo aplica si ≥15 años de servicio.",
      },
    ],
  }
}
