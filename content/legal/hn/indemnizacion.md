---
country: hn
topic: indemnizacion
version: hn-v0.1.0
status: proposed
source: "Codigo de Trabajo de Honduras, Decreto 189-59"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Auxilio de Cesantia)

## base_legal

- Art. 120: Auxilio de cesantia por antiguedad.
- Art. 116: Preaviso segun tiempo de servicio.
- Art. 123(b): Base de calculo = promedio salarial ultimos 6 meses.

## regla_operativa

- 3 a 6 meses: 10 dias de salario.
- 6 a 12 meses: 20 dias de salario.
- 1 ano o mas: 1 mes de salario por cada ano trabajado.
- Fracciones de ano se pagan proporcionalmente.
- Maximo: 25 meses de salario.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = min(anos_antiguedad * 30, 750)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## vigencia_fuente

- Codigo de Trabajo de Honduras, Decreto 189-59, Art. 116, 120, 123.
