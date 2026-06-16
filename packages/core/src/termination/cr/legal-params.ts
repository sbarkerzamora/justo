import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import type { TerminationInput } from "../types"

const getCesantiaDaysCr = (years: number): number => {
  const capped = Math.min(Math.floor(years), 8)
  return Math.max(capped * 20, 0)
}

const getPreavisoDaysCr = (months: number): number => {
  if (months < 3) return 0
  if (months < 6) return 7
  if (months < 12) return 15
  return 30
}

export const getCostaRicaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "CRC",
    corpusVersion: "cr-v0.2.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "La renuncia voluntaria no genera auxilio de cesantía (Art. 29).",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica auxilio de cesantía (Art. 29: despido injustificado o causa ajena al trabajador).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const cesantiaDays = getCesantiaDaysCr(ctx.tenureYears)
          const preavisoDays = getPreavisoDaysCr(ctx.seniorityMonths)
          const lines = []

          if (cesantiaDays > 0) {
            lines.push(
              makeIndemnityLine(
                "Auxilio de cesantía Art. 29",
                ctx.dailySalary,
                cesantiaDays,
                "Código de Trabajo Arts. 29 (cesantía)"
              )
            )
          }

          if (preavisoDays > 0) {
            lines.push({
              label: "Preaviso Art. 28",
              amount: ctx.dailySalary * preavisoDays,
              formula: `${ctx.dailySalary} x ${preavisoDays} días`,
              legalReference: "Código de Trabajo Art. 28",
            })
          }

          return lines
        },
      },
      {
        type: "mutuo_acuerdo",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "El mutuo acuerdo no genera auxilio de cesantía (Art. 29).",
      },
    ],
  }
}
