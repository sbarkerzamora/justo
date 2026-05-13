---
country: co
topic: prima-servicios
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo de Colombia"
last_reviewed: "2026-05-11"
---

# Prima de Servicios

## base_legal

- Art. 306: 30 dias de salario por ano, pagaderos en dos cuotas.
- Art. 307: La prima no constituye salario.

## regla_operativa

- 30 dias de salario por cada ano de servicio.
- Primera cuota: 15 dias pagaderos a mas tardar el 30 de junio.
- Segunda cuota: 15 dias pagaderos a mas tardar el 20 de diciembre.
- Al terminar la relacion, se paga proporcional al tiempo laborado en el semestre.

## formula

- `salario_diario = salario_mensual / 30`
- `prima_proporcional = salario_diario * 15 * (dias_semestre / 181) * 2`

## vigencia_fuente

- Codigo Sustantivo del Trabajo, Arts. 306, 307.
