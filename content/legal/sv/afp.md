---
country: sv
topic: afp
version: sv-v0.1.0
status: proposed
source: "Ley del Sistema de Ahorro para Pensiones (SAP)"
last_reviewed: "2026-05-11"
---

# AFP (cotizacion previsional)

## base_legal

- Ley del Sistema de Ahorro para Pensiones (Decreto 927).
- Reglamentacion administrativa vigente de las AFP.

## regla_operativa

- La cotizacion previsional del trabajador se aplica sobre el salario ordinario.

## formula

- `afp_laboral = base_afp * tasa_afp_laboral`

## variables

- `base_afp`
- `tasa_afp_laboral`

## supuestos

- `tasa_afp_laboral = 0.0725` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del SAP.
