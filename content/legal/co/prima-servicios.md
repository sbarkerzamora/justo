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

## alcance_documental

- País: Colombia.
- Tema operativo: `prima-servicios`.
- Fuente primaria local para contraste: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Fuente declarada del resumen: Codigo Sustantivo del Trabajo de Colombia.
- Estado del documento: `proposed`.
- Uso previsto: Explica la prima de servicios, su proporcionalidad y cómo documentarla dentro de una liquidación laboral.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 306: 30 dias de salario por ano, pagaderos en dos cuotas.
- Art. 307: La prima no constituye salario.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo semestral aplicable
- días laborados en el periodo
- salario base o promedio
- pagos ya efectuados

## criterios_de_interpretacion

- separar prima de servicios de cesantía y vacaciones
- usar proporcionalidad cuando no se completó el periodo
- pedir salario promedio si hubo variables salariales
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
- `prima_proporcional = salario_diario * 15 * (dias_semestre / 181) * 2`

## preguntas_sugeridas

- ¿Qué semestre estás liquidando?
- ¿Cuántos días trabajaste en ese periodo?
- ¿Cuál fue tu salario base o promedio?

## ejemplos_de_consulta

- "¿Cómo aplica prima-servicios en mi liquidación?"
- "¿Qué datos necesito para revisar prima-servicios?"
