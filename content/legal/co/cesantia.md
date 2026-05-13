---
country: co
topic: cesantia
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo de Colombia"
last_reviewed: "2026-05-11"
---

# Cesantia

## base_legal

- Art. 249: 1 mes (30 dias) de salario por cada ano de servicio, proporcional por fraccion.
- Art. 253: Base: ultimo salario mensual o promedio del ultimo ano si hubo variaciones.
- Ley 52 de 1975: Intereses del 12% anual sobre cesantias.

## regla_operativa

- 30 dias de salario por cada ano trabajado.
- Fracciones de ano proporcionales.
- Mas intereses del 12% anual sobre el valor de las cesantias.

## formula

- `salario_diario = salario_mensual / 30`
- `cesantia = salario_diario * anos_antiguedad * 30`
- `intereses_cesantia = cesantia * 0.12`

## vigencia_fuente

- Codigo Sustantivo del Trabajo, Arts. 249, 253. Ley 52 de 1975.
