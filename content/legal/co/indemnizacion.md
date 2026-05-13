---
country: co
topic: indemnizacion
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo de Colombia"
last_reviewed: "2026-05-11"
---

# Indemnizacion por Despido Sin Justa Causa

## base_legal

- Art. 64: Indemnizacion escalonada segun salario y antiguedad.

## regla_operativa

- Salario menor a 10 SMMLV:
  - Primer ano: 30 dias de salario.
  - Anos adicionales: 20 dias por cada ano.
- Salario mayor o igual a 10 SMMLV:
  - Primer ano: 20 dias de salario.
  - Anos adicionales: 15 dias por cada ano.
- En el MVP se usa el tramo de menor salario (<10 SMMLV).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion = salario_diario * (30 + max(anos_antiguedad - 1, 0) * 20)`

## vigencia_fuente

- Codigo Sustantivo del Trabajo de Colombia, Art. 64.
