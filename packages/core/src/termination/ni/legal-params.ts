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

function buildArt45Lines(ctx: { dailySalary: number; tenureYears: number; fullYears: number }) {
  const fraction = ctx.tenureYears - ctx.fullYears

  const baseDays =
    Math.min(ctx.fullYears, 3) * 30 + Math.max(ctx.fullYears - 3, 0) * 20

  const fracDays =
    fraction > 0 ? (ctx.fullYears < 3 ? fraction * 30 : fraction * 20) : 0

  const totalDays = Math.min(150, Math.max(30, baseDays + fracDays))

  return [
    makeIndemnityLine(
      "Indemnización Art. 45 (30/20 días por año)",
      ctx.dailySalary,
      totalDays,
      "Ley 185 Arts. 42, 43 y 45"
    ),
  ]
}

function buildPreavisoLine(ctx: { dailySalary: number; seniorityMonths: number }) {
  const months = ctx.seniorityMonths
  let preavisoDays: number

  if (months <= 6) preavisoDays = 7
  else if (months <= 12) preavisoDays = 14
  else if (months <= 60) preavisoDays = 30
  else preavisoDays = 60

  return makeIndemnityLine(
    "Preaviso sustitutivo Art. 44",
    ctx.dailySalary,
    preavisoDays,
    "Ley 185 Art. 44"
  )
}

export const getNicaraguaTerminationParams = (
  input: TerminationInput
): TerminationParams => {
  const specialClosure = isSpecialClosure(input)
  const closureNote = specialClosureNote(input)
  const gaveNotice = input.noticeGivenInWriting === true

  return {
    currency: "NIO",
    corpusVersion: "ni-v0.3.0",
    scenarios: [
      {
        type: "renuncia",
        applicable: !specialClosure,
        buildLines: (ctx) => {
          const lines = []
          if (gaveNotice) {
            lines.push(...buildArt45Lines(ctx))
            lines.push(buildPreavisoLine(ctx))
          }
          return lines
        },
        note: specialClosure
          ? closureNote
          : gaveNotice
            ? "Renuncia con aviso escrito (15 días Art. 44): conserva derecho a indemnización Art. 45."
            : "Renuncia sin aviso escrito: pierde derecho a indemnización Art. 45. Solo prestaciones proporcionales.",
      },
      {
        type: "despido_justificado",
        applicable: false,
        note: specialClosure
          ? closureNote
          : "No aplica indemnización Art. 45 (despido con causa justificada Art. 48).",
      },
      {
        type: "despido_injustificado",
        applicable: !specialClosure,
        note: specialClosure ? closureNote : undefined,
        buildLines: (ctx) => [
          ...buildArt45Lines(ctx),
          buildPreavisoLine(ctx),
        ],
      },
      {
        type: "mutuo_acuerdo",
        applicable: !specialClosure,
        buildLines: (ctx) => [
          ...buildArt45Lines(ctx),
          buildPreavisoLine(ctx),
        ],
        note: specialClosure
          ? closureNote
          : "Mutuo acuerdo: conserva derecho a indemnización Art. 45 (Art. 43).",
      },
    ],
  }
}
