---
country: pa
topic: vacaciones
version: pa-v0.2.0
status: proposed
source: "Codigo de Trabajo de Panama"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 54: 30 dias de vacaciones por cada 11 meses de trabajo continuo.
- Tasa: 1 dia por cada 11 dias trabajados.

## texto_legal

**Artículo 54. Vacaciones.** La duración y la remuneración de las vacaciones se regirá por las siguientes normas:
- Treinta días por cada once meses continuos de trabajo, a razón de un día por cada once días al servicio de su empleador.
- Pago de un mes de salario cuando la remuneración se hubiere convenido por un mes, y de cuatro semanas y un tercio, cuando se hubiere pactado por semana.
- Cuando se trate de trabajadores pagados por hora o por día se dividirá el total de la remuneración ordinaria y extraordinaria, que hubiera recibido el trabajador en los últimos once meses de servicio por el número de jornadas ordinarias servidas, o tiempo menor servido si se trata de vacaciones proporcionales, y este cociente se multiplicará por el número de días de descanso anual que le correspondan.
- Para los efectos del cómputo del tiempo servido que da derecho a vacaciones, se contará la duración de los descansos semanales, días de fiesta o duelo nacional, licencias por enfermedad dentro de los límites señalados en el artículo 200, los casos descritos en el artículo 208 u otras interrupciones expresamente autorizadas por el empleador.
- Al trabajador cuya relación termina antes de tener derecho al período completo de descanso, se le pagarán en efectivo los días de vacaciones proporcionales a que tenga derecho a razón de un día por cada once días de trabajo.

## regla_operativa

- 30 dias de vacaciones remuneradas por cada 11 meses de servicio.
- Al terminar la relacion, se pagan proporcionalmente.
- Base: promedio ordinario + extraordinario ultimos 11 meses.

## formula

- `salario_diario = salario_mensual / 30`
- `vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`

## vigencia_fuente

- Codigo de Trabajo de Panama, Art. 54.

## alcance_documental

- País: Panamá.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `codigo-de-trabajo-panama.md` (Código de Trabajo de Panamá).
- Fuente declarada del resumen: Codigo de Trabajo de Panama.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 54: 30 dias de vacaciones por cada 11 meses de trabajo continuo.
- Tasa: 1 dia por cada 11 dias trabajados.

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

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
