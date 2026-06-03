import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getColombiaTerminationParams = (): TerminationParams => ({
  currency: "COP",
  corpusVersion: "co-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: () => [],
      note: "La renuncia voluntaria no genera indemnización (Art. 64: terminación unilateral sin justa causa por el empleador).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización si el empleador prueba la justa causa (Art. 64).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const baseDays = 30
        const extraDays = Math.max(ctx.fullYears - 1, 0) * 20
        const totalDays = baseDays + extraDays

        return [
          makeIndemnityLine(
            "Indemnización Art. 64 (30 días base + 20 días/año adicional, salario <10 SMMLV)",
            ctx.dailySalary,
            totalDays,
            "CST Art. 64",
          ),
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: () => [],
      note: "El mutuo acuerdo no genera indemnización (Art. 64).",
    },
  ],
})
