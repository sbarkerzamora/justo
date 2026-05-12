---
country: sv
topic: vacaciones
version: sv-v0.1.0
status: proposed
source: "Codigo de Trabajo de El Salvador"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 177: 15 dias de vacaciones despues de 1 ano, con prima del 30%.
- Art. 187: Pago proporcional al terminar la relacion laboral.

## regla_operativa

- 15 dias de vacaciones remuneradas por cada ano de servicio.
- Prima del 30% sobre el salario ordinario.
- Se pagan vacaciones no gozadas al cierre de la relacion.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes * 1.30`

## variables

- `salario_mensual`
- `dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de El Salvador, Arts. 177 y 187.
