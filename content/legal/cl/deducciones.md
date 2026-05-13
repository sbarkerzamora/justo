---
country: cl
topic: deducciones
version: cl-v0.1.0
status: proposed
source: "DL 3.500 + Ley 18.933 + Ley 19.728"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 58: Empleador debe deducir cotizaciones de seguridad social.
- D.L. 3.500: AFP (11.5%).
- Ley 18.933: Salud FONASA/ISAPRE (7%).
- Ley 19.728: Seguro de Cesantia AFC (0.6%).

## formula

- `afp_laboral = base_afp * tasa_afp`
- `salud_laboral = base_salud * tasa_salud`
- `afc_laboral = base_afc * tasa_afc`
- `total = afp_laboral + salud_laboral + afc_laboral`

## variables

- `base_afp`
- `tasa_afp`
- `base_salud`
- `tasa_salud`
- `base_afc`
- `tasa_afc`

## supuestos

- `tasa_afp = 0.115` (11.5%: 10% cotizacion + 1.5% comision promedio, D.L. 3.500, pendiente confirmacion).
- `tasa_salud = 0.07` (7% FONASA/ISAPRE, Ley 18.933).
- `tasa_afc = 0.006` (0.6% Seguro Cesantia, Ley 19.728).

## excepciones

- Indemnizacion por anos de servicio no integra base de cotizaciones previsionales.
- Tope imponible de AFP y Salud (80,2 UF) no aplicado en MVP.

## vigencia_fuente

- Codigo del Trabajo Art. 58 + DL 3.500 + Ley 18.933 + Ley 19.728.
