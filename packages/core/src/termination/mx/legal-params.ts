import type { TerminationParams } from "../shared"
import { makeIndemnityLine } from "../shared"

export const getMexicoTerminationParams = (): TerminationParams => ({
  currency: "MXN",
  corpusVersion: "mx-v0.2.0",
  scenarios: [
    {
      type: "renuncia",
      applicable: true,
      buildLines: (ctx) => {
        if (ctx.fullYears < 15) return []
        const primaDays = ctx.fullYears * 12
        return [
          makeIndemnityLine(
            "Prima de antigüedad Art. 162 (12 días por año, solo si ≥15 años)",
            ctx.dailySalary,
            primaDays,
            "LFT Art. 162",
          ),
        ]
      },
      note: "Prima de antigüedad solo aplica si renuncia con ≥15 años de servicio.",
    },
    {
      type: "despido_justificado",
      applicable: false,
      note: "No aplica indemnización si el patrón comprueba la causa de rescisión (Arts. 48 y 50 LFT).",
    },
    {
      type: "despido_injustificado",
      applicable: true,
      buildLines: (ctx) => {
        const indConst = 90
        const indAnual = ctx.fullYears * 12
        const prima = ctx.fullYears * 12

        return [
          makeIndemnityLine(
            "Indemnización constitucional Art. 48 (3 meses)",
            ctx.dailySalary,
            indConst,
            "LFT Art. 48",
          ),
          {
            label: "Indemnización anual Art. 50 (12 días por año)",
            amount: ctx.dailySalary * indAnual,
            formula: `${ctx.dailySalary} x ${ctx.fullYears} × 12 días`,
            legalReference: "LFT Art. 50",
          },
          {
            label: "Prima de antigüedad Art. 162 (12 días por año)",
            amount: ctx.dailySalary * prima,
            formula: `${ctx.dailySalary} x ${ctx.fullYears} × 12 días`,
            legalReference: "LFT Art. 162",
          },
        ]
      },
    },
    {
      type: "mutuo_acuerdo",
      applicable: true,
      buildLines: (ctx) => {
        if (ctx.fullYears < 15) return []
        const primaDays = ctx.fullYears * 12
        return [
          makeIndemnityLine(
            "Prima de antigüedad Art. 162 (12 días por año, solo si ≥15 años)",
            ctx.dailySalary,
            primaDays,
            "LFT Art. 162",
          ),
        ]
      },
      note: "Prima de antigüedad solo aplica si ≥15 años de servicio.",
    },
  ],
})
