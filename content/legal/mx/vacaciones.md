---
country: mx
topic: vacaciones
version: mx-v0.2.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 76: 6 dias de vacaciones al cumplir 1 ano de servicio.
- Art. 77: +2 dias por cada ano hasta llegar a 12.
- Art. 78: Despues del 4to ano, +2 cada 5 anos.
- Art. 80: Prima vacacional minima del 25% sobre salario de vacaciones.

## texto_legal

**Artículo 76.-** Los trabajadores que tengan más de un año de servicios disfrutarán de un período anual de vacaciones pagadas, que en ningún caso podrá ser inferior a seis días laborables, y que aumentará en dos días laborables, hasta llegar a doce, por cada año subsecuente de servicios.

Después del cuarto año, el período de vacaciones aumentará en dos días por cada cinco de servicios.

**Artículo 77.-** Los trabajadores que presten servicios discontinuos y los de temporada tendrán derecho a un período anual de vacaciones, en proporción al número de días de trabajos en el año.

**Artículo 78.-** Los trabajadores deberán disfrutar en forma continua seis días de vacaciones, por lo menos.

**Artículo 80.-** Los trabajadores tendrán derecho a una prima no menor de veinticinco por ciento sobre los salarios que les correspondan durante el período de vacaciones.

## regla_operativa

- 1 ano: 6 dias. 2 anos: 8. 3 anos: 10. 4 anos: 12.
- Prima vacacional del 25% sobre el monto de vacaciones.
- Se pagan vacaciones no gozadas al cierre.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_vacaciones = calcular_segun_escala(anos_antiguedad)`
- `vacaciones_pendientes = salario_diario * dias_vacaciones * 1.25`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Arts. 76, 77, 78, 80.

## alcance_documental

- País: México.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `1044_Ley_Federal_del_Trabajo.md` (Ley Federal del Trabajo).
- Fuente declarada del resumen: Ley Federal del Trabajo de Mexico.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 76: 6 dias de vacaciones al cumplir 1 ano de servicio.
- Art. 77: +2 dias por cada ano hasta llegar a 12.
- Art. 78: Despues del 4to ano, +2 cada 5 anos.
- Art. 80: Prima vacacional minima del 25% sobre salario de vacaciones.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- días de vacaciones pendientes o gozados
- periodo laborado desde el último corte
- salario ordinario o promedio si era variable

## criterios_de_interpretacion

- no confundir vacaciones gozadas con vacaciones pagadas pendientes
- usar salario ordinario/promedio indicado por la fuente
- pedir días pendientes cuando el sistema no pueda inferirlos con certeza
- contrastar con la fuente primaria local cuando la pregunta pida artículo, causal, excepción o fundamento legal detallado
- no extrapolar reglas de otro país ni tasas administrativas no confirmadas en el corpus

## guia_para_respuestas_llm

- Responder en español claro, con alcance informativo y sin presentarlo como asesoría legal profesional.
- Citar este archivo, su versión y la fuente primaria local cuando se use para una respuesta.
- Si faltan datos mínimos, hacer 2 o 3 preguntas concretas antes de calcular.
- Si el usuario pide un monto, usar el motor determinístico disponible; no hacer aritmética libre con el LLM.
- Si la consulta involucra conflicto, salario variable, pagos parciales, fueros, convenio especial o una causal discutida, marcar incertidumbre y recomendar revisión legal/contable profesional.

## formula_documentada

La fórmula operativa existente en este archivo es:

- `salario_diario = salario_mensual / 30`
- `dias_vacaciones = calcular_segun_escala(anos_antiguedad)`
- `vacaciones_pendientes = salario_diario * dias_vacaciones * 1.25`

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
