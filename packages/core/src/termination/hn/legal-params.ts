import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

const getPreavisoDaysHn = (months: number): number => {
  if (months < 3) return 1
  if (months < 6) return 7
  if (months < 12) return 14
  if (months < 24) return 30
  return 60
}

const getCesantiaDaysHn = (years: number): number => {
  if (years < 0.25) return 0
  if (years < 0.5) return 10
  if (years < 1) return 20
  return Math.min(Math.floor(years) * 30, 750)
}

export const getHondurasTerminationParams = (): TerminationParams => ({
  currency: "HNL",
  corpusVersion: "hn-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: (ctx) => {
        const preavisoDays = getPreavisoDaysHn(ctx.seniorityMonths)
        if (preavisoDays <= 1) return []
        return [
          {
            label: "Preaviso (sustitución, hasta 2 meses según antigüedad)",
            amount: ctx.dailySalary * preavisoDays,
            formula: `${ctx.dailySalary} x ${preavisoDays} días`,
            legalReference: "Código de Trabajo Art. 116",
          },
        ]
      },
      note: "La renuncia voluntaria no genera auxilio de cesantía (Art. 120).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica auxilio de cesantía (Art. 120: despido injustificado o causa ajena al trabajador).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const cesantiaDays = getCesantiaDaysHn(ctx.tenureYears)
        const preavisoDays = getPreavisoDaysHn(ctx.seniorityMonths)
        const lines = []

        if (cesantiaDays > 0) {
          lines.push(
            makeIndemnityLine(
              "Auxilio de cesantía Art. 120",
              ctx.dailySalary,
              cesantiaDays,
              "Código de Trabajo Art. 120",
            ),
          )
        }

        if (preavisoDays > 1) {
          lines.push({
            label: "Preaviso Art. 116",
            amount: ctx.dailySalary * preavisoDays,
            formula: `${ctx.dailySalary} x ${preavisoDays} días`,
            legalReference: "Código de Trabajo Art. 116",
          })
        }

        return lines
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: (ctx) => {
        const preavisoDays = getPreavisoDaysHn(ctx.seniorityMonths)
        if (preavisoDays <= 1) return []
        return [
          {
            label: "Preaviso (sustitución, hasta 2 meses según antigüedad)",
            amount: ctx.dailySalary * preavisoDays,
            formula: `${ctx.dailySalary} x ${preavisoDays} días`,
            legalReference: "Código de Trabajo Art. 116",
          },
        ]
      },
      note: "El mutuo acuerdo no genera auxilio de cesantía (Art. 120).",
    },
  ],
})
