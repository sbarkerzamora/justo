---
country: sv
topic: aguinaldo
version: sv-v0.1.0
status: proposed
source: "Codigo de Trabajo de El Salvador"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Art. 196: Obligacion de pago de aguinaldo anual.
- Art. 197: Pago completo (1 ano o mas) o proporcional (menos de 1 ano).
- Art. 198: Monto minimo escalonado segun antiguedad.
- Art. 199: Base de calculo segun tipo de salario.
- Art. 202: Pago proporcional al terminar relacion laboral.

## regla_operativa

- 1 a 3 anos: 15 dias de salario.
- 3 a 10 anos: 19 dias de salario.
- 10 anos o mas: 21 dias de salario.
- Al terminar la relacion, se paga proporcional al periodo trabajado en el ano.

## formula

- `aguinaldo_proporcional = (salario_mensual / 30) * dias_aguinaldo_segun_escala * (dias_periodo / 365)`
- donde `dias_aguinaldo_segun_escala` = 15, 19 o 21 segun anios de servicio

## variables

- `salario_mensual`
- `anos_antiguedad`
- `dias_periodo`

## vigencia_fuente

- Codigo de Trabajo de El Salvador, Arts. 196, 197, 198, 199, 202.
