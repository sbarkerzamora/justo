---
country: mx
topic: imss
version: mx-v0.1.0
status: proposed
source: "Ley del Seguro Social (LSS) de Mexico"
last_reviewed: "2026-05-11"
---

# IMSS (cotizacion laboral)

## base_legal

- Ley del Seguro Social de Mexico.
- Reglamento de afiliacion y cotizacion del IMSS.

## regla_operativa

- La cotizacion laboral del trabajador cubre seguro de enfermedades, maternidad, invalidez y vida.
- Se aplica sobre el salario base de cotizacion (salario diario integrado).

## formula

- `imss_laboral = base_imss * tasa_imss_laboral`

## variables

- `base_imss`
- `tasa_imss_laboral`

## supuestos

- `tasa_imss_laboral = 0.025` (2.5%, set normativo propuesto. Incluye prestaciones en especie y dinero del seguro de enfermedades ~1.5% + invalidez y vida ~0.625% + cesantia ~0.375%. Pendiente confirmacion legal final en produccion.)

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del IMSS y LSS.
