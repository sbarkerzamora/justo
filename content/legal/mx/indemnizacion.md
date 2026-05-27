---
country: mx
topic: indemnizacion
version: mx-v0.1.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Indemnizacion

## base_legal

- Art. 48: Indemnizacion constitucional de 3 meses de salario por despido injustificado.
- Art. 50: Indemnizacion adicional de 12 dias de salario por cada ano de servicio (reforma 2019).
- Art. 162: Prima de antiguedad de 12 dias por ano, tope de 2 salarios minimos.

## regla_operativa

- Indemnizacion constitucional: 3 meses de salario (90 dias).
- Indemnizacion por anos: 12 dias de salario por cada ano trabajado.
- Prima de antiguedad: 12 dias de salario por ano, con tope de 2 salarios minimos.
- En el MVP se usa el salario mensual sin aplicar el tope del salario minimo (pendiente integracion de UMA/salario minimo regional).

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion_constitucional = salario_diario * 90`
- `indemnizacion_anual = salario_diario * anos_antiguedad * 12`
- `prima_antiguedad = salario_diario * anos_antiguedad * 12`
- `total_indemnizacion = indemnizacion_constitucional + indemnizacion_anual + prima_antiguedad`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Arts. 48, 50, 162.

## alcance_documental

- País: México.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `1044_Ley_Federal_del_Trabajo.md` (Ley Federal del Trabajo).
- Fuente declarada del resumen: Ley Federal del Trabajo de Mexico.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 48: Indemnizacion constitucional de 3 meses de salario por despido injustificado.
- Art. 50: Indemnizacion adicional de 12 dias de salario por cada ano de servicio (reforma 2019).
- Art. 162: Prima de antiguedad de 12 dias por ano, tope de 2 salarios minimos.

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
- `indemnizacion_constitucional = salario_diario * 90`
- `indemnizacion_anual = salario_diario * anos_antiguedad * 12`
- `prima_antiguedad = salario_diario * anos_antiguedad * 12`
- `total_indemnizacion = indemnizacion_constitucional + indemnizacion_anual + prima_antiguedad`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
