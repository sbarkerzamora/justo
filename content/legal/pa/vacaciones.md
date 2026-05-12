---
country: pa
topic: vacaciones
version: pa-v0.1.0
status: proposed
source: "Codigo de Trabajo de Panama"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 54: 30 dias de vacaciones por cada 11 meses de trabajo continuo.
- Tasa: 1 dia por cada 11 dias trabajados.

## regla_operativa

- 30 dias de vacaciones remuneradas por cada 11 meses de servicio.
- Al terminar la relacion, se pagan proporcionalmente.
- Base: promedio ordinario + extraordinario ultimos 11 meses.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Panama, Art. 54.
