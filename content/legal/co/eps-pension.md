---
country: co
topic: eps-pension
version: co-v0.1.0
status: proposed
source: "Ley 100 de 1993 (Sistema de Seguridad Social)"
last_reviewed: "2026-05-11"
---

# EPS y Pension (seguridad social)

## base_legal

- Ley 100 de 1993, Sistema de Seguridad Social Integral.
- EPS (salud): ~4% trabajador.
- AFP/Pension: ~4% trabajador.
- Total aporte trabajador: ~8%.

## formula

- `eps_laboral = base_eps * 0.04`
- `pension_laboral = base_pension * 0.04`
- `total_seguridad_social = eps_laboral + pension_laboral`

## supuestos

- `tasa_eps = 0.04` (4% para salud)
- `tasa_pension = 0.04` (4% para pension)
- Tasas propuestas pendientes confirmacion legal final.

## vigencia_fuente

- Ley 100 de 1993 y normas reglamentarias.
