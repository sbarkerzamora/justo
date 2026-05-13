---
country: mx
topic: aguinaldo
version: mx-v0.1.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Art. 87: Derecho a 15 dias de salario como aguinaldo minimo.
- Se paga antes del 20 de diciembre de cada ano.

## regla_operativa

- 15 dias de salario por cada ano de servicio.
- Proporcional al tiempo trabajado al terminar la relacion laboral.
- Base: salario diario ordinario.

## formula

- `salario_diario = salario_mensual / 30`
- `aguinaldo_proporcional = salario_diario * 15 * (dias_periodo / 365)`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Art. 87.
