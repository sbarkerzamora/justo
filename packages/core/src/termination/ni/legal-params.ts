import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"
import type { TerminationInput } from "../types"

const baseScenarioTypes = new Set([
  "renuncia",
  "despido_justificado",
  "despido_injustificado",
  "mutuo_acuerdo",
])

const isSpecialClosure = (input: TerminationInput) =>
  !baseScenarioTypes.has(input.terminationCause) ||
  input.contractType === "periodo_prueba"

const specialClosureNote = (input: TerminationInput) => {
  if (input.contractType === "periodo_prueba") {
    return "Periodo de prueba: no se calcula indemnización automática sin validar reglas específicas del caso en el corpus legal."
  }

  return "Causa especial de cierre: se requiere regla específica por causa y contrato; no se agrega indemnización sin respaldo del corpus."
}

export const getNicaraguaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialClosure(input)
  const closureNote = specialClosureNote(input)

  return {
    currency: "NIO",
    corpusVersion: "ni-v0.3.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: () => [],
        note: specialClosure
          ? closureNote
          : "No genera indemnización Art. 45. Conserva derecho a prestaciones proporcionales (Art. 43).",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización (Art. 45: rescindir sin causa justificada).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => {
          const fullYears = ctx.fullYears
          const fraction = ctx.tenureYears - fullYears

          const baseDays =
            Math.min(fullYears, 3) * 30 + Math.max(fullYears - 3, 0) * 20

          const fracDays =
            fraction > 0 ? (fullYears < 3 ? fraction * 30 : fraction * 20) : 0

          const totalDays = Math.min(150, Math.max(30, baseDays + fracDays))

          return [
            makeIndemnityLine(
              "Indemnización Art. 45 (30/20 días por año)",
              ctx.dailySalary,
              totalDays,
              "Ley 185 Arts. 42, 43 y 45"
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
          : "No genera indemnización Art. 45. Conserva derecho a prestaciones proporcionales (Art. 43).",
      },
    ],
  }
}
