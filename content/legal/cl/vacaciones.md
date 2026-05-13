---
country: cl
topic: vacaciones
version: cl-v0.1.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Vacaciones (Feriado anual)

## base_legal

- Art. 67: 15 dias habiles de vacaciones por cada ano.
- Art. 68: Feriado progresivo: +1 dia cada 3 anos desde 10 anos.
- Art. 73: Proporcional al terminar la relacion.

## formula

- `dias_adicionales = max(0, floor((anos_antiguedad - 10) / 3))`
- `total_dias_escala = 15 + dias_adicionales`
- `vacaciones = (salario/30) * min(dias_pendientes, total_dias_escala)`

## vigencia_fuente

- Codigo del Trabajo de Chile, Arts. 67, 68, 73.
