---
country: cl
topic: afp
version: cl-v0.1.0
status: proposed
source: "D.L. 3.500 (Sistema de AFP de Chile)"
last_reviewed: "2026-05-11"
---

# AFP (Administradora de Fondos de Pensiones)

## base_legal

- D.L. 3.500, Sistema de AFP.
- Cotizacion obligatoria: 10% + comision variable segun AFP (~1.5%).

## formula

- `afp_laboral = base_afp * 0.115`

## supuestos

- `tasa_afp = 0.115` (11.5%: 10% cotizacion + 1.5% comision promedio).

## vigencia_fuente

- D.L. 3.500 y normas reglamentarias.
