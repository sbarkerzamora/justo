---
country: hn
topic: vacaciones
version: hn-v0.1.0
status: proposed
source: "Codigo de Trabajo de Honduras, Decreto 189-59"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 346: Dias de vacaciones segun anos de servicio.
- Art. 349: Al terminar, se pagan vacaciones no gozadas.
- Art. 352: Base de calculo = promedio ordinario ultimos 6 meses.

## regla_operativa

- 1 ano: 10 dias habiles.
- 2 anos: 12 dias habiles.
- 3 anos: 15 dias habiles.
- 4 anos o mas: 20 dias habiles.
- Se pagan vacaciones pendientes no gozadas al cierre.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## variables

- `salario_mensual`
- `dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Honduras, Decreto 189-59, Arts. 346, 349, 352.
