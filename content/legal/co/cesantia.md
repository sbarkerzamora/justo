---
country: co
topic: cesantia
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo de Colombia"
last_reviewed: "2026-05-11"
---

# Cesantia

## base_legal

- Art. 249: 1 mes (30 dias) de salario por cada ano de servicio, proporcional por fraccion.
- Art. 253: Base: ultimo salario mensual o promedio del ultimo ano si hubo variaciones.
- Ley 52 de 1975: Intereses del 12% anual sobre cesantias.

## regla_operativa

- 30 dias de salario por cada ano trabajado.
- Fracciones de ano proporcionales.
- Mas intereses del 12% anual sobre el valor de las cesantias.

## formula

- `salario_diario = salario_mensual / 30`
- `cesantia = salario_diario * anos_antiguedad * 30`
- `intereses_cesantia = cesantia * 0.12`

## vigencia_fuente

- Codigo Sustantivo del Trabajo, Arts. 249, 253. Ley 52 de 1975.

## alcance_documental

- País: Colombia.
- Tema operativo: `cesantia`.
- Fuente primaria local para contraste: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Fuente declarada del resumen: Codigo Sustantivo del Trabajo de Colombia.
- Estado del documento: `proposed`.
- Uso previsto: Resume la cesantía, su acumulación y su tratamiento en una liquidación o terminación laboral.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 249: 1 mes (30 dias) de salario por cada ano de servicio, proporcional por fraccion.
- Art. 253: Base: ultimo salario mensual o promedio del ultimo ano si hubo variaciones.
- Ley 52 de 1975: Intereses del 12% anual sobre cesantias.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- salario base o promedio
- días trabajados en el año o periodo
- consignaciones o anticipos ya realizados

## criterios_de_interpretacion

- no duplicar cesantías ya consignadas o pagadas
- verificar periodo exacto
- separar intereses de cesantía cuando correspondan
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
- `cesantia = salario_diario * anos_antiguedad * 30`
- `intereses_cesantia = cesantia * 0.12`

## preguntas_sugeridas

- ¿Qué periodo de cesantías está pendiente?
- ¿Hubo consignaciones o anticipos?
- ¿Cuál fue el salario base o promedio?

## ejemplos_de_consulta

- "¿Cómo aplica cesantia en mi liquidación?"
- "¿Qué datos necesito para revisar cesantia?"
