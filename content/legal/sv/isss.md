---
country: sv
topic: isss
version: sv-v0.1.0
status: proposed
source: "Ley del Seguro Social de El Salvador"
last_reviewed: "2026-05-11"
---

# ISSS (cotizacion laboral)

## base_legal

- Ley del Seguro Social de El Salvador.
- Reglamento de aplicacion del ISSS.

## regla_operativa

- La cotizacion laboral del trabajador se aplica sobre el salario ordinario.

## formula

- `isss_laboral = base_isss * tasa_isss_laboral`

## variables

- `base_isss`
- `tasa_isss_laboral`

## supuestos

- `tasa_isss_laboral = 0.03` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del ISSS.
