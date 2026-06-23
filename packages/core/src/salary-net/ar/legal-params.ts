// Tope maximo imponible ANSES (2025, actualizar periodicamente - cambia con inflacion)
const ANSES_MAX_BASE = 2500000 // ~$2,500,000 ARS/mes (Resolucion ANSES vigente)

export const getArgentinaSalaryNetLegalRates = () => {
  return {
    jubilacionRate: 0.11,
    pamiRate: 0.03,
    obraSocialRate: 0.03,
    ansesMaxBase: ANSES_MAX_BASE,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 15750000, rate: 0.05 },
      { from: 30750000, rate: 0.09 },
      { from: 45750000, rate: 0.12 },
      { from: 60750000, rate: 0.15 },
      { from: 90750000, rate: 0.19 },
      { from: 130750000, rate: 0.23 },
      { from: 180750000, rate: 0.27 },
      { from: 260750000, rate: 0.31 },
      { from: 380750000, rate: 0.35 },
    ],
  }
}
