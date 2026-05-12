---
country: sv
topic: indemnizacion
version: sv-v0.1.0
status: proposed
source: "Codigo de Trabajo de El Salvador"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Cesantia)

## base_legal

- Art. 58: Indemnizacion por despido injustificado en contrato por tiempo indeterminado.
- Art. 59: Indemnizacion en contrato a plazo fijo.

## regla_operativa

- 30 dias de salario por cada ano de servicio.
- Fracciones de ano se pagan proporcionalmente.
- Minimo: 15 dias de salario.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = max(anos_antiguedad * 30, 15)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## vigencia_fuente

- Codigo de Trabajo de El Salvador, Arts. 58 y 59.
