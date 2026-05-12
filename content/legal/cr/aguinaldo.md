---
country: cr
topic: aguinaldo
version: cr-v0.1.0
status: proposed
source: "Ley No. 2412, Ley del Aguinaldo de Costa Rica"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Ley No. 2412, Ley del Aguinaldo.
- Equivalente a 1/12 de salarios anuales.

## regla_operativa

- El aguinaldo equivale a 1/12 del total de salarios devengados en el ano.
- Al finalizar la relacion, se paga proporcional al periodo trabajado.
- Debe pagarse antes del 20 de diciembre.

## formula

- `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365) * (1/12) * 12`
- Simplificado: `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`

## vigencia_fuente

- Ley No. 2412.
