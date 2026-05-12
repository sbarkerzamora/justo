---
country: sv
topic: deducciones
version: sv-v0.1.0
status: proposed
source: "Codigo de Trabajo Art. 132 + normativa ISSS y AFP vigente"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 132: Tope maximo de deducciones del 20% del salario.
- Normativa ISSS vigente: cotizacion de salud.
- Normativa AFP vigente: cotizacion previsional.

## regla_operativa

- Solo se aplican deducciones permitidas legalmente.
- ISSS + AFP no pueden exceder el 20% del salario.

## formula

- `isss_laboral = base_isss * tasa_isss_laboral`
- `afp_laboral = base_afp * tasa_afp_laboral`

## variables

- `base_isss`
- `tasa_isss_laboral`
- `base_afp`
- `tasa_afp_laboral`

## supuestos

- Tasas cargadas desde `isss.md` y `afp.md`.

## vigencia_fuente

- Codigo de Trabajo Art. 132 + normativa ISSS y AFP vigente.
