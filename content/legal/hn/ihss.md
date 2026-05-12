---
country: hn
topic: ihss
version: hn-v0.1.0
status: proposed
source: "Ley del IHSS y reglamentacion administrativa vigente"
last_reviewed: "2026-05-11"
---

# IHSS (cotizacion laboral)

## base_legal

- Ley del Instituto Hondureño de Seguridad Social.
- Reglamento de aplicación del IHSS.

## regla_operativa

- La cotizacion laboral del trabajador se aplica sobre el salario ordinario.

## formula

- `ihss_laboral = base_ihss * tasa_ihss_laboral`

## variables

- `base_ihss`
- `tasa_ihss_laboral`

## supuestos

- `tasa_ihss_laboral = 0.035` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del IHSS.
