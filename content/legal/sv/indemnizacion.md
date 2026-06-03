---
country: sv
topic: indemnizacion
version: sv-v0.2.0
status: proposed
source: "Codigo de Trabajo de El Salvador"
last_reviewed: "2026-05-11"
---

# Indemnizacion (Cesantia)

## base_legal

- Art. 58: Indemnizacion por despido injustificado en contrato por tiempo indeterminado.
- Art. 59: Indemnizacion en contrato a plazo fijo.

## texto_legal

**Art. 58.-** Cuando un trabajador contratado por tiempo indefinido, fuere despedido de sus labores sin causa justificada, tendrá derecho a que el patrono le indemnice con una cantidad equivalente al salario básico de treinta días por cada año de servicios y proporcionalmente por fracciones de año. En ningún caso la indemnización será menor del equivalente al salario básico de quince días.

Para los efectos del cálculo de la indemnización a que se refiere el inciso anterior, ningún salario podrá ser superior a cuatro veces el salario mínimo diario legal vigente.

**Art. 59.-** Cuando el contrato sea a plazo y el trabajador fuere despedido sin causa justificada, antes de su vencimiento, tendrá derecho a que se le indemnice con una cantidad equivalente al salario básico que hubiere devengado en el tiempo que faltare para que venza el plazo, pero en ningún caso la indemnización podrá exceder de la que le correspondería si hubiere sido contratado por tiempo indefinido.

## regla_operativa

- 30 dias de salario por cada ano de servicio.
- Fracciones de ano se pagan proporcionalmente.
- Minimo: 15 dias de salario.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = max(anos_antiguedad * 30, 15)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## vigencia_fuente

- Codigo de Trabajo de El Salvador, Arts. 58 y 59.

## alcance_documental

- País: El Salvador.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `OpenL-2605112301.md` (Código de Trabajo de El Salvador).
- Fuente declarada del resumen: Codigo de Trabajo de El Salvador.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 58: Indemnizacion por despido injustificado en contrato por tiempo indeterminado.
- Art. 59: Indemnizacion en contrato a plazo fijo.

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
- `dias_indemnizacion = max(anos_antiguedad * 30, 15)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `fecha_inicio`
- `fecha_salida`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
