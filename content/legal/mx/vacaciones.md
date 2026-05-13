---
country: mx
topic: vacaciones
version: mx-v0.1.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 76: 6 dias de vacaciones al cumplir 1 ano de servicio.
- Art. 77: +2 dias por cada ano hasta llegar a 12.
- Art. 78: Despues del 4to ano, +2 cada 5 anos.
- Art. 80: Prima vacacional minima del 25% sobre salario de vacaciones.

## regla_operativa

- 1 ano: 6 dias. 2 anos: 8. 3 anos: 10. 4 anos: 12.
- Prima vacacional del 25% sobre el monto de vacaciones.
- Se pagan vacaciones no gozadas al cierre.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_vacaciones = calcular_segun_escala(anos_antiguedad)`
- `vacaciones_pendientes = salario_diario * dias_vacaciones * 1.25`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Arts. 76, 77, 78, 80.
