---
country: ni
topic: salario-proporcional
version: ni-v0.2.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Salario Proporcional

## base_legal

- Art. 42: pago de prestaciones y conceptos proporcionales al cierre.
- Arts. 81, 84, 86: definicion de salario, salario ordinario y pago.

## regla_operativa

- Se liquida salario pendiente del periodo en curso al momento de la salida.

## formula

- `salario_diario = salario_mensual / 30`
- `salario_proporcional = salario_diario * dias_salario_pendiente`

## variables

- `salario_mensual`
- `dias_salario_pendiente`

## supuestos

- El MVP usa una captura explicita de dias pendientes para evitar ambiguedad de calendario de pago.

## excepciones

- Si existe salario variable o esquema mixto, se debe aplicar promedio ordinario conforme reglas internas definidas por politica laboral vigente.

## vigencia_fuente

- Ley No. 185, Arts. 42, 81, 84, 86.
