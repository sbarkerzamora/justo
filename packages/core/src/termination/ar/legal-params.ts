import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import type { TerminationInput } from "../types"

export const getArgentinaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "ARS",
    corpusVersion: "ar-v0.2.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "La renuncia voluntaria no genera indemnización (Art. 245: despido sin justa causa).",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización (Art. 245: despido sin justa causa).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const monthsFraction = (ctx.tenureYears - ctx.fullYears) * 12
          const effectiveYears =
            monthsFraction > 3 ? ctx.fullYears + 1 : ctx.fullYears
          const months = Math.max(effectiveYears, 1)

          return [
            makeIndemnityLine(
              "Indemnización Art. 245 (1 mes por año, fracción >3 meses = año completo, mínimo 1 mes)",
              ctx.dailySalary,
              months * 30,
              "Ley 20.744 Art. 245"
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
          : "El mutuo acuerdo no genera indemnización (Art. 245).",
      },
    ],
  }
}
