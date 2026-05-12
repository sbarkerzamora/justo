---
country: ni
topic: vacaciones
version: ni-v0.2.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Vacaciones

## base_legal

- Art. 76: 15 dias de vacaciones por cada 6 meses de trabajo ininterrumpido.
- Art. 77: al terminar, se pagan salarios y prestaciones proporcionales acumuladas.
- Art. 78: vacaciones se pagan con base en ultimo salario ordinario (o promedio ultimos 6 meses si variable).

## regla_operativa

- Se liquida vacaciones pendientes no gozadas al cierre de relacion laboral.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## variables

- `salario_mensual`
- `dias_vacaciones_pendientes`

## supuestos

- El usuario declara los dias pendientes, y el motor los valida en rango permitido por politica del producto.

## excepciones

- Si el salario es variable, debe usarse promedio ordinario de ultimos 6 meses.

## vigencia_fuente

- Ley No. 185, Arts. 76, 77, 78.
