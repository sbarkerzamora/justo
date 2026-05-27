---
country: hn
topic: vacaciones
version: hn-v0.1.0
status: proposed
source: "Codigo de Trabajo de Honduras, Decreto 189-59"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 346: Dias de vacaciones segun anos de servicio.
- Art. 349: Al terminar, se pagan vacaciones no gozadas.
- Art. 352: Base de calculo = promedio ordinario ultimos 6 meses.

## regla_operativa

- 1 ano: 10 dias habiles.
- 2 anos: 12 dias habiles.
- 3 anos: 15 dias habiles.
- 4 anos o mas: 20 dias habiles.
- Se pagan vacaciones pendientes no gozadas al cierre.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## variables

- `salario_mensual`
- `dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Honduras, Decreto 189-59, Arts. 346, 349, 352.

## alcance_documental

- País: Honduras.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `OpenL-2605112256.md` (Código de Trabajo de Honduras).
- Fuente declarada del resumen: Codigo de Trabajo de Honduras, Decreto 189-59.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 346: Dias de vacaciones segun anos de servicio.
- Art. 349: Al terminar, se pagan vacaciones no gozadas.
- Art. 352: Base de calculo = promedio ordinario ultimos 6 meses.

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
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `dias_vacaciones_pendientes`

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
