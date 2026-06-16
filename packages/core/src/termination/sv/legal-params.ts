import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import type { TerminationInput } from "../types"

export const getElSalvadorTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "USD",
    corpusVersion: "sv-v0.2.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "La renuncia voluntaria no genera indemnización (Art. 58 aplica solo a despido injustificado).",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización (Art. 58: despido sin causa justificada).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const days = Math.max(ctx.fullYears * 30, 15)
          return [
            makeIndemnityLine(
              "Indemnización Art. 58 (30 días por año, mínimo 15 días)",
              ctx.dailySalary,
              days,
              "Código de Trabajo Art. 58"
            ),
          ]
        },
      },
      {
        type: "mutuo_acuerdo",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "El mutuo acuerdo no genera indemnización (Art. 58 aplica solo a despido injustificado).",
      },
    ],
  }
}
