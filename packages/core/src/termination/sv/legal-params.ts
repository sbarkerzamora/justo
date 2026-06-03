import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getElSalvadorTerminationParams = (): TerminationParams => ({
  currency: "USD",
  corpusVersion: "sv-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: () => [],
      note: "La renuncia voluntaria no genera indemnización (Art. 58 aplica solo a despido injustificado).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización (Art. 58: despido sin causa justificada).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const days = Math.max(ctx.fullYears * 30, 15)
        return [
          makeIndemnityLine(
            "Indemnización Art. 58 (30 días por año, mínimo 15 días)",
            ctx.dailySalary,
            days,
            "Código de Trabajo Art. 58",
          ),
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: () => [],
      note: "El mutuo acuerdo no genera indemnización (Art. 58 aplica solo a despido injustificado).",
    },
  ],
})
