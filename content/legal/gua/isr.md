---
country: gt
topic: isr
version: gt-v0.1.0
status: proposed
source: "Ley del ISR y disposiciones vigentes"
last_reviewed: "2026-05-11"
---

# ISR (rentas del trabajo)

## base_legal

- Ley del Impuesto Sobre la Renta.
- Disposiciones vigentes para retencion de ISR sobre rentas del trabajo.

## regla_operativa

- El ISR se aplica sobre la renta imponible despues de deducciones permitidas.
- En el MVP inicial se usa una tasa simplificada documentada y revisable.

## formula

- `isr_laboral = max(base_isr, 0) * tasa_isr`

## variables

- `base_isr`
- `tasa_isr`

## supuestos

- `tasa_isr = 0.05` (set normativo propuesto, pendiente confirmacion con tabla progresiva oficial).

## vigencia_fuente

- Requiere confirmacion de tabla anual vigente antes de uso productivo.
