---
country: co
topic: indemnizacion
version: co-v0.1.0
status: proposed
source: "Codigo Sustantivo del Trabajo de Colombia"
last_reviewed: "2026-05-11"
---

# Indemnizacion por Despido Sin Justa Causa

## base_legal

- Art. 64: Indemnizacion escalonada segun salario y antiguedad.

## regla_operativa

- Salario menor a 10 SMMLV:
  - Primer ano: 30 dias de salario.
  - Anos adicionales: 20 dias por cada ano.
- Salario mayor o igual a 10 SMMLV:
  - Primer ano: 20 dias de salario.
  - Anos adicionales: 15 dias por cada ano.
- En el MVP se usa el tramo de menor salario (<10 SMMLV).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion = salario_diario * (30 + max(anos_antiguedad - 1, 0) * 20)`

## vigencia_fuente

- Codigo Sustantivo del Trabajo de Colombia, Art. 64.

## alcance_documental

- País: Colombia.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Fuente declarada del resumen: Codigo Sustantivo del Trabajo de Colombia.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 64: Indemnizacion escalonada segun salario y antiguedad.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- tipo de terminación y causa invocada
- fecha de inicio y fecha de salida
- salario ordinario mensual o promedio aplicable
- si hubo preaviso, pagos parciales o acuerdos previos

## criterios_de_interpretacion

- distinguir derecho a indemnización de pago de prestaciones proporcionales
- aplicar topes, tramos o mínimos solo si están expresamente en la base legal
- no asumir despido injustificado si el usuario solo dice que terminó la relación
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
- `indemnizacion = salario_diario * (30 + max(anos_antiguedad - 1, 0) * 20)`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
