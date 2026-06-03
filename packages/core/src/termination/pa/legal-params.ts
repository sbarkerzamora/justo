import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getPanamaTerminationParams = (): TerminationParams => ({
  currency: "USD",
  corpusVersion: "pa-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: (ctx) => {
        const primaDays = Math.floor(ctx.tenureYears) * 7
        if (primaDays <= 0) return []
        return [
          makeIndemnityLine(
            "Prima de antigüedad Art. 224 (7 días por año)",
            ctx.dailySalary,
            primaDays,
            "Código de Trabajo Art. 224",
          ),
        ]
      },
      note: "La prima de antigüedad aplica a toda terminación, incluyendo renuncia.",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "La indemnización Art. 225 aplica solo a despido injustificado. Prima Art. 224 sigue aplicando.",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const lines = []
        const fullYrs = Math.floor(ctx.tenureYears)

        const primaDays = fullYrs * 7
        if (primaDays > 0) {
          lines.push(
            makeIndemnityLine(
              "Prima de antigüedad Art. 224 (7 días por año)",
              ctx.dailySalary,
              primaDays,
              "Código de Trabajo Art. 224",
            ),
          )
        }

        const firstTen = Math.min(fullYrs, 10) * 23.8
        const afterTen = Math.max(fullYrs - 10, 0) * 7
        const indemnDays = Math.round(firstTen + afterTen)
        if (indemnDays > 0) {
          lines.push({
            label: "Indemnización Art. 225 (23.8 días/año primeros 10, luego 7 días/año)",
            amount: ctx.dailySalary * indemnDays,
            formula: `${ctx.dailySalary} x (min(${fullYrs},10)×23.8 + max(${fullYrs}-10,0)×7) días`,
            legalReference: "Código de Trabajo Art. 225",
          })
        }

        return lines
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: (ctx) => {
        const primaDays = Math.floor(ctx.tenureYears) * 7
        if (primaDays <= 0) return []
        return [
          makeIndemnityLine(
            "Prima de antigüedad Art. 224 (7 días por año)",
            ctx.dailySalary,
            primaDays,
            "Código de Trabajo Art. 224",
          ),
        ]
      },
      note: "La prima de antigüedad aplica a toda terminación.",
    },
  ],
})
