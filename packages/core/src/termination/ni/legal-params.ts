import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getNicaraguaTerminationParams = (): TerminationParams => ({
  currency: "NIO",
  corpusVersion: "ni-v0.3.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: () => [],
      note: "No genera indemnización Art. 45. Conserva derecho a prestaciones proporcionales (Art. 43).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización (Art. 45: rescindir sin causa justificada).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const firstTramoDays = Math.min(ctx.fullYears, 3) * 30
        const secondTramoDays = Math.max(ctx.fullYears - 3, 0) * 20
        const totalDays = Math.min(150, Math.max(30, firstTramoDays + secondTramoDays))

        const fractionalDays =
          ctx.tenureYears - ctx.fullYears > 0
            ? Math.round((ctx.tenureYears - ctx.fullYears) * totalDays)
            : 0
        const effectiveDays = Math.min(150, Math.max(30, totalDays + fractionalDays))

        return [
          makeIndemnityLine(
            "Indemnización Art. 45 (30/20 días por año)",
            ctx.dailySalary,
            effectiveDays,
            "Ley 185 Arts. 42, 43 y 45",
          ),
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: () => [],
      note: "No genera indemnización Art. 45. Conserva derecho a prestaciones proporcionales (Art. 43).",
    },
  ],
})
