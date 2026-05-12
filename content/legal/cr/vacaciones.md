---
country: cr
topic: vacaciones
version: cr-v0.1.0
status: proposed
source: "Codigo de Trabajo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 153: 2 semanas (14 dias) por cada 50 semanas de servicio.
- Art. 156: No compensables en dinero, excepto al terminar la relacion.

## regla_operativa

- 14 dias de vacaciones remuneradas por cada 50 semanas de trabajo.
- Al terminar antes de completar 50 semanas: 1 dia por mes trabajado.
- Base: promedio ordinario de ultimas 50 semanas.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Costa Rica, Arts. 153, 156.
