import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import { getMinimumWage } from "../../shared"
import type { TerminationInput } from "../types"

const cappedDailySalary = (dailySalary: number): number => {
  const mxMinWage = getMinimumWage("mx")
  return mxMinWage ? Math.min(dailySalary, mxMinWage.daily * 2) : dailySalary
}

export const getMexicoTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "MXN",
    corpusVersion: "mx-v0.2.0",
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
              cappedDailySalary(ctx.dailySalary),
              primaDays,
              "LFT Art. 162 (tope 2x SM)"
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
              amount: cappedDailySalary(ctx.dailySalary) * prima,
              formula: `${cappedDailySalary(ctx.dailySalary)} x ${ctx.fullYears} x 12 días (tope 2x SM)`,
              legalReference: "LFT Art. 162 (tope 2x SM)",
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
              cappedDailySalary(ctx.dailySalary),
              primaDays,
              "LFT Art. 162 (tope 2x SM)"
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
