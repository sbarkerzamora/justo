---
country: hn
topic: deducciones
version: hn-v0.1.0
status: proposed
source: "Codigo de Trabajo Decreto 189-59 + normativa IHSS vigente"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 667 (Art. 95.5): Deducciones solo permitidas por ley, orden judicial o autorizacion escrita.
- Normativa IHSS vigente: cotizacion laboral aplicable.

## regla_operativa

- Solo se aplican deducciones permitidas legalmente.
- Aguinaldo proporcional no integra base imponible de deducciones.

## formula

- `ihss_laboral = base_ihss * tasa_ihss_laboral`

## variables

- `base_ihss`
- `tasa_ihss_laboral`

## supuestos

- Tasa IHSS cargada desde `ihss.md`.

## vigencia_fuente

- Codigo de Trabajo Art. 667 + normativa IHSS vigente.
