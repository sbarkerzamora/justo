---
country: pe
topic: indemnizacion
version: pe-v0.1.0
status: proposed
source: "Ley General de Trabajo de Peru"
last_reviewed: "2026-05-11"
---

# Indemnizacion por despido arbitrario

## base_legal

- Art. 167: Indemnizacion escalonada segun anos de servicio.

## regla_operativa

- Anos 1 a 8: 45 dias de remuneracion ordinaria por cada ano.
- Anos 9 a 16: 30 dias por cada ano.
- Anos 17 en adelante: 15 dias por cada ano.
- Maximo: 720 dias (24 meses).
- Minimo: 90 dias.

## formula

- `salario_diario = salario_mensual / 30`
- `tramo1 = min(anos, 8) * 45`
- `tramo2 = max(min(anos - 8, 8), 0) * 30`
- `tramo3 = max(anos - 16, 0) * 15`
- `dias_indemnizacion = min(max(tramo1 + tramo2 + tramo3, 90), 720)`
- `indemnizacion = salario_diario * dias_indemnizacion`

## vigencia_fuente

- Ley General de Trabajo de Peru, Art. 167.
