import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getChileTerminationParams = (): TerminationParams => ({
  currency: "CLP",
  corpusVersion: "cl-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: () => [],
      note: "La renuncia voluntaria no genera indemnización por años de servicio (Arts. 161-163).",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización (Art. 163: necesidades de empresa o causales Art. 160).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const extraHalfYear = ctx.tenureYears - ctx.fullYears >= 0.5 ? 1 : 0
        const indemnYears = Math.min(ctx.fullYears + extraHalfYear, 11)
        const indemnDays = indemnYears * 30

        return [
          makeIndemnityLine(
            "Indemnización Art. 163 (30 días por año, fracción >6 meses = año, máximo 330 días)",
            ctx.dailySalary,
            indemnDays,
            "Código del Trabajo Art. 163",
          ),
          {
            label: "Indemnización sustitutiva del aviso previo Art. 162",
            amount: ctx.monthlySalary,
            formula: `${ctx.monthlySalary} (1 mes)`,
            legalReference: "Código del Trabajo Arts. 161-162",
          },
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: () => [],
      note: "El mutuo acuerdo no genera indemnización (Arts. 161-163).",
    },
  ],
})
