---
country: cl
topic: indemnizacion
version: cl-v0.1.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Indemnizacion por anos de servicio

## base_legal

- Art. 163: 30 dias de ultima remuneracion por cada ano, fraccion >6 meses = ano completo.
- Art. 161-162: Indemnizacion sustitutiva del aviso previo (1 mes).
- Maximo: 330 dias (11 anos).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion_anos = min(anos_antiguedad, 11) * 30 * salario_diario`
- `aviso_sustitutivo = salario_mensual`
- `total = indemnizacion_anos + aviso_sustitutivo`

## vigencia_fuente

- Codigo del Trabajo de Chile, Arts. 161, 162, 163.

## alcance_documental

- País: Chile.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: Codigo del Trabajo de Chile.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 163: 30 dias de ultima remuneracion por cada ano, fraccion >6 meses = ano completo.
- Art. 161-162: Indemnizacion sustitutiva del aviso previo (1 mes).
- Maximo: 330 dias (11 anos).

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
- `indemnizacion_anos = min(anos_antiguedad, 11) * 30 * salario_diario`
- `aviso_sustitutivo = salario_mensual`
- `total = indemnizacion_anos + aviso_sustitutivo`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
