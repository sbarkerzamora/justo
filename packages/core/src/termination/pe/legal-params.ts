import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getPeruTerminationParams = (): TerminationParams => ({
  currency: "PEN",
  corpusVersion: "pe-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: () => [],
      note: "La renuncia voluntaria no genera indemnización (Art. 167: despido injustificado).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización (Art. 167: despido injustificado).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const tramo1 = Math.min(ctx.fullYears, 8) * 45
        const tramo2 = Math.max(Math.min(ctx.fullYears - 8, 8), 0) * 30
        const tramo3 = Math.max(ctx.fullYears - 16, 0) * 15
        const totalDays = Math.min(Math.max(tramo1 + tramo2 + tramo3, 90), 720)

        return [
          makeIndemnityLine(
            "Indemnización Art. 167 (escala 45/30/15 días por año, min 90, max 720 días)",
            ctx.dailySalary,
            totalDays,
            "Ley General de Trabajo Art. 167",
          ),
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: () => [],
      note: "El mutuo acuerdo no genera indemnización (Art. 167).",
    },
  ],
})
