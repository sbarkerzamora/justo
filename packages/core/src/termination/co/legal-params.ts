import type { TerminationParams } from "../shared"
import {
  getSpecialTerminationClosureNote,
  isSpecialTerminationClosure,
  makeIndemnityLine,
} from "../shared"
import { getMinimumWage } from "../../shared"
import type { TerminationInput } from "../types"

const indemnizacionColombia = (ctx: { dailySalary: number; fullYears: number; monthlySalary: number }) => {
  const coMinWage = getMinimumWage("co")
  const tenSmmlv = coMinWage ? coMinWage.monthly * 10 : Infinity
  const isHighSalary = ctx.monthlySalary >= tenSmmlv

  const baseDays = isHighSalary ? 20 : 30
  const extraDays = Math.max(ctx.fullYears - 1, 0) * (isHighSalary ? 15 : 20)
  const totalDays = baseDays + extraDays

  return {
    days: totalDays,
    isHighSalary,
    label: isHighSalary
      ? "Indemnización Art. 64 (20 días base + 15 días/año adicional, salario ≥10 SMMLV)"
      : "Indemnización Art. 64 (30 días base + 20 días/año adicional, salario <10 SMMLV)",
  }
}

export const getColombiaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialTerminationClosure(input)
  const closureNote = getSpecialTerminationClosureNote(input)

  return {
    currency: "COP",
    corpusVersion: "co-v0.2.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "La renuncia voluntaria no genera indemnización (Art. 64: terminación unilateral sin justa causa por el empleador).",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización si el empleador prueba la justa causa (Art. 64).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const info = indemnizacionColombia(ctx)
          return [
            makeIndemnityLine(
              info.label,
              ctx.dailySalary,
              info.days,
              `CST Art. 64 (${info.isHighSalary ? "≥10 SMMLV" : "<10 SMMLV"})`
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
          : "El mutuo acuerdo no genera indemnización (Art. 64).",
      },
    ],
  }
}
