---
country: pa
topic: indemnizacion
version: pa-v0.1.0
status: proposed
source: "Codigo de Trabajo de Panama"
last_reviewed: "2026-05-11"
---

# Indemnizacion y Prima de Antiguedad

## base_legal

- Art. 224: Prima de antiguedad (1 semana/ano, toda terminacion).
- Art. 225: Indemnizacion por despido injustificado.
- Art. 212: Preaviso (30 dias para trabajadores exceptuados).

## regla_operativa

- Prima de antiguedad (Art. 224): 7 dias de salario por cada ano, proporcional.
- Indemnizacion (Art. 225-C): 3.4 semanas/ano primeros 10 anos, luego 1 semana/ano.
- Minimo indemnizacion: 1 semana.

## formula

- `salario_diario = salario_mensual / 30`
- `prima_antiguedad = salario_diario * anos_antiguedad * 7`
- `indemnizacion = salario_diario * (min(anos, 10) * 23.8 + max(anos - 10, 0) * 7)`

## vigencia_fuente

- Codigo de Trabajo de Panama, Arts. 224, 225, 212.
