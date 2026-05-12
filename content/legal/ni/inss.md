---
country: ni
topic: inss
version: ni-v0.2.0
status: proposed
source: "Normativa INSS vigente sobre cotizacion laboral"
last_reviewed: "2026-05-11"
---

# INSS (cotizacion laboral)

## base_legal

- Ley de Seguridad Social y reglamentacion administrativa aplicable del INSS.

## regla_operativa

- La cotizacion laboral del trabajador se aplica sobre conceptos salariales imponibles.
- En el MVP inicial, la base imponible contempla salario proporcional y vacaciones pagadas.

## formula

- `inss_laboral = base_inss * tasa_inss_laboral`

## variables

- `base_inss`
- `tasa_inss_laboral`

## supuestos

- `tasa_inss_laboral = 0.07` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## excepciones

- Conceptos no imponibles por ley no se incluyen en `base_inss`.

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos INSS.
