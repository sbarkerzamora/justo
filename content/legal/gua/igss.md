---
country: gt
topic: igss
version: gt-v0.1.0
status: proposed
source: "Ley del IGSS y reglamentacion administrativa vigente"
last_reviewed: "2026-05-11"
---

# IGSS (cotizacion laboral)

## base_legal

- Ley del Instituto Guatemalteco de Seguridad Social.
- Acuerdo 1124 de la Junta Directiva del IGSS.

## regla_operativa

- La cotizacion laboral del trabajador se aplica sobre el salario ordinario.

## formula

- `igss_laboral = base_igss * tasa_igss_laboral`

## variables

- `base_igss`
- `tasa_igss_laboral`

## supuestos

- `tasa_igss_laboral = 0.0483` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del IGSS.
