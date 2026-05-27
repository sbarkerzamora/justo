---
country: pe
topic: indemnizacion
version: pe-v0.1.0
status: proposed
source: "Ley General de Trabajo de Peru"
last_reviewed: "2026-05-11"
---

# Indemnizacion por despido arbitrario

## base_legal

- Art. 167: Indemnizacion escalonada segun anos de servicio.

## regla_operativa

- Anos 1 a 8: 45 dias de remuneracion ordinaria por cada ano.
- Anos 9 a 16: 30 dias por cada ano.
- Anos 17 en adelante: 15 dias por cada ano.
- Maximo: 720 dias (24 meses).
- Minimo: 90 dias.

## formula

- `salario_diario = salario_mensual / 30`
- `tramo1 = min(anos, 8) * 45`
- `tramo2 = max(min(anos - 8, 8), 0) * 30`
- `tramo3 = max(anos - 16, 0) * 15`
- `dias_indemnizacion = min(max(tramo1 + tramo2 + tramo3, 90), 720)`
- `indemnizacion = salario_diario * dias_indemnizacion`

## vigencia_fuente

- Ley General de Trabajo de Peru, Art. 167.

## alcance_documental

- País: Perú.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Fuente declarada del resumen: Ley General de Trabajo de Peru.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 167: Indemnizacion escalonada segun anos de servicio.

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
- `tramo1 = min(anos, 8) * 45`
- `tramo2 = max(min(anos - 8, 8), 0) * 30`
- `tramo3 = max(anos - 16, 0) * 15`
- `dias_indemnizacion = min(max(tramo1 + tramo2 + tramo3, 90), 720)`
- `indemnizacion = salario_diario * dias_indemnizacion`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
