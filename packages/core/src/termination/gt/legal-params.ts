import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getGuatemalaTerminationParams = (): TerminationParams => ({
  currency: "GTQ",
  corpusVersion: "gt-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: (ctx) => {
        const days = Math.min(ctx.fullYears * 30, 240)
        return [
          makeIndemnityLine(
            "Indemnización Art. 82 (30 días por año, máximo 240 días)",
            ctx.dailySalary,
            days,
            "Decreto 1441 Arts. 78 y 82",
          ),
        ]
      },
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "Si el empleador no prueba la causa justa, aplica indemnización Art. 82 (despido injustificado).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const days = Math.min(ctx.fullYears * 30, 240)
        const lines = [
          makeIndemnityLine(
            "Indemnización Art. 82 (30 días por año, máximo 240 días)",
            ctx.dailySalary,
            days,
            "Decreto 1441 Arts. 78 y 82",
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
      applicable: true,
      buildLines: (ctx) => {
        const days = Math.min(ctx.fullYears * 30, 240)
        return [
          makeIndemnityLine(
            "Indemnización Art. 82 (30 días por año, máximo 240 días)",
            ctx.dailySalary,
            days,
            "Decreto 1441 Arts. 78 y 82",
          ),
        ]
      },
    },
  ],
})
