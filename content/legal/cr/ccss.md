---
country: cr
topic: ccss
version: cr-v0.1.0
status: proposed
source: "Ley Constitutiva de la CCSS (Ley No. 17)"
last_reviewed: "2026-05-11"
---

# CCSS (cotizacion social)

## base_legal

- Ley Constitutiva de la CCSS, Ley No. 17.
- Reglamentacion administrativa vigente.

## regla_operativa

- La cotizacion laboral del trabajador incluye seguro de salud, pension e invalidez.
- Se aplica sobre el salario ordinario y prestaciones imponibles.

## formula

- `ccss_laboral = base_ccss * tasa_ccss_laboral`

## variables

- `base_ccss`
- `tasa_ccss_laboral`

## supuestos

- `tasa_ccss_laboral = 0.0917` (9.17%: salud ~5.5% + pension ~2.84% + discapacidad ~0.83%, pendiente confirmacion legal final).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos de la CCSS.
