---
country: mx
topic: indemnizacion
version: mx-v0.1.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Indemnizacion

## base_legal

- Art. 48: Indemnizacion constitucional de 3 meses de salario por despido injustificado.
- Art. 50: Indemnizacion adicional de 12 dias de salario por cada ano de servicio (reforma 2019).
- Art. 162: Prima de antiguedad de 12 dias por ano, tope de 2 salarios minimos.

## regla_operativa

- Indemnizacion constitucional: 3 meses de salario (90 dias).
- Indemnizacion por anos: 12 dias de salario por cada ano trabajado.
- Prima de antiguedad: 12 dias de salario por ano, con tope de 2 salarios minimos.
- En el MVP se usa el salario mensual sin aplicar el tope del salario minimo (pendiente integracion de UMA/salario minimo regional).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion_constitucional = salario_diario * 90`
- `indemnizacion_anual = salario_diario * anos_antiguedad * 12`
- `prima_antiguedad = salario_diario * anos_antiguedad * 12`
- `total_indemnizacion = indemnizacion_constitucional + indemnizacion_anual + prima_antiguedad`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Arts. 48, 50, 162.
