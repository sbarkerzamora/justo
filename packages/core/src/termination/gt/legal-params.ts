import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import type { TerminationInput } from "../types"

export const getGuatemalaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "GTQ",
    corpusVersion: "gt-v0.2.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const days = Math.min(ctx.fullYears * 30, 240)
          return [
            makeIndemnityLine(
              "Indemnización Art. 82 (30 días por año, máximo 240 días)",
              ctx.dailySalary,
              days,
              "Decreto 1441 Arts. 78 y 82"
            ),
          ]
        },
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "Si el empleador no prueba la causa justa, aplica indemnización Art. 82 (despido injustificado).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const days = Math.min(ctx.fullYears * 30, 240)
          const lines = [
            makeIndemnityLine(
              "Indemnización Art. 82 (30 días por año, máximo 240 días)",
              ctx.dailySalary,
              days,
              "Decreto 1441 Arts. 78 y 82"
            ),
          ]
          if (ctx.fullYears >= 1) {
            lines.push({
              label: "Salarios caídos (daños y perjuicios, hasta 12 meses)",
              amount: 0,
              formula: "Determinado judicialmente",
              legalReference: "Decreto 1441 Art. 78 literal b",
            })
          }
          return lines
        },
      },
      {
        type: "mutuo_acuerdo",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const days = Math.min(ctx.fullYears * 30, 240)
          return [
            makeIndemnityLine(
              "Indemnización Art. 82 (30 días por año, máximo 240 días)",
              ctx.dailySalary,
              days,
              "Decreto 1441 Arts. 78 y 82"
            ),
          ]
        },
      },
    ],
  }
}
