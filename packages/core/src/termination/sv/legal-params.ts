import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import { getMinimumWage } from "../../shared"
import type { TerminationInput } from "../types"

const cappedDailySalary = (dailySalary: number, endDate: string): number => {
  const svMinWage = getMinimumWage("sv", endDate)
  if (!svMinWage) throw new Error("No hay salario mínimo SV para la fecha indicada")
  return Math.min(dailySalary, svMinWage.daily * 4)
}

export const getElSalvadorTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "USD",
    corpusVersion: "sv-v0.3.0",
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
              cappedDailySalary(ctx.dailySalary, ctx.endDate),
              days,
              "Código de Trabajo Art. 58 (tope 4x SM)"
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
