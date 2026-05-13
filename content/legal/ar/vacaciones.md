---
country: ar
topic: vacaciones
version: ar-v0.1.0
status: proposed
source: "Ley 20.744 de Contrato de Trabajo"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 150: Dias de vacaciones segun antiguedad.
- Art. 151: Requisito minimo de dias trabajados.
- Art. 153: Proporcional al tiempo trabajado.
- Art. 155: Pago a salario dividido 25 por dia.

## regla_operativa

- 0 a 5 anos: 14 dias.
- 5 a 10 anos: 21 dias.
- 10 a 20 anos: 28 dias.
- 20 anos o mas: 35 dias.
- Pago: salario_mensual / 25 por dia (no /30).
- Proporcional al tiempo trabajado al terminar la relacion.

## formula

- `salario_vacacional = salario_mensual / 25`
- `vacaciones_pendientes = salario_vacacional * dias_vacaciones_pendientes`

## vigencia_fuente

- Ley 20.744, Arts. 150, 151, 153, 155.
